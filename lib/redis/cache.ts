/**
 * Redis Cache Service
 * Advanced caching with TTL, invalidation patterns, and cache warming
 */

import { redis } from './client'
import { cacheKeys, cacheTTL, redisConfig } from './config'

export interface CacheOptions {
  ttl?: number
  tags?: string[]
  compress?: boolean
  serialize?: boolean
}

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  tags?: string[]
}

export interface CacheStats {
  hits: number
  misses: number
  sets: number
  deletes: number
  hitRate: number
}

class RedisCache {
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    hitRate: 0
  }

  private readonly STATS_KEY = `${redisConfig.cache.keyPrefix}cache:stats`
  private readonly TAG_PREFIX = `${redisConfig.cache.keyPrefix}tag:`

  constructor() {
    // Only load stats on server side
    if (typeof window === 'undefined') {
      this.loadStats().catch(error => {
        console.error('Failed to load Redis stats on initialization:', error)
      })
    }
  }

  /**
   * Get value from cache
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      
      if (value === null) {
        this.stats.misses++
        this.updateStats()
        return null
      }

      this.stats.hits++
      this.updateStats()

      // Try to parse as JSON, fallback to string
      try {
        const parsed = JSON.parse(value)
        return parsed.data !== undefined ? parsed.data : parsed
      } catch {
        return value as T
      }
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      this.stats.misses++
      this.updateStats()
      return null
    }
  }

  /**
   * Set value in cache
   */
  async set<T = any>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    try {
      const ttl = options.ttl || redisConfig.cache.defaultTTL
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        tags: options.tags
      }

      const serializedValue = options.serialize !== false 
        ? JSON.stringify(entry) 
        : String(value)

      await redis.set(key, serializedValue, ttl)

      // Store tags for invalidation
      if (options.tags && options.tags.length > 0) {
        await this.storeTags(key, options.tags)
      }

      this.stats.sets++
      this.updateStats()
      return true
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key)
      
      if (result > 0) {
        this.stats.deletes++
        this.updateStats()
        return true
      }
      
      return false
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result > 0
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Get TTL for key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key)
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error)
      return -1
    }
  }

  /**
   * Extend TTL for key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, seconds)
      return result > 0
    } catch (error) {
      console.error(`Cache expire error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Get or set pattern - fetch from cache or compute and cache
   */
  async getOrSet<T = any>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Compute value
    const value = await factory()
    
    // Cache the computed value
    await this.set(key, value, options)
    
    return value
  }

  /**
   * Increment numeric value in cache
   */
  async incr(key: string, amount: number = 1): Promise<number> {
    try {
      if (amount === 1) {
        return await redis.incr(key)
      } else {
        // For custom increment amounts, we need to handle it differently
        const current = await this.get<number>(key) || 0
        const newValue = current + amount
        await this.set(key, newValue)
        return newValue
      }
    } catch (error) {
      console.error(`Cache increment error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Decrement numeric value in cache
   */
  async decr(key: string, amount: number = 1): Promise<number> {
    try {
      if (amount === 1) {
        return await redis.decr(key)
      } else {
        const current = await this.get<number>(key) || 0
        const newValue = current - amount
        await this.set(key, newValue)
        return newValue
      }
    } catch (error) {
      console.error(`Cache decrement error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Store multiple key-value pairs
   */
  async mset(entries: Record<string, any>, options: CacheOptions = {}): Promise<boolean> {
    try {
      const promises = Object.entries(entries).map(([key, value]) =>
        this.set(key, value, options)
      )
      
      const results = await Promise.all(promises)
      return results.every(result => result === true)
    } catch (error) {
      console.error('Cache mset error:', error)
      return false
    }
  }

  /**
   * Get multiple values by keys
   */
  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    try {
      const promises = keys.map(key => this.get<T>(key))
      return await Promise.all(promises)
    } catch (error) {
      console.error('Cache mget error:', error)
      return keys.map(() => null)
    }
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<number> {
    let deletedCount = 0

    try {
      for (const tag of tags) {
        const tagKey = `${this.TAG_PREFIX}${tag}`
        const keys = await redis.smembers(tagKey)
        
        if (keys.length > 0) {
          // Delete all keys with this tag
          const deletePromises = keys.map(key => this.del(key))
          const results = await Promise.all(deletePromises)
          deletedCount += results.filter(result => result).length
          
          // Remove the tag set
          await redis.del(tagKey)
        }
      }
    } catch (error) {
      console.error('Cache invalidate by tags error:', error)
    }

    return deletedCount
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidateByPattern(pattern: string): Promise<number> {
    let deletedCount = 0

    try {
      const keys = await redis.keys(pattern)
      
      if (keys.length > 0) {
        const deletePromises = keys.map(key => this.del(key))
        const results = await Promise.all(deletePromises)
        deletedCount = results.filter(result => result).length
      }
    } catch (error) {
      console.error('Cache invalidate by pattern error:', error)
    }

    return deletedCount
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<boolean> {
    try {
      await redis.flushdb()
      this.resetStats()
      return true
    } catch (error) {
      console.error('Cache clear error:', error)
      return false
    }
  }

  /**
   * Warm cache with predefined data
   */
  async warm(entries: Array<{
    key: string
    factory: () => Promise<any> | any
    options?: CacheOptions
  }>): Promise<number> {
    let warmedCount = 0

    try {
      const promises = entries.map(async ({ key, factory, options }) => {
        try {
          const value = await factory()
          const success = await this.set(key, value, options)
          return success ? 1 : 0
        } catch (error) {
          console.error(`Cache warm error for key ${key}:`, error)
          return 0
        }
      })

      const results = await Promise.all(promises)
      warmedCount = results.reduce((sum: number, result: number) => sum + result, 0)
    } catch (error) {
      console.error('Cache warm error:', error)
    }

    return warmedCount
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.stats.hitRate = this.stats.hits + this.stats.misses > 0
      ? this.stats.hits / (this.stats.hits + this.stats.misses)
      : 0

    return { ...this.stats }
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
      hitRate: 0
    }
    this.saveStats()
  }

  /**
   * Store tags for a key
   */
  private async storeTags(key: string, tags: string[]): Promise<void> {
    try {
      const promises = tags.map(tag => {
        const tagKey = `${this.TAG_PREFIX}${tag}`
        return redis.sadd(tagKey, key)
      })
      
      await Promise.all(promises)
    } catch (error) {
      console.error('Store tags error:', error)
    }
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    this.stats.hitRate = this.stats.hits + this.stats.misses > 0
      ? this.stats.hits / (this.stats.hits + this.stats.misses)
      : 0

    // Periodically save stats to Redis
    if ((this.stats.hits + this.stats.misses) % 100 === 0) {
      this.saveStats()
    }
  }

  /**
   * Save statistics to Redis
   */
  private async saveStats(): Promise<void> {
    try {
      // Use a single HSET operation for better performance
      const statsData = {
        hits: String(this.stats.hits),
        misses: String(this.stats.misses),
        sets: String(this.stats.sets),
        deletes: String(this.stats.deletes),
        hitRate: String(this.stats.hitRate)
      }
      
      // Since we use our custom interface, use multiple hset calls
      await Promise.all([
        redis.hset(this.STATS_KEY, 'hits', statsData.hits),
        redis.hset(this.STATS_KEY, 'misses', statsData.misses),
        redis.hset(this.STATS_KEY, 'sets', statsData.sets),
        redis.hset(this.STATS_KEY, 'deletes', statsData.deletes),
        redis.hset(this.STATS_KEY, 'hitRate', statsData.hitRate)
      ])
    } catch (error) {
      console.error('Save stats error:', error)
    }
  }

  /**
   * Load statistics from Redis
   */
  private async loadStats(): Promise<void> {
    try {
      const stats = await redis.hgetall(this.STATS_KEY)
      
      // Check if stats is not null/undefined and has keys
      if (stats && typeof stats === 'object' && Object.keys(stats).length > 0) {
        this.stats.hits = parseInt(stats.hits || '0', 10)
        this.stats.misses = parseInt(stats.misses || '0', 10)
        this.stats.sets = parseInt(stats.sets || '0', 10)
        this.stats.deletes = parseInt(stats.deletes || '0', 10)
        this.stats.hitRate = parseFloat(stats.hitRate || '0')
      }
    } catch (error) {
      console.error('Load stats error:', error)
    }
  }
}

// Singleton instance
let cacheInstance: RedisCache | null = null

export function getCache(): RedisCache {
  if (!cacheInstance) {
    cacheInstance = new RedisCache()
  }
  return cacheInstance
}

// Convenience functions for common cache operations
export const cache = {
  // Posts
  posts: {
    list: (page: number = 1, limit: number = 10) => ({
      key: cacheKeys.posts.list(page, limit),
      ttl: cacheTTL.posts.list
    }),
    detail: (id: string) => ({
      key: cacheKeys.posts.detail(id),
      ttl: cacheTTL.posts.detail
    }),
    bySlug: (slug: string) => ({
      key: cacheKeys.posts.bySlug(slug),
      ttl: cacheTTL.posts.detail
    }),
    count: () => ({
      key: cacheKeys.posts.count(),
      ttl: cacheTTL.posts.count
    }),
    popular: (limit: number = 10) => ({
      key: cacheKeys.posts.popular(limit),
      ttl: cacheTTL.posts.popular
    }),
    recent: (limit: number = 10) => ({
      key: cacheKeys.posts.recent(limit),
      ttl: cacheTTL.posts.recent
    })
  },

  // Analytics
  analytics: {
    views: (postId: string) => ({
      key: cacheKeys.analytics.views(postId),
      ttl: cacheTTL.analytics.views
    }),
    dailyViews: (date: string) => ({
      key: cacheKeys.analytics.dailyViews(date),
      ttl: cacheTTL.analytics.dailyViews
    }),
    popularPosts: (period: string) => ({
      key: cacheKeys.analytics.popularPosts(period),
      ttl: cacheTTL.analytics.popularPosts
    })
  },

  // User
  user: {
    profile: (userId: string) => ({
      key: cacheKeys.user.profile(userId),
      ttl: cacheTTL.user.profile
    }),
    sessions: (userId: string) => ({
      key: cacheKeys.user.sessions(userId),
      ttl: cacheTTL.user.sessions
    }),
    preferences: (userId: string) => ({
      key: cacheKeys.user.preferences(userId),
      ttl: cacheTTL.user.preferences
    })
  },

  // Search
  search: {
    results: (query: string, page: number = 1) => ({
      key: cacheKeys.search.results(query, page),
      ttl: cacheTTL.search.results
    }),
    suggestions: (query: string) => ({
      key: cacheKeys.search.suggestions(query),
      ttl: cacheTTL.search.suggestions
    })
  }
}

// Helper functions
export async function getCachedPosts(page: number = 1, limit: number = 10) {
  const cacheService = getCache()
  const { key, ttl } = cache.posts.list(page, limit)
  
  return await cacheService.getOrSet(key, async () => {
    // This would be replaced with actual database query
    return { posts: [], total: 0, page, limit }
  }, { ttl, tags: ['posts'] })
}

export async function getCachedPost(id: string) {
  const cacheService = getCache()
  const { key, ttl } = cache.posts.detail(id)
  
  return await cacheService.getOrSet(key, async () => {
    // This would be replaced with actual database query
    return null
  }, { ttl, tags: ['posts', `post:${id}`] })
}

export async function invalidatePostCache(postId?: string) {
  const cacheService = getCache()
  
  if (postId) {
    await cacheService.invalidateByTags([`post:${postId}`])
  }
  
  await cacheService.invalidateByTags(['posts'])
}

export async function incrementPostViews(postId: string): Promise<number> {
  const cacheService = getCache()
  const { key } = cache.analytics.views(postId)
  
  return await cacheService.incr(key)
}

export { RedisCache }
export default getCache() 