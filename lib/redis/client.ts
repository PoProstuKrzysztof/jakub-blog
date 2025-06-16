/**
 * Redis Client
 * Universal Redis client with support for both Upstash and traditional Redis
 */

import { Redis as UpstashRedis } from '@upstash/redis'
import Redis from 'ioredis'
import { redisConfig, healthCheck } from './config'

export interface RedisClientInterface {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttl?: number): Promise<string | null>
  del(key: string): Promise<number>
  exists(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<number>
  ttl(key: string): Promise<number>
  incr(key: string): Promise<number>
  decr(key: string): Promise<number>
  hget(key: string, field: string): Promise<string | null>
  hset(key: string, field: string, value: string): Promise<number>
  hgetall(key: string): Promise<Record<string, string>>
  hdel(key: string, field: string): Promise<number>
  lpush(key: string, ...values: string[]): Promise<number>
  rpush(key: string, ...values: string[]): Promise<number>
  lpop(key: string): Promise<string | null>
  rpop(key: string): Promise<string | null>
  lrange(key: string, start: number, stop: number): Promise<string[]>
  llen(key: string): Promise<number>
  sadd(key: string, ...members: string[]): Promise<number>
  srem(key: string, ...members: string[]): Promise<number>
  smembers(key: string): Promise<string[]>
  sismember(key: string, member: string): Promise<number>
  zadd(key: string, score: number, member: string): Promise<number>
  zrem(key: string, member: string): Promise<number>
  zrange(key: string, start: number, stop: number): Promise<string[]>
  zrevrange(key: string, start: number, stop: number): Promise<string[]>
  zrank(key: string, member: string): Promise<number | null>
  zscore(key: string, member: string): Promise<string | null>
  ping(): Promise<string>
  flushdb(): Promise<string>
  keys(pattern: string): Promise<string[]>
  disconnect(): Promise<void>
}

class UpstashRedisClient implements RedisClientInterface {
  private client: UpstashRedis

  constructor() {
    this.client = new UpstashRedis({
      url: redisConfig.upstash.url,
      token: redisConfig.upstash.token,
      enableTelemetry: redisConfig.upstash.enableTelemetry
    })
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<string | null> {
    if (ttl) {
      return await this.client.setex(key, ttl, value)
    }
    return await this.client.set(key, value)
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key)
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key)
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds)
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key)
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key)
  }

  async decr(key: string): Promise<number> {
    return await this.client.decr(key)
  }

  async hget(key: string, field: string): Promise<string | null> {
    return await this.client.hget(key, field)
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    return await this.client.hset(key, { [field]: value })
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.client.hgetall(key)
  }

  async hdel(key: string, field: string): Promise<number> {
    return await this.client.hdel(key, field)
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    return await this.client.lpush(key, ...values)
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return await this.client.rpush(key, ...values)
  }

  async lpop(key: string): Promise<string | null> {
    return await this.client.lpop(key)
  }

  async rpop(key: string): Promise<string | null> {
    return await this.client.rpop(key)
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.client.lrange(key, start, stop)
  }

  async llen(key: string): Promise<number> {
    return await this.client.llen(key)
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.client.sadd(key, ...members)
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return await this.client.srem(key, ...members)
  }

  async smembers(key: string): Promise<string[]> {
    return await this.client.smembers(key)
  }

  async sismember(key: string, member: string): Promise<number> {
    return await this.client.sismember(key, member)
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    return await this.client.zadd(key, { score, member })
  }

  async zrem(key: string, member: string): Promise<number> {
    return await this.client.zrem(key, member)
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.client.zrange(key, start, stop)
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.client.zrevrange(key, start, stop)
  }

  async zrank(key: string, member: string): Promise<number | null> {
    return await this.client.zrank(key, member)
  }

  async zscore(key: string, member: string): Promise<string | null> {
    return await this.client.zscore(key, member)
  }

  async ping(): Promise<string> {
    return await this.client.ping()
  }

  async flushdb(): Promise<string> {
    return await this.client.flushdb()
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern)
  }

  async disconnect(): Promise<void> {
    // Upstash Redis doesn't require explicit disconnection
    return Promise.resolve()
  }
}

class TraditionalRedisClient implements RedisClientInterface {
  private client: Redis
  private isConnected: boolean = false

