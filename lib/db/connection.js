import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/shared/schemas/index';
// Database connection configuration
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/rivaloutranker2';
// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
});
// Create Drizzle database instance
export const db = drizzle(pool, { schema });
// Connection test function
export async function testConnection() {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('[Database] Connection successful');
        return true;
    }
    catch (error) {
        console.error('[Database] Connection failed:', error);
        return false;
    }
}
// Graceful shutdown
export async function closeConnection() {
    try {
        await pool.end();
        console.log('[Database] Connection closed');
    }
    catch (error) {
        console.error('[Database] Error closing connection:', error);
    }
}
