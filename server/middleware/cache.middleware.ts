/**
 * Cache Middleware
 * Automatic caching layer for API responses
 * Part of Phase 4: Performance & Scale
 */

import { Request, Response, NextFunction } from 'express';
import { redisService, CacheKeys, CacheTTL } from '../services/cache/redis.service';
import { logger } from '../services/common/logger.service';
import { AuthenticatedRequest } from './auth';

interface CacheConfig {
  ttl?: number;
  keyGenerator?: (req: AuthenticatedRequest) => string;
  skipCache?: (req: AuthenticatedRequest) => boolean;
  skipCacheSet?: (req: AuthenticatedRequest, res: Response) => boolean;
}

/**
 * Cache middleware factory
 */
export function cacheMiddleware(config: CacheConfig = {}) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache if skipCache condition is met
    if (config.skipCache && config.skipCache(req)) {
      return next();
    }

    // Generate cache key
    const cacheKey = config.keyGenerator 
      ? config.keyGenerator(req)
      : generateDefaultCacheKey(req);

    try {
      // Try to get cached response
      const cachedResponse = await redisService.get<CachedResponse>(cacheKey);
      
      if (cachedResponse) {
        // Set headers to indicate cache hit
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-TTL', cachedResponse.ttl?.toString() || '0');
        
        // Set original headers
        if (cachedResponse.headers) {
          Object.entries(cachedResponse.headers).forEach(([key, value]) => {
            res.set(key, value as string);
          });
        }

        // Return cached response
        logger.debug(`Cache hit for key: ${cacheKey}`);
        return res.status(cachedResponse.statusCode).json(cachedResponse.data);
      }

      // Cache miss - intercept response
      res.set('X-Cache', 'MISS');
      
      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache the response
      res.json = function(body: any) {
        // Skip caching if skipCacheSet condition is met
        if (config.skipCacheSet && config.skipCacheSet(req, res)) {
          return originalJson.call(this, body);
        }

        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const responseToCache: CachedResponse = {
            data: body,
            statusCode: res.statusCode,
            headers: extractCacheableHeaders(res),
            ttl: config.ttl || CacheTTL.MEDIUM,
            cachedAt: new Date().toISOString()
          };

          // Cache the response asynchronously
          redisService.set(cacheKey, responseToCache, { 
            ttl: config.ttl || CacheTTL.MEDIUM 
          }).catch(error => {
            logger.error('Error caching response', undefined, error instanceof Error ? error.message : String(error));
          });

          logger.debug(`Cached response for key: ${cacheKey}`);
        }

        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', undefined, error instanceof Error ? error.message : String(error));
      // Continue without caching on error
      next();
    }
  };
}

/**
 * Analysis-specific cache middleware
 */
export const analysisCache = cacheMiddleware({
  ttl: CacheTTL.MEDIUM, // 1 hour
  keyGenerator: (req) => {
    const url = req.query.url as string;
    const type = req.path.split('/').pop() || 'standard';
    return CacheKeys.analysis(url, type);
  },
  skipCache: (req) => {
    // Skip cache if force refresh is requested
    return req.query.refresh === 'true';
  }
});

/**
 * Enhanced audit cache middleware
 */
export const auditCache = cacheMiddleware({
  ttl: CacheTTL.LONG, // 4 hours
  keyGenerator: (req) => {
    const auditId = req.params.auditId;
    return CacheKeys.audit(auditId);
  },
  skipCache: (req) => {
    return req.query.refresh === 'true';
  }
});

/**
 * Team data cache middleware
 */
export const teamCache = cacheMiddleware({
  ttl: CacheTTL.SHORT, // 15 minutes
  keyGenerator: (req) => {
    const teamId = req.params.teamId || req.user?.teamId;
    return CacheKeys.team(teamId ? String(teamId) : 'default');
  }
});

/**
 * User preferences cache middleware
 */
export const userPrefsCache = cacheMiddleware({
  ttl: CacheTTL.WEEKLY, // 7 days
  keyGenerator: (req) => {
    const userId = req.user?.id;
    return CacheKeys.userPrefs(userId ? String(userId) : 'anonymous');
  }
});

/**
 * Competitor analysis cache middleware
 */
export const competitorCache = cacheMiddleware({
  ttl: CacheTTL.EXTENDED, // 12 hours
  keyGenerator: (req) => {
    const url = req.query.url as string;
    return CacheKeys.competitors(url);
  }
});

/**
 * Analytics cache middleware
 */
