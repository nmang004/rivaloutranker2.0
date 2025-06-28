/**
 * Redis Cache Service
 * High-performance caching layer for analysis results and API responses
 * Part of Phase 4: Performance & Scale
 */

import Redis from 'ioredis';
import { logger } from '../common/logger.service';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  compress?: boolean; // Whether to compress large objects
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  errors: number;
}

class RedisService {
  private client: Redis;
  private connected: boolean = false;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0
  };

  constructor() {
    // Handle Railway Redis connection
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    // Parse Railway Redis URL format
    let redisConfig: any;
    
    if (process.env.REDIS_URL && process.env.REDIS_URL.includes('railway.internal')) {
      // Railway internal networking - use public URL instead
      const publicUrl = process.env.REDIS_PUBLIC_URL || process.env.REDIS_URL;
      
      redisConfig = {
        enableReadyCheck: false, // Disable ready check for Railway
        maxRetriesPerRequest: 5,
        lazyConnect: false, // Connect immediately
        keyPrefix: 'rival-outranker:',
        connectTimeout: 30000, // Increased timeout
        commandTimeout: 10000,
        retryDelayOnFailover: 1000,
        family: 4, // Force IPv4
        keepAlive: 30000,
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          return err.message.includes(targetError);
        }
      };
      
      this.client = new Redis(publicUrl, redisConfig);
    } else if (process.env.REDIS_URL) {
      // Standard Redis URL
      redisConfig = {
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keyPrefix: 'rival-outranker:',
        connectTimeout: 10000,
        commandTimeout: 5000,
        retryDelayOnFailover: 100,
        family: 4, // Force IPv4
        keepAlive: 30000
      };
      
      this.client = new Redis(redisUrl, redisConfig);
    } else {
      // Fallback to individual config
      redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keyPrefix: 'rival-outranker:',
        connectTimeout: 10000,
        commandTimeout: 5000,
        retryDelayOnFailover: 100,
        family: 4,
        keepAlive: 30000
      };
      
      this.client = new Redis(redisConfig);
    }

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      logger.info('Redis client connected');
      this.connected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('error', (err) => {
      logger.error('Redis client error', undefined, err.message);
      this.stats.errors++;
      this.connected = false;
    });

    this.client.on('close', () => {
      logger.warn('Redis client connection closed');
      this.connected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.connected = true;
      logger.info('Redis connection established');
    } catch (error) {
      logger.error('Failed to connect to Redis', undefined, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      this.connected = false;
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error disconnecting from Redis', undefined, error instanceof Error ? error.message : String(error));
    }
  }

  isConnected(): boolean {
    return this.connected && this.client.status === 'ready';
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected()) {
        logger.warn('Redis not connected, cache miss for key', undefined, key);
        this.stats.misses++;
        return null;
      }

      const value = await this.client.get(key);
      
      if (value === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return JSON.parse(value);
    } catch (error) {
      logger.error('Redis GET error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        logger.warn('Redis not connected, cannot cache key', undefined, key);
        return false;
      }

      const serialized = JSON.stringify(value);
      const { ttl = 3600 } = options; // Default 1 hour TTL

      await this.client.setex(key, ttl, serialized);
      this.stats.sets++;
      return true;
    } catch (error) {
      logger.error('Redis SET error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        return false;
      }

      const result = await this.client.del(key);
      this.stats.deletes++;
      return result > 0;
    } catch (error) {
      logger.error('Redis DELETE error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        return false;
      }

      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Set expiration for key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        return false;
      }

      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXPIRE error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (!this.isConnected() || keys.length === 0) {
        return keys.map(() => null);
      }

      const values = await this.client.mget(keys);
      
      return values.map(value => {
        if (value === null) {
          this.stats.misses++;
          return null;
        }
        this.stats.hits++;
        return JSON.parse(value);
      });
    } catch (error) {
      logger.error('Redis MGET error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return keys.map(() => null);
    }
  }

  /**
   * Delete keys by pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      if (!this.isConnected()) {
        return 0;
      }

      const keys = await this.client.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      const result = await this.client.del(...keys);
      this.stats.deletes += result;
      return result;
    } catch (error) {
      logger.error('Redis DELETE PATTERN error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { hitRate: number; isConnected: boolean } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      isConnected: this.isConnected()
    };
  }

  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0
    };
  }

  /**
   * Flush all cache data
   */
  async flushAll(): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        return false;
      }

      await this.client.flushall();
      logger.info('Redis cache flushed');
      return true;
    } catch (error) {
      logger.error('Redis FLUSHALL error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return false;
    }
  }

  /**
   * Get Redis info
   */
  async getInfo(): Promise<string | null> {
    try {
      if (!this.isConnected()) {
        return null;
      }

      return await this.client.info();
    } catch (error) {
      logger.error('Redis INFO error', undefined, error instanceof Error ? error.message : String(error));
      this.stats.errors++;
      return null;
    }
  }
}

// Singleton instance
export const redisService = new RedisService();

// Cache key generators for different data types
export const CacheKeys = {
  // Analysis results - TTL: 1 hour
  analysis: (url: string, type: string) => `analysis:${type}:${Buffer.from(url).toString('base64')}`,
  
  // Enhanced audit results - TTL: 4 hours
  audit: (auditId: string) => `audit:${auditId}`,
  
  // Site crawl data - TTL: 6 hours  
  crawl: (url: string, depth: number) => `crawl:${Buffer.from(url).toString('base64')}:${depth}`,
  
  // User session data - TTL: 24 hours
  session: (userId: string) => `session:${userId}`,
  
  // API rate limiting - TTL: 15 minutes
  rateLimit: (ip: string, endpoint: string) => `rate:${ip}:${endpoint}`,
  
  // Competitor analysis - TTL: 12 hours
  competitors: (url: string) => `competitors:${Buffer.from(url).toString('base64')}`,
  
  // Team data - TTL: 30 minutes
  team: (teamId: string) => `team:${teamId}`,
  
  // User preferences - TTL: 7 days
  userPrefs: (userId: string) => `prefs:${userId}`,
  
  // Analytics data - TTL: 2 hours
  analytics: (type: string, period: string) => `analytics:${type}:${period}`
};

// Cache TTL constants (in seconds)
export const CacheTTL = {
  SHORT: 15 * 60,        // 15 minutes
  MEDIUM: 60 * 60,       // 1 hour
  LONG: 4 * 60 * 60,     // 4 hours
  EXTENDED: 12 * 60 * 60, // 12 hours
  DAILY: 24 * 60 * 60,   // 24 hours
  WEEKLY: 7 * 24 * 60 * 60 // 7 days
};