import { Pool } from 'pg';
import * as schema from '@/shared/schemas/index';
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
export declare function testConnection(): Promise<boolean>;
export declare function closeConnection(): Promise<void>;