  constructor() {
    const config = redisConfig.traditional
    
    // Support for Redis URL or individual parameters
    if (process.env.REDIS_URL) {
      this.client = new Redis(process.env.REDIS_URL, {
        retryDelayOnFailover: config.retryDelayOnFailover,
        maxRetriesPerRequest: config.maxRetriesPerRequest,
        lazyConnect: config.lazyConnect,
        keepAlive: config.keepAlive,
        family: config.family,
        connectTimeout: config.connectTimeout,
        commandTimeout: config.commandTimeout
      })
    } else {
      this.client = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
        db: config.db,
        retryDelayOnFailover: config.retryDelayOnFailover,
        maxRetriesPerRequest: config.maxRetriesPerRequest,
        lazyConnect: config.lazyConnect,
        keepAlive: config.keepAlive,
        family: config.family,
        connectTimeout: config.connectTimeout,
        commandTimeout: config.commandTimeout
      })
    }

    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      this.isConnected = true
      if (redisConfig.monitoring.enabled) {
        console.log('✅ Redis connected successfully')
      }
    })

    this.client.on('error', (error) => {
      this.isConnected = false
      console.error('❌ Redis connection error:', error)
    })

    this.client.on('close', () => {
      this.isConnected = false
      if (redisConfig.monitoring.enabled) {
        console.log('🔌 Redis connection closed')
      }
    })

    this.client.on('reconnecting', () => {
      if (redisConfig.monitoring.enabled) {
        console.log('🔄 Redis reconnecting...')
      }
    })
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected && redisConfig.traditional.lazyConnect) {
      await this.client.connect()
    }
  }

  async get(key: string): Promise<string | null> {
    await this.ensureConnection()
    return await this.client.get(key)
  }

  async set(key: string, value: string, ttl?: number): Promise<string | null> {
    await this.ensureConnection()
    if (ttl) {
      return await this.client.setex(key, ttl, value)
    }
    return await this.client.set(key, value)
  }

  async del(key: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.del(key)
  }

  async exists(key: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.exists(key)
  }

  async expire(key: string, seconds: number): Promise<number> {
    await this.ensureConnection()
    return await this.client.expire(key, seconds)
  }

  async ttl(key: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.ttl(key)
  }

  async incr(key: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.incr(key)
  }

  async decr(key: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.decr(key)
  }

  async hget(key: string, field: string): Promise<string | null> {
    await this.ensureConnection()
    return await this.client.hget(key, field)
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.hset(key, field, value)
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    await this.ensureConnection()
    return await this.client.hgetall(key)
  }

  async hdel(key: string, field: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.hdel(key, field)
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    await this.ensureConnection()
    return await this.client.lpush(key, ...values)
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    await this.ensureConnection()
    return await this.client.rpush(key, ...values)
  }

  async lpop(key: string): Promise<string | null> {
    await this.ensureConnection()
    return await this.client.lpop(key)
  }

  async rpop(key: string): Promise<string | null> {
    await this.ensureConnection()
    return await this.client.rpop(key)
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    await this.ensureConnection()
    return await this.client.lrange(key, start, stop)
  }

  async llen(key: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.llen(key)
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    await this.ensureConnection()
    return await this.client.sadd(key, ...members)
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    await this.ensureConnection()
    return await this.client.srem(key, ...members)
  }

  async smembers(key: string): Promise<string[]> {
    await this.ensureConnection()
    return await this.client.smembers(key)
  }

  async sismember(key: string, member: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.sismember(key, member)
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.zadd(key, score, member)
  }

  async zrem(key: string, member: string): Promise<number> {
    await this.ensureConnection()
    return await this.client.zrem(key, member)
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    await this.ensureConnection()
    return await this.client.zrange(key, start, stop)
  }

  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    await this.ensureConnection()
    return await this.client.zrevrange(key, start, stop)
  }

  async zrank(key: string, member: string): Promise<number | null> {
    await this.ensureConnection()
    return await this.client.zrank(key, member)
  }

  async zscore(key: string, member: string): Promise<string | null> {
    await this.ensureConnection()
    return await this.client.zscore(key, member)
  }

  async ping(): Promise<string> {
    await this.ensureConnection()
    return await this.client.ping()
  }

  async flushdb(): Promise<string> {
    await this.ensureConnection()
    return await this.client.flushdb()
  }

  async keys(pattern: string): Promise<string[]> {
    await this.ensureConnection()
    return await this.client.keys(pattern)
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect()
      this.isConnected = false
    }
  }
}

// Singleton Redis client instance
let redisClient: RedisClientInterface | null = null

export function getRedisClient(): RedisClientInterface {
  if (!redisClient) {
    if (redisConfig.provider === 'upstash') {
      redisClient = new UpstashRedisClient()
    } else {
      redisClient = new TraditionalRedisClient()
    }
  }
  return redisClient
}

// Health check function
export async function checkRedisHealth(): Promise<{
  status: 'healthy' | 'unhealthy'
  latency?: number
  error?: string
}> {
  const client = getRedisClient()
  const startTime = Date.now()
  
  try {
    await Promise.race([
      client.ping(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), healthCheck.timeout)
      )
    ])
    
    const latency = Date.now() - startTime
    return { status: 'healthy', latency }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Graceful shutdown
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.disconnect()
      redisClient = null
      if (redisConfig.monitoring.enabled) {
        console.log('✅ Redis client disconnected gracefully')
      }
    } catch (error) {
      console.error('❌ Error disconnecting Redis client:', error)
    }
  }
}

// Export the client instance
export const redis = getRedisClient() 