/**
 * Redis Rate Limiter
 * Advanced rate limiting with multiple algorithms and strategies
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { redisConfig } from './config'
import { redis } from './client'

export interface RateLimitConfig {
  algorithm: 'fixed-window' | 'sliding-window' | 'token-bucket'
  tokens: number
  window: string
  refillRate?: number
  prefix?: string
  analytics?: boolean
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
  reason?: string
}

export interface RateLimitStrategy {
  name: string
  config: RateLimitConfig
  identifier: (request: any) => string
  condition?: (request: any) => boolean
}

class RedisRateLimiter {
  private limiters: Map<string, Ratelimit> = new Map()
  private strategies: RateLimitStrategy[] = []

  constructor() {
    this.initializeDefaultLimiters()
  }

  private initializeDefaultLimiters(): void {
    // Global rate limiter
    this.createLimiter('global', {
      algorithm: 'sliding-window',
      tokens: redisConfig.rateLimit.maxRequests,
      window: `${redisConfig.rateLimit.windowMs / 1000}s`,
      prefix: `${redisConfig.rateLimit.prefix}:global`,
      analytics: redisConfig.rateLimit.analytics
    })

    // API rate limiter
    this.createLimiter('api', {
      algorithm: 'sliding-window',
      tokens: 2000, // Increased from 1000 to 2000
      window: '1h',
      prefix: `${redisConfig.rateLimit.prefix}:api`,
      analytics: true
    })

    // Auth rate limiter (more lenient for login issues)
    this.createLimiter('auth', {
      algorithm: 'fixed-window',
      tokens: 20, // Increased from 5 to 20
      window: '15m',
      prefix: `${redisConfig.rateLimit.prefix}:auth`,
      analytics: true
    })

    // Upload rate limiter
    this.createLimiter('upload', {
      algorithm: 'token-bucket',
      tokens: 10,
      window: '1h',
      refillRate: 1,
      prefix: `${redisConfig.rateLimit.prefix}:upload`,
      analytics: true
    })

    // Search rate limiter
    this.createLimiter('search', {
      algorithm: 'sliding-window',
      tokens: 100,
      window: '1h',
      prefix: `${redisConfig.rateLimit.prefix}:search`,
      analytics: true
    })
  }

  private createLimiter(name: string, config: RateLimitConfig): void {
    let limiter: any

    // Create appropriate limiter based on algorithm
    switch (config.algorithm) {
      case 'fixed-window':
        limiter = Ratelimit.fixedWindow(config.tokens, config.window)
        break
      case 'sliding-window':
        limiter = Ratelimit.slidingWindow(config.tokens, config.window)
        break
      case 'token-bucket':
        limiter = Ratelimit.tokenBucket(
          config.tokens,
          config.window,
          config.refillRate || 1
        )
        break
      default:
        throw new Error(`Unsupported rate limit algorithm: ${config.algorithm}`)
    }

    // Create Ratelimit instance
    const ratelimit = new Ratelimit({
      redis: redisConfig.provider === 'upstash' 
        ? Redis.fromEnv() 
        : redis as any,
      limiter,
      prefix: config.prefix || `${redisConfig.rateLimit.prefix}:${name}`,
      analytics: config.analytics || false,
      ephemeralCache: new Map() // In-memory cache for better performance
    })

    this.limiters.set(name, ratelimit)
  }

  public addStrategy(strategy: RateLimitStrategy): void {
    this.strategies.push(strategy)
    
    // Create limiter for this strategy if it doesn't exist
    if (!this.limiters.has(strategy.name)) {
      this.createLimiter(strategy.name, strategy.config)
    }
  }

  public async checkLimit(
    limiterName: string,
    identifier: string,
    options?: {
      rate?: number
      geo?: any
      ip?: string
      userAgent?: string
      country?: string
    }
  ): Promise<RateLimitResult> {
    const limiter = this.limiters.get(limiterName)
    if (!limiter) {
      throw new Error(`Rate limiter '${limiterName}' not found`)
    }

    try {
      const result = await limiter.limit(identifier, options)
      
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
        reason: result.reason
      }
    } catch (error) {
      console.error(`Rate limit check failed for ${limiterName}:`, error)
      
      // Fail open - allow request if rate limiter fails
      return {
        success: true,
        limit: 0,
        remaining: 0,
        reset: Date.now() + 60000,
        reason: 'rate_limiter_error'
      }
    }
  }

  public async checkMultipleStrategies(
    request: any,
    context?: any
  ): Promise<RateLimitResult[]> {
    const results: RateLimitResult[] = []

    for (const strategy of this.strategies) {
      // Check if strategy condition is met
      if (strategy.condition && !strategy.condition(request)) {
        continue
      }

      const identifier = strategy.identifier(request)
      const result = await this.checkLimit(strategy.name, identifier)
      results.push(result)

      // If any strategy fails, we can short-circuit
      if (!result.success) {
        break
      }
    }

    return results
  }

  public async getRemaining(
    limiterName: string,
    identifier: string
  ): Promise<{ remaining: number; reset: number }> {
    const limiter = this.limiters.get(limiterName)
    if (!limiter) {
      throw new Error(`Rate limiter '${limiterName}' not found`)
    }

    try {
      return await limiter.getRemaining(identifier)
    } catch (error) {
      console.error(`Failed to get remaining for ${limiterName}:`, error)
      return { remaining: 0, reset: Date.now() + 60000 }
    }
  }

  public async resetLimit(
    limiterName: string,
    identifier: string
  ): Promise<void> {
    const limiter = this.limiters.get(limiterName)
    if (!limiter) {
      throw new Error(`Rate limiter '${limiterName}' not found`)
    }

    try {
      await limiter.resetUsedTokens(identifier)
    } catch (error) {
      console.error(`Failed to reset limit for ${limiterName}:`, error)
    }
  }

  public async blockUntilReady(
    limiterName: string,
    identifier: string,
    timeout: number = 30000
  ): Promise<RateLimitResult> {
    const limiter = this.limiters.get(limiterName)
    if (!limiter) {
      throw new Error(`Rate limiter '${limiterName}' not found`)
    }

    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const result = await this.checkLimit(limiterName, identifier)
      
      if (result.success) {
        return result
      }

      // Wait before retrying
      const waitTime = Math.min(result.retryAfter || 1, 5) * 1000
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    return {
      success: false,
      limit: 0,
      remaining: 0,
      reset: Date.now() + 60000,
      reason: 'timeout'
    }
  }

  public getLimiterNames(): string[] {
    return Array.from(this.limiters.keys())
  }

  public getStrategies(): RateLimitStrategy[] {
    return [...this.strategies]
  }
}

// Singleton instance
let rateLimiter: RedisRateLimiter | null = null

export function getRateLimiter(): RedisRateLimiter {
  if (!rateLimiter) {
    rateLimiter = new RedisRateLimiter()
  }
  return rateLimiter
}

// Predefined strategies
export const defaultStrategies: RateLimitStrategy[] = [
  {
    name: 'ip-global',
    config: {
      algorithm: 'sliding-window',
      tokens: 100,
      window: '15m',
      prefix: 'ip-global',
      analytics: true
    },
    identifier: (request: any) => request.ip || request.headers?.['x-forwarded-for'] || 'unknown',
    condition: () => true
  },
  {
    name: 'user-api',
    config: {
      algorithm: 'sliding-window',
      tokens: 1000,
      window: '1h',
      prefix: 'user-api',
      analytics: true
    },
    identifier: (request: any) => request.user?.id || request.ip || 'anonymous',
    condition: (request: any) => request.url?.startsWith('/api/')
  },
  {
    name: 'auth-attempts',
    config: {
      algorithm: 'fixed-window',
      tokens: 5,
      window: '15m',
      prefix: 'auth-attempts',
      analytics: true
    },
    identifier: (request: any) => request.ip || 'unknown',
    condition: (request: any) => 
      request.url?.includes('/auth/') || 
      request.url?.includes('/login') || 
      request.url?.includes('/register')
  },
  {
    name: 'admin-actions',
    config: {
      algorithm: 'token-bucket',
      tokens: 50,
      window: '1h',
      refillRate: 1,
      prefix: 'admin-actions',
      analytics: true
    },
    identifier: (request: any) => request.user?.id || request.ip || 'unknown',
    condition: (request: any) => 
      request.url?.startsWith('/admin/') && request.user?.role === 'admin'
  }
]

// Helper functions for common rate limiting patterns
export async function checkIPRateLimit(
  ip: string,
  limiterName: string = 'global'
): Promise<RateLimitResult> {
  const limiter = getRateLimiter()
  return await limiter.checkLimit(limiterName, ip)
}

export async function checkUserRateLimit(
  userId: string,
  limiterName: string = 'api'
): Promise<RateLimitResult> {
  const limiter = getRateLimiter()
  return await limiter.checkLimit(limiterName, userId)
}

export async function checkAuthRateLimit(
  ip: string
): Promise<RateLimitResult> {
  const limiter = getRateLimiter()
  return await limiter.checkLimit('auth', ip)
}

export async function checkUploadRateLimit(
  userId: string,
  fileSize: number = 1
): Promise<RateLimitResult> {
  const limiter = getRateLimiter()
  return await limiter.checkLimit('upload', userId, { rate: fileSize })
}

export async function checkSearchRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  const limiter = getRateLimiter()
  return await limiter.checkLimit('search', identifier)
}

// Initialize default strategies
const limiter = getRateLimiter()
defaultStrategies.forEach(strategy => {
  limiter.addStrategy(strategy)
})

export { RedisRateLimiter }
export default getRateLimiter() 