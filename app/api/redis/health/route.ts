/**
 * Redis Health Check API Endpoint
 * GET /api/redis/health
 */

import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis/client'
import { getCache } from '@/lib/redis/cache'
import { getRateLimiter } from '@/lib/redis/rate-limiter'
import { getSessionManager } from '@/lib/redis/session'
import { checkRedisHealth } from '@/lib/redis/client'

export async function GET(request: NextRequest) {
  try {
    // Check if request is from admin or localhost
    const isLocalhost = request.headers.get('host')?.includes('localhost')
    const userAgent = request.headers.get('user-agent') || ''
    
    if (!isLocalhost && !userAgent.includes('curl') && !userAgent.includes('Postman')) {
      // In production, you might want to add authentication here
      // For now, we'll allow health checks
    }

    // Perform health checks
    const startTime = Date.now()
    
    const [
      redisHealth,
      cacheStats,
      sessionStats,
      rateLimiterInfo
    ] = await Promise.allSettled([
      checkRedisHealth(),
      getCache().getStats(),
      getSessionManager().getSessionStats(),
      Promise.resolve({
        limiters: getRateLimiter().getLimiterNames(),
        strategies: getRateLimiter().getStrategies().length
      })
    ])

    const totalTime = Date.now() - startTime

    // Build response
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: totalTime,
      services: {
        redis: redisHealth.status === 'fulfilled' ? redisHealth.value : {
          status: 'unhealthy',
          error: redisHealth.status === 'rejected' ? redisHealth.reason?.message : 'Unknown error'
        },
        cache: cacheStats.status === 'fulfilled' ? {
          status: 'healthy',
          stats: cacheStats.value
        } : {
          status: 'unhealthy',
          error: cacheStats.status === 'rejected' ? cacheStats.reason?.message : 'Unknown error'
        },
        sessions: sessionStats.status === 'fulfilled' ? {
          status: 'healthy',
          stats: sessionStats.value
        } : {
          status: 'unhealthy',
          error: sessionStats.status === 'rejected' ? sessionStats.reason?.message : 'Unknown error'
        },
        rateLimiter: rateLimiterInfo.status === 'fulfilled' ? {
          status: 'healthy',
          info: rateLimiterInfo.value
        } : {
          status: 'unhealthy',
          error: rateLimiterInfo.status === 'rejected' ? rateLimiterInfo.reason?.message : 'Unknown error'
        }
      }
    }

    // Determine overall status
    const hasUnhealthyService = Object.values(healthStatus.services).some(
      service => service.status === 'unhealthy'
    )

    if (hasUnhealthyService) {
      healthStatus.status = 'degraded'
    }

    // Return appropriate status code
    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 207 : 503

    return NextResponse.json(healthStatus, { status: statusCode })

  } catch (error) {
    console.error('Redis health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        redis: { status: 'unhealthy', error: 'Health check failed' },
        cache: { status: 'unknown' },
        sessions: { status: 'unknown' },
        rateLimiter: { status: 'unknown' }
      }
    }, { status: 503 })
  }
}

// Optional: Add a simple ping endpoint
export async function HEAD(request: NextRequest) {
  try {
    await redis.ping()
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
} 