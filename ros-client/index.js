/**
 * ROS Client for Rover Hardware
 * 
 * This application:
 * 1. Initializes a ROS2 node using rclnodejs
 * 2. Connects to the cloud server via WebSocket
 * 3. Sends telemetry data from the rover to the server
 * 4. Receives commands from the server and executes them through ROS2
 * 
 * Requirements:
 * - ROS2 installed on the rover
 * - rclnodejs compatible with the ROS2 version
 */

const WebSocket = require('ws');
const rclnodejs = require('rclnodejs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Environment variables
const SERVER_URL = process.env.SERVER_URL || 'ws://localhost:5000';
const ROVER_IDENTIFIER = process.env.ROVER_IDENTIFIER || 'R-001';
const RECONNECT_INTERVAL = parseInt(process.env.RECONNECT_INTERVAL || '5000', 10);
const TELEMETRY_INTERVAL = parseInt(process.env.TELEMETRY_INTERVAL || '2000', 10);
const ROS_NODE_NAME = process.env.ROS_NODE_NAME || 'rover_client';
const ROS_COMMAND_TOPIC = process.env.ROS_COMMAND_TOPIC || '/rover/commands';
const ROS_SENSOR_TOPIC = process.env.ROS_SENSOR_TOPIC || '/rover/sensors';

// Setup logging
const logFile = path.join(__dirname, 'rover-client.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
}

class RoverClient {
  constructor(serverUrl, roverId) {
    this.serverUrl = serverUrl;
    this.roverIdentifier = roverId;
    this.ws = null;
    this.connected = false;
    this.rclNode = null;
    this.sensorPublishers = new Map();
    this.commandSubscription = null;
    this.reconnectInterval = null;
    this.telemetryInterval = null;
    this.pingInterval = null;
    
    log(`Rover client initialized for rover ${this.roverIdentifier}`);
  }

  /**
   * Initialize ROS2 node and connect to server
   */
  async initialize() {
    try {
      // Initialize rclnodejs
      log('Initializing ROS2 node');
      await rclnodejs.init();
      this.rclNode = new rclnodejs.Node(ROS_NODE_NAME);
      
      // Setup ROS2 publishers and subscriptions
      this.setupRosPublishers();
      this.setupRosSubscriptions();
      
      // Start ROS2 node
      this.rclNode.spinOnce();
      
      // Connect to server
      this.connect();
      
      // Setup shutdown handler
      this.setupShutdownHandler();
      
      log('ROS2 node initialization complete');
    } catch (error) {
      log(`Failed to initialize ROS2 node: ${error.message}`);
      this.scheduleReconnect();
    }
  }

  /**
   * Set up ROS2 publishers for sensor data
   */
  setupRosPublishers() {
    try {
      // Create publisher for sensor data
      const sensorPublisher = this.rclNode.createPublisher(
        'std_msgs/msg/String',
        ROS_SENSOR_TOPIC
      );
      
      this.sensorPublishers.set('sensor', sensorPublisher);
      log(`ROS2 publisher created for topic: ${ROS_SENSOR_TOPIC}`);
    } catch (error) {
      log(`Failed to create ROS2 publishers: ${error.message}`);
    }
  }

  /**
   * Set up ROS2 subscriptions for commands
   */
  setupRosSubscriptions() {
    try {
      // Subscribe to command topic
      this.commandSubscription = this.rclNode.createSubscription(
        'std_msgs/msg/String',
        ROS_COMMAND_TOPIC,
        (msg) => {
          log(`Received local ROS2 command: ${msg.data}`);
          this.executeLocalCommand(msg.data);
        }
      );
      
      log(`ROS2 subscription created for topic: ${ROS_COMMAND_TOPIC}`);
    } catch (error) {
      log(`Failed to create ROS2 subscriptions: ${error.message}`);
    }
  }

  /**
   * Connect to the cloud server via WebSocket
   */
  connect() {
    try {
      log(`Connecting to server at ${this.serverUrl}`);
      
      // Close existing connection if any
      if (this.ws) {
        this.ws.terminate();
      }
      
      // Create new WebSocket connection
      this.ws = new WebSocket(this.serverUrl);
      
      // Set up WebSocket event handlers
      this.ws.on('open', () => {
        this.connected = true;
        log('Connected to server');
        
        // Clear reconnect interval if it exists
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
        
        // Register rover with server
        this.sendMessage({
          type: 'registration',
          payload: {
            identifier: this.roverIdentifier,
            timestamp: new Date().toISOString()
          }
        });
        
        // Start sending telemetry data
        this.startTelemetry();
        
        // Setup ping interval to keep connection alive
        this.pingInterval = setInterval(() => {
          if (this.connected) {
            this.sendMessage({
              type: 'ping',
              payload: {
                timestamp: new Date().toISOString()
              }
            });
          }
        }, 30000); // Send ping every 30 seconds
      });
      
      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message);
        } catch (error) {
          log(`Error parsing message: ${error.message}`);
        }
      });
      
      this.ws.on('error', (error) => {
        log(`WebSocket error: ${error.message}`);
      });
      
      this.ws.on('close', () => {
        log('Connection to server closed');
        this.connected = false;
        this.stopTelemetry();
        
        if (this.pingInterval) {
          clearInterval(this.pingInterval);
          this.pingInterval = null;
        }
        
        this.scheduleReconnect();
      });
    } catch (error) {
      log(`Connection error: ${error.message}`);
      this.connected = false;
      this.scheduleReconnect();
    }
  }

  /**
   * Handle incoming messages from the server
   */
  handleMessage(message) {
    log(`Received message from server: ${message.type}`);
    
    switch (message.type) {
      case 'command':
        this.handleCommand(message);
        break;
      case 'ping':
        // Respond to ping with pong
        this.sendMessage({
          type: 'pong',
          payload: {
            timestamp: new Date().toISOString()
          }
        });
        break;
      case 'registration_ack':
        log(`Registration acknowledged by server. Rover ID: ${message.payload.roverId}`);
        this.roverId = message.payload.roverId;
        break;
      default:
        log(`Unknown message type: ${message.type}`);
    }
  }

  /**
   * Handle command messages from the server
   */
  handleCommand(message) {
    const { command, id } = message.payload;
    log(`Received command from server: ${command}`);
    
    try {
      // Execute the command
      this.executeCommand(command);
      
      // Send acknowledgment to server
      this.sendMessage({
        type: 'command_response',
        payload: {
          commandId: id,
          status: 'completed',
          response: `Command '${command}' executed successfully`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      log(`Error executing command: ${error.message}`);
      
      // Send error response to server
      this.sendMessage({
        type: 'command_response',
        payload: {
          commandId: id,
          status: 'failed',
          response: `Error executing command: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * Execute a command received from the server
   */
  executeCommand(command) {
    log(`Executing command: ${command}`);
    
    try {
      // Publish command to ROS2 topic for execution
      if (this.rclNode && this.sensorPublishers.has('sensor')) {
        const msg = new rclnodejs.Message({
          data: command
        });
        
        this.sensorPublishers.get('sensor').publish(msg);
        log(`Published command to ROS2: ${command}`);
        return true;
      } else {
        throw new Error('ROS2 node or publisher not initialized');
      }
    } catch (error) {
      log(`Failed to execute command: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute a command locally received from ROS2
   */
  executeLocalCommand(command) {
    log(`Executing local command: ${command}`);
    
    // Implement local command execution logic
    // This would depend on the specific rover hardware and requirements
    // For now, just send the command to the server for logging
    this.sendMessage({
      type: 'local_command',
      payload: {
        command,
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Start sending telemetry data to the server
   */
  startTelemetry() {
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
    }
    
    log(`Starting telemetry with interval: ${TELEMETRY_INTERVAL}ms`);
    this.telemetryInterval = setInterval(() => {
      if (this.connected) {
        this.sendSensorData();
      }
    }, TELEMETRY_INTERVAL);
  }

  /**
   * Stop sending telemetry data
   */
  stopTelemetry() {
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
      log('Telemetry stopped');
    }
  }

  /**
   * Schedule a reconnection attempt
   */
  scheduleReconnect() {
    if (!this.reconnectInterval) {
      log(`Scheduling reconnect in ${RECONNECT_INTERVAL}ms`);
      this.reconnectInterval = setInterval(() => {
        this.reconnect();
      }, RECONNECT_INTERVAL);
    }
  }

  /**
   * Attempt to reconnect to the server
   */
  reconnect() {
    if (!this.connected) {
      log('Attempting to reconnect...');
      this.connect();
    } else {
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    }
  }

  /**
   * Generate or collect sensor data
   */
  generateSensorData() {
    // In a real implementation, this would collect data from actual sensors
    // For demonstration, we generate random values
    
    return {
      temperature: 20 + Math.random() * 15,
      humidity: 30 + Math.random() * 40,
      pressure: 1000 + Math.random() * 50,
      altitude: 100 + Math.random() * 10,
      heading: Math.random() * 360,
      speed: Math.random() * 10,
      tilt: Math.random() * 15 - 7.5,
      latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
      batteryLevel: 70 + Math.random() * 30,
      signalStrength: 60 + Math.random() * 40
    };
  }

  /**
   * Send sensor data to the server
   */
  sendSensorData() {
    const sensorData = this.generateSensorData();
    log('Sending sensor data to server');
    
    this.sendMessage({
      type: 'telemetry',
      payload: {
        ...sensorData,
        timestamp: new Date().toISOString()
      }
    });
    
    // Also publish to ROS2 topics
    this.publishSensorDataToROS(sensorData);
  }

  /**
   * Publish sensor data to ROS2 topics
   */
  publishSensorDataToROS(sensorData) {
    try {
      if (this.rclNode && this.sensorPublishers.has('sensor')) {
        const msg = new rclnodejs.Message({
          data: JSON.stringify(sensorData)
        });
        
        this.sensorPublishers.get('sensor').publish(msg);
      }
    } catch (error) {
      log(`Failed to publish sensor data to ROS2: ${error.message}`);
    }
  }

  /**
   * Send a message to the server
   */
  sendMessage(message) {
    if (this.ws && this.connected) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        log(`Failed to send message: ${error.message}`);
      }
    }
  }

  /**
   * Set up process shutdown handler
   */
  setupShutdownHandler() {
    process.on('SIGINT', async () => {
      log('Received SIGINT signal. Shutting down...');
      await this.shutdown();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      log('Received SIGTERM signal. Shutting down...');
      await this.shutdown();
      process.exit(0);
    });
  }

  /**
   * Gracefully shut down the rover client
   */
  async shutdown() {
    log('Shutting down rover client');
    
    // Stop telemetry
    this.stopTelemetry();
    
    // Clear ping interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    // Clear reconnect interval
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    // Send disconnection message to server
    if (this.connected) {
      this.sendMessage({
        type: 'disconnect',
        payload: {
          reason: 'shutdown',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Close WebSocket connection
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    // Shutdown ROS2 node
    if (this.rclNode) {
      this.rclNode.destroy();
      await rclnodejs.shutdown();
      this.rclNode = null;
    }
    
    log('Rover client shutdown complete');
  }
}

// Create and initialize rover client
const client = new RoverClient(SERVER_URL, ROVER_IDENTIFIER);

// Start the client
client.initialize().catch(error => {
  log(`Failed to initialize client: ${error.message}`);
  process.exit(1);
});