export const analyticsCache = cacheMiddleware({
  ttl: CacheTTL.LONG, // 4 hours
  keyGenerator: (req) => {
    const type = req.params.type || 'overview';
    const period = req.query.period as string || 'daily';
    return CacheKeys.analytics(type, period);
  }
});

/**
 * Cache invalidation middleware
 */
export function invalidateCache(patterns: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Store patterns for post-response invalidation
    res.locals.cacheInvalidationPatterns = patterns;
    
    // Store original end method
    const originalEnd = res.end;
    
    // Override end method to invalidate cache after response
    res.end = function(chunk?: any, encoding?: any, cb?: any) {
      // Call original end method first
      const result = originalEnd.call(this, chunk, encoding, cb);
      
      // Invalidate cache patterns asynchronously
      if (res.statusCode >= 200 && res.statusCode < 300) {
        invalidateCachePatterns(patterns).catch(error => {
          logger.error('Error invalidating cache', undefined, error instanceof Error ? error.message : String(error));
        });
      }
      
      return result;
    };

    next();
  };
}

/**
 * Helper function to generate default cache key
 */
function generateDefaultCacheKey(req: Request): string {
  const baseKey = `api:${req.path}`;
  const queryString = Object.keys(req.query)
    .sort()
    .map(key => `${key}=${req.query[key]}`)
    .join('&');
    
  return queryString ? `${baseKey}?${queryString}` : baseKey;
}

/**
 * Extract cacheable headers from response
 */
function extractCacheableHeaders(res: Response): Record<string, string> {
  const cacheableHeaders: Record<string, string> = {};
  
  // Only cache specific headers
  const headersToCache = [
    'content-type',
    'content-encoding',
    'etag',
    'last-modified'
  ];
  
  headersToCache.forEach(header => {
    const value = res.get(header);
    if (value) {
      cacheableHeaders[header] = value;
    }
  });
  
  return cacheableHeaders;
}

/**
 * Invalidate cache patterns
 */
async function invalidateCachePatterns(patterns: string[]): Promise<void> {
  for (const pattern of patterns) {
    try {
      const deletedCount = await redisService.deletePattern(pattern);
      logger.debug(`Invalidated ${deletedCount} cache entries for pattern: ${pattern}`);
    } catch (error) {
      logger.error(`Error invalidating cache pattern ${pattern}`, undefined, error instanceof Error ? error.message : String(error));
    }
  }
}

/**
 * Cache warming functions
 */
export const CacheWarming = {
  /**
   * Warm popular analysis endpoints
   */
  async warmAnalysisCache(urls: string[]): Promise<void> {
    logger.info(`Warming analysis cache for ${urls.length} URLs`);
    
    // This would typically be called during off-peak hours
    // Implementation would make requests to analysis endpoints
    // to populate cache before users request them
  },

  /**
   * Warm team data cache
   */
  async warmTeamCache(teamIds: string[]): Promise<void> {
    logger.info(`Warming team cache for ${teamIds.length} teams`);
    
    // Pre-populate team data cache
  },

  /**
   * Warm user preferences cache
   */
  async warmUserPrefsCache(userIds: string[]): Promise<void> {
    logger.info(`Warming user preferences cache for ${userIds.length} users`);
    
    // Pre-populate user preferences cache
  }
};

/**
 * Cached response interface
 */
interface CachedResponse {
  data: any;
  statusCode: number;
  headers?: Record<string, string>;
  ttl: number;
  cachedAt: string;
}

// Export cache statistics endpoint handler
export async function getCacheStats(req: Request, res: Response): Promise<void> {
  try {
    const stats = redisService.getStats();
    const info = await redisService.getInfo();
    
    res.json({
      stats,
      redis: {
        connected: redisService.isConnected(),
        info: info ? parseRedisInfo(info) : null
      }
    });
  } catch (error) {
    logger.error('Error getting cache stats', undefined, error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: 'Failed to get cache statistics' });
  }
}

/**
 * Parse Redis INFO response
 */
function parseRedisInfo(info: string): Record<string, any> {
  const parsed: Record<string, any> = {};
  const sections = info.split('\r\n\r\n');
  
  sections.forEach(section => {
    const lines = section.split('\r\n');
    const sectionName = lines[0]?.replace('# ', '');
    
    if (sectionName) {
      parsed[sectionName] = {};
      lines.slice(1).forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          parsed[sectionName][key] = isNaN(Number(value)) ? value : Number(value);
        }
      });
    }
  });
  
  return parsed;
}