/**
 * Database Connection Pool Service
 * Optimized connection management for high-performance database operations
 * Part of Phase 4: Performance & Scale
 */

import { Pool, PoolClient, PoolConfig } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { logger } from '../common/logger.service';

interface QueryMetrics {
  totalQueries: number;
  slowQueries: number;
  avgExecutionTime: number;
  errors: number;
  connections: {
    total: number;
    idle: number;
    waiting: number;
  };
}

interface PoolStats {
  totalCount: number;
  idleCount: number;
  waitingCount: number;
}

class ConnectionPoolService {
  private pool: Pool;
  private db: any;
  private isInitialized = false;
  private metrics: QueryMetrics = {
    totalQueries: 0,
    slowQueries: 0,
    avgExecutionTime: 0,
    errors: 0,
    connections: {
      total: 0,
      idle: 0,
      waiting: 0
    }
  };

  constructor() {
    console.log('[Database] Initializing database connection pool...');
    console.log('[Database] DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('[Database] DB_HOST:', process.env.DB_HOST || 'Not set');
    
    let poolConfig: PoolConfig;

    if (process.env.DATABASE_URL) {
      // Use Railway's DATABASE_URL (preferred method)
      console.log('[Database] Using DATABASE_URL for connection');
      poolConfig = {
        connectionString: process.env.DATABASE_URL,
        
        // Connection pool settings for high performance
        min: parseInt(process.env.DB_POOL_MIN || '5'),          // Minimum connections
        max: parseInt(process.env.DB_POOL_MAX || '50'),         // Maximum connections
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // 30 seconds
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000'), // 10 seconds
        
        // Query optimization
        query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '60000'), // 60 seconds
        statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000'), // 30 seconds
        
        // SSL configuration for production
        ssl: process.env.NODE_ENV === 'production' ? {
          rejectUnauthorized: false
        } : false,
        
        // Advanced pool settings
        allowExitOnIdle: false,
        keepAlive: true,
        keepAliveInitialDelayMillis: 0
      };
    } else {
      // Fallback to individual environment variables
      console.log('[Database] Using individual DB environment variables');
      poolConfig = {
        // Connection settings
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'rival_outranker',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        
        // Connection pool settings for high performance
        min: parseInt(process.env.DB_POOL_MIN || '5'),          // Minimum connections
        max: parseInt(process.env.DB_POOL_MAX || '50'),         // Maximum connections
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // 30 seconds
        connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000'), // 10 seconds
        
        // Query optimization
        query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '60000'), // 60 seconds
        statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000'), // 30 seconds
        
        // SSL configuration for production
        ssl: process.env.NODE_ENV === 'production' ? {
          rejectUnauthorized: false
        } : false,
        
        // Advanced pool settings
        allowExitOnIdle: false,
        keepAlive: true,
        keepAliveInitialDelayMillis: 0
      };
    }

    this.pool = new Pool(poolConfig);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.pool.on('connect', (client) => {
      logger.debug('New client connected to database pool');
      
      // Set up client-specific optimizations using direct SQL
      const statementTimeout = process.env.DB_STATEMENT_TIMEOUT || '30000';
      client.query(`SET statement_timeout = ${statementTimeout}`).catch(err => {
        logger.warn('Failed to set statement_timeout', undefined, err.message);
      });
      
      client.query('SET lock_timeout = 10000').catch(err => {
        logger.warn('Failed to set lock_timeout', undefined, err.message);
      });
      
      client.query('SET idle_in_transaction_session_timeout = 300000').catch(err => {
        logger.warn('Failed to set idle_in_transaction_session_timeout', undefined, err.message);
      });
    });

    this.pool.on('acquire', (client) => {
      logger.debug('Client acquired from pool');
    });

    this.pool.on('remove', (client) => {
      logger.debug('Client removed from pool');
    });

