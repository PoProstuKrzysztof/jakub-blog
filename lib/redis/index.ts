/**
 * Redis Integration for Next.js Blog Application
 * 
 * This module provides a comprehensive Redis integration with support for:
 * - Universal client (Upstash & traditional Redis)
 * - Advanced caching with TTL and invalidation
 * - Rate limiting with multiple algorithms
 * - Session management with refresh tokens
 * - Performance monitoring and health checks
 * 
 * @example Basic Usage
 * ```typescript
 * import { redis, cache, rateLimiter } from '@/lib/redis'
 * 
 * // Basic Redis operations
 * await redis.set('key', 'value', 3600)
 * const value = await redis.get('key')
 * 
 * // Caching
 * const posts = await cache.getOrSet('posts:list', async () => {
 *   return await fetchPostsFromDB()
 * }, { ttl: 300, tags: ['posts'] })
 * 
 * // Rate limiting
 * const result = await rateLimiter.checkLimit('api', userId)
 * if (!result.success) {
 *   throw new Error('Rate limit exceeded')
 * }
 * ```
 */

// Core Redis client
export { 
  redis, 
  getRedisClient, 
  checkRedisHealth, 
  disconnectRedis,
  type RedisClientInterface 
} from './client'

// Configuration
export { 
  redisConfig, 
  cacheKeys, 
  cacheTTL, 
  healthCheck 
} from './config'

// Caching system
export { 
  getCache, 
  cache,
  getCachedPosts,
  getCachedPost,
  invalidatePostCache,
  incrementPostViews,
  type CacheOptions,
  type CacheEntry,
  type CacheStats,
  RedisCache 
} from './cache'

// Rate limiting
export { 
  getRateLimiter,
  checkIPRateLimit,
  checkUserRateLimit,
  checkAuthRateLimit,
  checkUploadRateLimit,
  checkSearchRateLimit,
  defaultStrategies,
  type RateLimitConfig,
  type RateLimitResult,
  type RateLimitStrategy,
  RedisRateLimiter 
} from './rate-limiter'

// Session management
export { 
  getSessionManager,
  createUserSession,
  getUserSession,
  destroyUserSession,
  refreshUserSession,
  cleanupSessions,
  type SessionData,
  type SessionOptions,
  type RefreshTokenData,
  RedisSessionManager 
} from './session'

/**
 * Redis Service Class
 * Combines all Redis functionality into a single service
 */
export class RedisService {
  private static instance: RedisService | null = null

  public readonly client = getRedisClient()
  public readonly cache = getCache()
  public readonly rateLimiter = getRateLimiter()
  public readonly sessionManager = getSessionManager()

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  /**
   * Health check for all Redis services
   */
  async healthCheck(): Promise<{
    redis: { status: 'healthy' | 'unhealthy'; latency?: number; error?: string }
    cache: { stats: any }
    sessions: { stats: any }
    rateLimiter: { limiters: string[] }
  }> {
    const [redisHealth, cacheStats, sessionStats] = await Promise.all([
      checkRedisHealth(),
      this.cache.getStats(),
      this.sessionManager.getSessionStats()
    ])

    return {
      redis: redisHealth,
      cache: { stats: cacheStats },
      sessions: { stats: sessionStats },
      rateLimiter: { limiters: this.rateLimiter.getLimiterNames() }
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    await disconnectRedis()
  }
}

/**
 * Get the Redis service instance
 */
export function getRedisService(): RedisService {
  return RedisService.getInstance()
}

/**
 * Default export - Redis service instance
 */
export default getRedisService()

/**
 * Environment Variables Required:
 * 
 * For Upstash Redis (Serverless):
 * - UPSTASH_REDIS_REST_URL: Your Upstash Redis REST URL
 * - UPSTASH_REDIS_REST_TOKEN: Your Upstash Redis REST token
 * 
 * For Traditional Redis:
 * - REDIS_URL: Complete Redis connection URL (redis://user:pass@host:port/db)
 * OR individual variables:
 * - REDIS_HOST: Redis host (default: localhost)
 * - REDIS_PORT: Redis port (default: 6379)
 * - REDIS_PASSWORD: Redis password (optional)
 * - REDIS_DB: Redis database number (default: 0)
 * 
 * Optional Configuration:
 * - REDIS_DEFAULT_TTL: Default cache TTL in seconds (default: 3600)
 * - REDIS_KEY_PREFIX: Key prefix for all Redis keys (default: blog:)
 * - REDIS_RATE_LIMIT_ENABLED: Enable rate limiting (default: true)
 * - REDIS_RATE_LIMIT_MAX: Max requests per window (default: 100)
 * - REDIS_RATE_LIMIT_WINDOW: Rate limit window in ms (default: 60000)
 * - REDIS_SESSION_TTL: Session TTL in seconds (default: 86400)
 * - REDIS_MONITORING_ENABLED: Enable monitoring logs (default: true)
 */

/**
 * Usage Examples:
 * 
 * @example Basic Redis Operations
 * ```typescript
 * import { redis } from '@/lib/redis'
 * 
 * // Set with TTL
 * await redis.set('user:123', JSON.stringify(userData), 3600)
 * 
 * // Get value
 * const userData = await redis.get('user:123')
 * 
 * // Increment counter
 * const views = await redis.incr('post:views:456')
 * 
 * // Hash operations
 * await redis.hset('user:123:profile', 'name', 'John Doe')
 * const name = await redis.hget('user:123:profile', 'name')
 * ```
 * 
 * @example Caching with Tags
 * ```typescript
 * import { cache } from '@/lib/redis'
 * 
 * // Cache with automatic invalidation
 * const posts = await cache.getOrSet('posts:recent', async () => {
 *   return await db.posts.findMany({ take: 10 })
 * }, { 
 *   ttl: 300, 
 *   tags: ['posts', 'recent'] 
 * })
 * 
 * // Invalidate by tags
 * await cache.invalidateByTags(['posts'])
 * ```
 * 
 * @example Rate Limiting
 * ```typescript
 * import { checkIPRateLimit, checkUserRateLimit } from '@/lib/redis'
 * 
 * // IP-based rate limiting
 * const ipResult = await checkIPRateLimit(request.ip)
 * if (!ipResult.success) {
 *   return new Response('Rate limited', { 
 *     status: 429,
 *     headers: { 'Retry-After': String(ipResult.retryAfter) }
 *   })
 * }
 * 
 * // User-based rate limiting
 * const userResult = await checkUserRateLimit(userId, 'api')
 * ```
 * 
 * @example Session Management
 * ```typescript
 * import { createUserSession, getUserSession } from '@/lib/redis'
 * 
 * // Create session with refresh token
 * const session = await createUserSession(userId, {
 *   email: user.email,
 *   role: user.role
 * }, {
 *   refreshable: true,
 *   maxSessions: 5
 * })
 * 
 * // Get session data
 * const sessionData = await getUserSession(sessionId)
 * ```
 * 
 * @example Complete Service Usage
 * ```typescript
 * import { getRedisService } from '@/lib/redis'
 * 
 * const redisService = getRedisService()
 * 
 * // Health check
 * const health = await redisService.healthCheck()
 * 
 * // Use individual services
 * await redisService.cache.set('key', 'value')
 * const rateLimitResult = await redisService.rateLimiter.checkLimit('api', userId)
 * const session = await redisService.sessionManager.createSession(userId)
 * ```
 */ 