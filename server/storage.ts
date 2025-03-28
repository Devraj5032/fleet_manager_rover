import { 
  users, type User, type InsertUser,
  rovers, type Rover, type InsertRover,
  sensorData, type SensorData, type InsertSensorData,
  commandLogs, type CommandLog, type InsertCommandLog,
  roverClients, type RoverClient, type InsertRoverClient
} from "@shared/schema";
import { PostgresStorage } from './pg-storage';
import { initializeDatabase } from './db';
import { log } from './vite';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@shared/schema';

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Rover operations
  getRover(id: number): Promise<Rover | undefined>;
  getRoverByIdentifier(identifier: string): Promise<Rover | undefined>;
  getAllRovers(): Promise<Rover[]>;
  createRover(rover: InsertRover): Promise<Rover>;
  updateRover(id: number, rover: Partial<Rover>): Promise<Rover | undefined>;
  
  // Sensor data operations
  getSensorData(id: number): Promise<SensorData | undefined>;
  getSensorDataByRoverId(roverId: number, limit?: number): Promise<SensorData[]>;
  createSensorData(data: InsertSensorData): Promise<SensorData>;
  
  // Command log operations
  getCommandLog(id: number): Promise<CommandLog | undefined>;
  getCommandLogsByRoverId(roverId: number, limit?: number): Promise<CommandLog[]>;
  createCommandLog(log: InsertCommandLog): Promise<CommandLog>;
  updateCommandLog(id: number, log: Partial<CommandLog>): Promise<CommandLog | undefined>;
  
  // Rover client operations
  getRoverClient(id: number): Promise<RoverClient | undefined>;
  getRoverClientByRoverId(roverId: number): Promise<RoverClient | undefined>;
  getRoverClientBySocketId(socketId: string): Promise<RoverClient | undefined>;
  getAllRoverClients(): Promise<RoverClient[]>;
  createRoverClient(client: InsertRoverClient): Promise<RoverClient>;
  updateRoverClient(id: number, client: Partial<RoverClient>): Promise<RoverClient | undefined>;
  deleteRoverClient(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rovers: Map<number, Rover>;
  private sensorDataItems: Map<number, SensorData>;
  private commandLogs: Map<number, CommandLog>;
  private roverClients: Map<number, RoverClient>;
  
  private userCurrentId: number;
  private roverCurrentId: number;
  private sensorDataCurrentId: number;
  private commandLogCurrentId: number;
  private roverClientCurrentId: number;

  constructor() {
    this.users = new Map();
    this.rovers = new Map();
    this.sensorDataItems = new Map();
    this.commandLogs = new Map();
    this.roverClients = new Map();
    
    this.userCurrentId = 1;
    this.roverCurrentId = 1;
    this.sensorDataCurrentId = 1;
    this.commandLogCurrentId = 1;
    this.roverClientCurrentId = 1;
    
    // Add some sample rovers
    this.createRover({
      name: "Rover Alpha",
      identifier: "R-001",
      ipAddress: "192.168.1.101"
    });
    
    this.createRover({
      name: "Rover Beta",
      identifier: "R-002",
      ipAddress: "192.168.1.102"
    });
    
    this.createRover({
      name: "Rover Delta",
      identifier: "R-004",
      ipAddress: "192.168.1.104"
    });
    
    log('Using in-memory storage', 'storage');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Rover operations
  async getRover(id: number): Promise<Rover | undefined> {
    return this.rovers.get(id);
  }
  
  async getRoverByIdentifier(identifier: string): Promise<Rover | undefined> {
    return Array.from(this.rovers.values()).find(
      (rover) => rover.identifier === identifier
    );
  }
  
  async getAllRovers(): Promise<Rover[]> {
    return Array.from(this.rovers.values());
  }
  
  async createRover(insertRover: InsertRover): Promise<Rover> {
    const id = this.roverCurrentId++;
    const rover: Rover = { 
      ...insertRover, 
      id, 
      connected: false, 
      status: "disconnected",
      batteryLevel: 100,
      lastSeen: new Date(),
      ipAddress: insertRover.ipAddress || null,
      metadata: {}
    };
    this.rovers.set(id, rover);
    return rover;
  }
  
  async updateRover(id: number, rover: Partial<Rover>): Promise<Rover | undefined> {
    const existingRover = await this.getRover(id);
    if (!existingRover) return undefined;
    
    const updatedRover = { ...existingRover, ...rover };
    this.rovers.set(id, updatedRover);
    return updatedRover;
  }
  
  // Sensor data operations
  async getSensorData(id: number): Promise<SensorData | undefined> {
    return this.sensorDataItems.get(id);
  }
  
  async getSensorDataByRoverId(roverId: number, limit = 100): Promise<SensorData[]> {
    return Array.from(this.sensorDataItems.values())
      .filter(data => data.roverId === roverId)
      .sort((a, b) => {
        // Handle potential null timestamps
        const timeA = a.timestamp?.getTime() || 0;
        const timeB = b.timestamp?.getTime() || 0;
        return timeB - timeA;
      })
      .slice(0, limit);
  }
  
  async createSensorData(insertData: InsertSensorData): Promise<SensorData> {
    const id = this.sensorDataCurrentId++;
    
    // Ensure all fields have proper values according to schema
    const data: SensorData = {
      id,
      roverId: insertData.roverId,
      timestamp: new Date(),
      batteryLevel: insertData.batteryLevel || null,
      temperature: insertData.temperature || null,
      humidity: insertData.humidity || null,
      pressure: insertData.pressure || null,
      altitude: insertData.altitude || null,
      heading: insertData.heading || null,
      speed: insertData.speed || null,
      tilt: insertData.tilt || null,
      latitude: insertData.latitude || null,
      longitude: insertData.longitude || null,
      signalStrength: insertData.signalStrength || null
    };
    
    this.sensorDataItems.set(id, data);
    return data;
  }
  
  // Command log operations
  async getCommandLog(id: number): Promise<CommandLog | undefined> {
    return this.commandLogs.get(id);
  }
  
  async getCommandLogsByRoverId(roverId: number, limit = 100): Promise<CommandLog[]> {
    return Array.from(this.commandLogs.values())
      .filter(log => log.roverId === roverId)
      .sort((a, b) => {
        // Handle potential null timestamps
        const timeA = a.timestamp?.getTime() || 0;
        const timeB = b.timestamp?.getTime() || 0;
        return timeB - timeA;
      })
      .slice(0, limit);
  }
  
  async createCommandLog(insertLog: InsertCommandLog): Promise<CommandLog> {
    const id = this.commandLogCurrentId++;
    
    const log: CommandLog = {
      id,
      roverId: insertLog.roverId,
      command: insertLog.command,
      timestamp: new Date(),
      status: insertLog.status || null,
      response: insertLog.response || null
    };
    
    this.commandLogs.set(id, log);
    return log;
  }
  
  async updateCommandLog(id: number, log: Partial<CommandLog>): Promise<CommandLog | undefined> {
    const existingLog = await this.getCommandLog(id);
    if (!existingLog) return undefined;
    
    const updatedLog = { ...existingLog, ...log };
    this.commandLogs.set(id, updatedLog);
    return updatedLog;
  }
  
  // Rover client operations
  async getRoverClient(id: number): Promise<RoverClient | undefined> {
    return this.roverClients.get(id);
  }
  
  async getRoverClientByRoverId(roverId: number): Promise<RoverClient | undefined> {
    return Array.from(this.roverClients.values()).find(
      client => client.roverId === roverId
    );
  }
  
  async getRoverClientBySocketId(socketId: string): Promise<RoverClient | undefined> {
    return Array.from(this.roverClients.values()).find(
      client => client.socketId === socketId
    );
  }
  
  async getAllRoverClients(): Promise<RoverClient[]> {
    return Array.from(this.roverClients.values());
  }
  
  async createRoverClient(insertClient: InsertRoverClient): Promise<RoverClient> {
    const id = this.roverClientCurrentId++;
    
    const client: RoverClient = {
      id,
      roverId: insertClient.roverId,
      lastPing: new Date(),
      connected: insertClient.connected || null,
      socketId: insertClient.socketId || null
    };
    
    this.roverClients.set(id, client);
    return client;
  }
  
  async updateRoverClient(id: number, client: Partial<RoverClient>): Promise<RoverClient | undefined> {
    const existingClient = await this.getRoverClient(id);
    if (!existingClient) return undefined;
    
    const updatedClient = { ...existingClient, ...client };
    this.roverClients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteRoverClient(id: number): Promise<boolean> {
    return this.roverClients.delete(id);
  }
}

// Default to in-memory storage initially
let storageImplementation: IStorage = new MemStorage();

/**
 * Initialize storage system based on environment configuration
 * If DATABASE_URL is provided, PostgreSQL will be used
 * Otherwise, in-memory storage will be used
 */
export async function initializeStorage(): Promise<IStorage> {
  // Try to initialize PostgreSQL database
  const db = await initializeDatabase();
  
  // If database connection was successful, use PostgreSQL storage
  if (db) {
    log('Switching to PostgreSQL storage', 'storage');
    storageImplementation = new PostgresStorage(db);
  }
  
  return storageImplementation;
}

// Export a reference to the current storage implementation
export const storage: IStorage = storageImplementation;
