# Rover ROS Client

This client connects the rover's ROS2 system to the central management server, enabling real-time monitoring and control of the rover via WebSockets.

## Requirements

- Node.js 16 or later
- ROS2 (Robot Operating System) installed on the rover
- rclnodejs compatible with your ROS2 version

## Installation

1. Clone this repository or copy this directory to your rover
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` template:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file with your specific configuration:
   - Set `SERVER_URL` to your central server's WebSocket URL
   - Set `ROVER_IDENTIFIER` to the unique identifier for this rover

## Usage

Start the client:

```
node index.js
```

or use the npm script:

```
npm start
```

## ROS2 Integration

The client integrates with ROS2 using rclnodejs and performs the following operations:

1. Creates a ROS2 node named according to your environment configuration
2. Subscribes to command topics to receive control instructions
3. Publishes sensor data to telemetry topics
4. Forwards commands from the central server to the ROS2 system
5. Collects sensor data from the ROS2 system and forwards it to the central server

## Configuration Options

The following environment variables can be configured:

- `SERVER_URL`: WebSocket URL of the central management server
- `ROVER_IDENTIFIER`: Unique identifier for this rover
- `RECONNECT_INTERVAL`: Time in milliseconds to wait before reconnection attempts
- `TELEMETRY_INTERVAL`: Time in milliseconds between telemetry data transmissions
- `ROS_NODE_NAME`: Name of the ROS2 node created by this client
- `ROS_COMMAND_TOPIC`: Topic to subscribe to for command execution
- `ROS_SENSOR_TOPIC`: Topic to publish sensor data to

## Error Handling and Reconnection

The client implements automatic reconnection to the server if the connection is lost. Error logs are written to `rover-client.log` for troubleshooting.

## Running as a System Service

For production use, it's recommended to run the client as a system service using systemd:

1. Create a service file at `/etc/systemd/system/rover-client.service`:
   ```
   [Unit]
   Description=Rover ROS Client
   After=network.target

   [Service]
   Type=simple
   User=your-user
   WorkingDirectory=/path/to/ros-client
   ExecStart=/usr/bin/node index.js
   Restart=always
   RestartSec=10
   StandardOutput=syslog
   StandardError=syslog
   SyslogIdentifier=rover-client
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

2. Reload systemd, enable and start the service:
   ```
   sudo systemctl daemon-reload
   sudo systemctl enable rover-client
   sudo systemctl start rover-client
   ```

3. Check status:
   ```
   sudo systemctl status rover-client
   ```

## Troubleshooting

- Check the `rover-client.log` file for error messages
- Verify that ROS2 is properly installed and configured
- Ensure network connectivity to the central server
- Check firewall settings to allow WebSocket connections