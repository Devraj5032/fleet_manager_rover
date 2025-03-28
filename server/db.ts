/**
 * Database connection configuration
 * Supports both PostgreSQL and in-memory storage based on environment variables
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from './vite';

// Load environment variables
dotenv.config();

// Get current file directory for migrations path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Initialize database connection if DATABASE_URL is provided
 * Otherwise, return null to use in-memory storage
 */
export async function initializeDatabase() {
  if (!DATABASE_URL) {
    log('No DATABASE_URL provided, using in-memory storage', 'db');
    return null;
  }
  
  try {
    log(`Connecting to PostgreSQL database: ${DATABASE_URL.split('@')[1]}`, 'db');
    
    // Setup client for migrations
    const migrationClient = postgres(DATABASE_URL, { max: 1 });
    
    // Setup client for queries
    const queryClient = postgres(DATABASE_URL);
    
    // Create drizzle instance
    const db = drizzle(queryClient, { schema });
    
    // Run migrations in production (AWS deployment)
    if (NODE_ENV === 'production') {
      log('Running database migrations...', 'db');
      await migrate(drizzle(migrationClient), {
        migrationsFolder: path.join(__dirname, '../drizzle')
      });
      log('Database migrations completed successfully', 'db');
    }
    
    log('PostgreSQL database connection established', 'db');
    return db;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Failed to connect to PostgreSQL database: ${errorMessage}`, 'db');
    log('Falling back to in-memory storage', 'db');
    return null;
  }
}