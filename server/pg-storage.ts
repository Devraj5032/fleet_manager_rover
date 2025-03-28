/**
 * PostgreSQL storage implementation using Drizzle ORM
 */

import { eq, desc } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@shared/schema';
import { IStorage } from './storage';
import { 
  User, InsertUser,
  Rover, InsertRover,
  SensorData, InsertSensorData,
  CommandLog, InsertCommandLog,
  RoverClient, InsertRoverClient
} from '@shared/schema';

export class PostgresStorage implements IStorage {
  private db: PostgresJsDatabase<typeof schema>;
  
  constructor(db: PostgresJsDatabase<typeof schema>) {
    this.db = db;
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return results[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await this.db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return results[0];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const results = await this.db.insert(schema.users).values(user).returning();
    return results[0];
  }
  
  // Rover operations
  async getRover(id: number): Promise<Rover | undefined> {
    const results = await this.db.select().from(schema.rovers).where(eq(schema.rovers.id, id)).limit(1);
    return results[0];
  }
  
  async getRoverByIdentifier(identifier: string): Promise<Rover | undefined> {
    const results = await this.db.select().from(schema.rovers).where(eq(schema.rovers.identifier, identifier)).limit(1);
    return results[0];
  }
  
  async getAllRovers(): Promise<Rover[]> {
    return await this.db.select().from(schema.rovers);
  }
  
  async createRover(rover: InsertRover): Promise<Rover> {
    const results = await this.db.insert(schema.rovers).values(rover).returning();
    return results[0];
  }
  
  async updateRover(id: number, rover: Partial<Rover>): Promise<Rover | undefined> {
    const results = await this.db.update(schema.rovers)
      .set(rover)
      .where(eq(schema.rovers.id, id))
      .returning();
    
    return results[0];
  }
  
  // Sensor data operations
  async getSensorData(id: number): Promise<SensorData | undefined> {
    const results = await this.db.select().from(schema.sensorData).where(eq(schema.sensorData.id, id)).limit(1);
    return results[0];
  }
  
  async getSensorDataByRoverId(roverId: number, limit = 100): Promise<SensorData[]> {
    return await this.db.select()
      .from(schema.sensorData)
      .where(eq(schema.sensorData.roverId, roverId))
      .orderBy(desc(schema.sensorData.timestamp))
      .limit(limit);
  }
  
  async createSensorData(data: InsertSensorData): Promise<SensorData> {
    const results = await this.db.insert(schema.sensorData).values(data).returning();
    return results[0];
  }
  
  // Command log operations
  async getCommandLog(id: number): Promise<CommandLog | undefined> {
    const results = await this.db.select().from(schema.commandLogs).where(eq(schema.commandLogs.id, id)).limit(1);
    return results[0];
  }
  
  async getCommandLogsByRoverId(roverId: number, limit = 100): Promise<CommandLog[]> {
    return await this.db.select()
      .from(schema.commandLogs)
      .where(eq(schema.commandLogs.roverId, roverId))
      .orderBy(desc(schema.commandLogs.timestamp))
      .limit(limit);
  }
  
  async createCommandLog(log: InsertCommandLog): Promise<CommandLog> {
    const results = await this.db.insert(schema.commandLogs).values(log).returning();
    return results[0];
  }
  
  async updateCommandLog(id: number, log: Partial<CommandLog>): Promise<CommandLog | undefined> {
    const results = await this.db.update(schema.commandLogs)
      .set(log)
      .where(eq(schema.commandLogs.id, id))
      .returning();
    
    return results[0];
  }
  
  // Rover client operations
  async getRoverClient(id: number): Promise<RoverClient | undefined> {
    const results = await this.db.select().from(schema.roverClients).where(eq(schema.roverClients.id, id)).limit(1);
    return results[0];
  }
  
  async getRoverClientByRoverId(roverId: number): Promise<RoverClient | undefined> {
    const results = await this.db.select()
      .from(schema.roverClients)
      .where(eq(schema.roverClients.roverId, roverId))
      .limit(1);
    
    return results[0];
  }
  
  async getRoverClientBySocketId(socketId: string): Promise<RoverClient | undefined> {
    const results = await this.db.select()
      .from(schema.roverClients)
      .where(eq(schema.roverClients.socketId, socketId))
      .limit(1);
    
    return results[0];
  }
  
  async getAllRoverClients(): Promise<RoverClient[]> {
    return await this.db.select().from(schema.roverClients);
  }
  
  async createRoverClient(client: InsertRoverClient): Promise<RoverClient> {
    const results = await this.db.insert(schema.roverClients).values(client).returning();
    return results[0];
  }
  
  async updateRoverClient(id: number, client: Partial<RoverClient>): Promise<RoverClient | undefined> {
    const results = await this.db.update(schema.roverClients)
      .set(client)
      .where(eq(schema.roverClients.id, id))
      .returning();
    
    return results[0];
  }
  
  async deleteRoverClient(id: number): Promise<boolean> {
    const results = await this.db.delete(schema.roverClients)
      .where(eq(schema.roverClients.id, id))
      .returning();
    
    return results.length > 0;
  }
}