    this.pool.on('error', (err, client) => {
      logger.error('Database pool error', undefined, err instanceof Error ? err.message : String(err));
      this.metrics.errors++;
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Test connection
      const client = await this.pool.connect();
      
      // Run basic connectivity test
      const result = await client.query('SELECT NOW()');
      logger.info('Database connection pool initialized successfully');
      logger.info(`Database time: ${result.rows[0].now}`);
      
      client.release();

      // Initialize Drizzle ORM with connection pool
      this.db = drizzle(this.pool, {
        logger: process.env.NODE_ENV === 'development'
      });

      this.isInitialized = true;

      // Start monitoring
      this.startMonitoring();
    } catch (error) {
      logger.error('Failed to initialize database connection pool', undefined, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Get Drizzle database instance
   */
  getDatabase(): any {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Get direct pool client for advanced operations
   */
  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  /**
   * Execute raw query with metrics tracking
   */
  async query(text: string, params?: any[]): Promise<any> {
    const startTime = Date.now();
    this.metrics.totalQueries++;

    try {
      const result = await this.pool.query(text, params);
      
      const executionTime = Date.now() - startTime;
      this.updateExecutionMetrics(executionTime);
      
      return result;
    } catch (error) {
      this.metrics.errors++;
      logger.error('Database query error', undefined, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Execute query within a transaction
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.metrics.errors++;
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute batch operations efficiently
   */
  async batchQuery(queries: Array<{ text: string; params?: any[] }>): Promise<any[]> {
    const client = await this.pool.connect();
    const results: any[] = [];
    
    try {
      await client.query('BEGIN');
      
      for (const query of queries) {
        const startTime = Date.now();
        this.metrics.totalQueries++;
        
        try {
          const result = await client.query(query.text, query.params);
          results.push(result);
          
          const executionTime = Date.now() - startTime;
          this.updateExecutionMetrics(executionTime);
        } catch (error) {
          this.metrics.errors++;
          throw error;
        }
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get connection pool statistics
   */
  getPoolStats(): PoolStats {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  /**
   * Get query metrics
   */
  getMetrics(): QueryMetrics {
    const poolStats = this.getPoolStats();
    
    return {
      ...this.metrics,
      connections: {
        total: poolStats.totalCount,
        idle: poolStats.idleCount,
        waiting: poolStats.waitingCount
      }
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalQueries: 0,
      slowQueries: 0,
      avgExecutionTime: 0,
      errors: 0,
      connections: {
        total: 0,
        idle: 0,
        waiting: 0
      }
    };
  }

  /**
   * Check database health
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: {
      connected: boolean;
      pool: PoolStats;
      metrics: QueryMetrics;
      responseTime: number;
    };
  }> {
    const startTime = Date.now();
    
    try {
      const result = await this.query('SELECT 1 as health');
      const responseTime = Date.now() - startTime;
      const poolStats = this.getPoolStats();
      const metrics = this.getMetrics();
      
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      // Determine health status
      if (responseTime > 1000 || metrics.errors > 10) {
        status = 'degraded';
      }
      if (responseTime > 5000 || metrics.errors > 50 || poolStats.waitingCount > 10) {
        status = 'unhealthy';
      }
      
      return {
        status,
        details: {
          connected: true,
          pool: poolStats,
          metrics,
          responseTime
        }
      };
    } catch (error) {
      logger.error('Database health check failed', undefined, error instanceof Error ? error.message : String(error));
      
      return {
        status: 'unhealthy',
        details: {
          connected: false,
          pool: this.getPoolStats(),
          metrics: this.getMetrics(),
          responseTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Optimize connection pool settings based on current load
   */
  async optimizePool(): Promise<void> {
    const stats = this.getPoolStats();
    const metrics = this.getMetrics();
    
    // If we have many waiting connections, consider scaling
    if (stats.waitingCount > 5 && stats.totalCount < 50) {
      logger.info('High connection demand detected, pool may need scaling');
    }
    
    // If average execution time is high, log for investigation
    if (metrics.avgExecutionTime > 1000) {
      logger.warn(`High average query execution time: ${metrics.avgExecutionTime}ms`);
    }
    
    // If error rate is high, log for investigation
    if (metrics.errors > 0 && metrics.totalQueries > 0) {
      const errorRate = (metrics.errors / metrics.totalQueries) * 100;
      if (errorRate > 5) {
        logger.warn(`High error rate detected: ${errorRate.toFixed(2)}%`);
      }
    }
  }

  /**
   * Close all connections and shutdown pool
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down database connection pool...');
    
    try {
      await this.pool.end();
      this.isInitialized = false;
      logger.info('Database connection pool closed successfully');
    } catch (error) {
      logger.error('Error closing database connection pool', undefined, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Update execution time metrics
   */
  private updateExecutionMetrics(executionTime: number): void {
    // Track slow queries (> 1 second)
    if (executionTime > 1000) {
      this.metrics.slowQueries++;
      logger.warn(`Slow query detected: ${executionTime}ms`);
    }
    
    // Calculate running average
    const totalTime = this.metrics.avgExecutionTime * (this.metrics.totalQueries - 1) + executionTime;
    this.metrics.avgExecutionTime = totalTime / this.metrics.totalQueries;
  }

  /**
   * Start background monitoring
   */
  private startMonitoring(): void {
    // Monitor pool health every 30 seconds
    setInterval(() => {
      this.optimizePool().catch(error => {
        logger.error('Error during pool optimization', undefined, error instanceof Error ? error.message : String(error));
      });
    }, 30000);
    
    // Log metrics every 5 minutes
    setInterval(() => {
      const metrics = this.getMetrics();
      logger.info('Database metrics', undefined, {
        totalQueries: metrics.totalQueries,
        slowQueries: metrics.slowQueries,
        avgExecutionTime: Math.round(metrics.avgExecutionTime),
        errors: metrics.errors,
        connections: metrics.connections
      });
    }, 300000);
  }
}

// Singleton instance
export const connectionPoolService = new ConnectionPoolService();

// Query optimization helpers
export const QueryOptimization = {
  /**
   * Create optimized query with proper indexing hints
   */
  optimizeSelect(table: string, conditions: Record<string, any>, options: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    useIndex?: string;
  } = {}): { text: string; params: any[] } {
    const params: any[] = [];
    const whereConditions: string[] = [];
    
    let paramIndex = 1;
    for (const [key, value] of Object.entries(conditions)) {
      whereConditions.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }
    
    let query = `SELECT * FROM ${table}`;
    
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy}`;
    }
    
    if (options.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
      paramIndex++;
    }
    
    if (options.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(options.offset);
    }
    
    return { text: query, params };
  },

  /**
   * Create bulk insert query for better performance
   */
  createBulkInsert(table: string, records: Record<string, any>[]): { text: string; params: any[] } {
    if (records.length === 0) {
      throw new Error('No records provided for bulk insert');
    }
    
    const columns = Object.keys(records[0]);
    const params: any[] = [];
    const valueStrings: string[] = [];
    
    let paramIndex = 1;
    for (const record of records) {
      const recordValues: string[] = [];
      for (const column of columns) {
        recordValues.push(`$${paramIndex}`);
        params.push(record[column]);
        paramIndex++;
      }
      valueStrings.push(`(${recordValues.join(', ')})`);
    }
    
    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES ${valueStrings.join(', ')}
      RETURNING id
    `;
    
    return { text: query, params };
  }
};