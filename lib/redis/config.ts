/**
 * Redis Configuration
 * Centralized Redis settings with support for both Upstash and traditional Redis
 */

// Sprawdź czy kod jest wykonywany po stronie serwera
const isServer = typeof window === 'undefined'

interface RedisConfig {
  provider: 'upstash' | 'traditional'
  upstash: {
    url: string
    token: string
    enableTelemetry: boolean
  }
  traditional: {
    host: string
    port: number
    password?: string
    db: number
    retryDelayOnFailover: number
    maxRetriesPerRequest: number
    lazyConnect: boolean
    keepAlive: number
    family: number
    connectTimeout: number
    commandTimeout: number
  }
  cache: {
    defaultTTL: number
    maxMemoryPolicy: string
    keyPrefix: string
  }
  rateLimit: {
    enabled: boolean
    windowMs: number
    maxRequests: number
    prefix: string
    analytics: boolean
  }
  session: {
    prefix: string
    ttl: number
  }
  monitoring: {
    enabled: boolean
    logLevel: 'error' | 'warn' | 'info' | 'debug'
  }
}

function validateEnvVar(name: string, defaultValue?: string): string {
  // Jeśli kod jest wykonywany po stronie klienta, zwróć wartość domyślną
  if (!isServer) {
    return defaultValue || ''
  }
  
  const value = process.env[name] 
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value || defaultValue || ''
}

function validateNumericEnvVar(name: string, defaultValue: number): number {
  // Jeśli kod jest wykonywany po stronie klienta, zwróć wartość domyślną
  if (!isServer) {
    return defaultValue
  }
  
  const value = process.env[name]
  if (!value) return defaultValue
  
  const numValue = parseInt(value, 10)
  if (isNaN(numValue)) {
    throw new Error(`Invalid numeric environment variable: ${name}`)
  }
  return numValue
}

function validateBooleanEnvVar(name: string, defaultValue: boolean): boolean {
  // Jeśli kod jest wykonywany po stronie klienta, zwróć wartość domyślną
  if (!isServer) {
    return defaultValue
  }
  
  const value = process.env[name]
  if (!value) return defaultValue
  
  return value.toLowerCase() === 'true'
}

// Determine Redis provider based on environment variables
const getRedisProvider = (): 'upstash' | 'traditional' => {
  if (!isServer) {
    return 'upstash' // wartość domyślna dla klienta
  }
  
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return 'upstash'
  }
  if (process.env.REDIS_URL || process.env.REDIS_HOST) {
    return 'traditional'
  }
  
  // Default to Upstash for serverless environments
  if (process.env.VERCEL || process.env.NETLIFY) {
    console.warn('⚠️ No Redis configuration found. Defaulting to Upstash for serverless environment.')
    return 'upstash'
  }
  
  console.warn('⚠️ No Redis configuration found. Defaulting to traditional Redis.')
  return 'traditional'
}

const provider = getRedisProvider()

// Validate required environment variables based on provider (tylko po stronie serwera)
if (isServer && provider === 'upstash') {
  const requiredUpstashVars = ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']
  requiredUpstashVars.forEach(envVar => {
    if (!process.env[envVar]) {
      console.error(`❌ Missing required Upstash environment variable: ${envVar}`)
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
    }
  })
}

// Redis configuration
export const redisConfig: RedisConfig = {
  provider,
  upstash: {
    url: validateEnvVar('UPSTASH_REDIS_REST_URL', ''),
    token: validateEnvVar('UPSTASH_REDIS_REST_TOKEN', ''),
    enableTelemetry: validateBooleanEnvVar('UPSTASH_REDIS_TELEMETRY', false)
  },
  traditional: {
    host: validateEnvVar('REDIS_HOST', 'localhost'),
    port: validateNumericEnvVar('REDIS_PORT', 6379),
    password: process.env.REDIS_PASSWORD,
    db: validateNumericEnvVar('REDIS_DB', 0),
    retryDelayOnFailover: validateNumericEnvVar('REDIS_RETRY_DELAY', 100),
    maxRetriesPerRequest: validateNumericEnvVar('REDIS_MAX_RETRIES', 3),
    lazyConnect: validateBooleanEnvVar('REDIS_LAZY_CONNECT', true),
    keepAlive: validateNumericEnvVar('REDIS_KEEP_ALIVE', 30000),
    family: validateNumericEnvVar('REDIS_FAMILY', 4),
    connectTimeout: validateNumericEnvVar('REDIS_CONNECT_TIMEOUT', 10000),
    commandTimeout: validateNumericEnvVar('REDIS_COMMAND_TIMEOUT', 5000)
  },
  cache: {
    defaultTTL: validateNumericEnvVar('REDIS_DEFAULT_TTL', 3600), // 1 hour
    maxMemoryPolicy: validateEnvVar('REDIS_MAX_MEMORY_POLICY', 'allkeys-lru'),
    keyPrefix: validateEnvVar('REDIS_KEY_PREFIX', 'blog:')
  },
  rateLimit: {
    enabled: validateBooleanEnvVar('REDIS_RATE_LIMIT_ENABLED', true),
    windowMs: validateNumericEnvVar('REDIS_RATE_LIMIT_WINDOW', 60000), // 1 minute
    maxRequests: validateNumericEnvVar('REDIS_RATE_LIMIT_MAX', 1000), // Increased from 100 to 1000
    prefix: validateEnvVar('REDIS_RATE_LIMIT_PREFIX', '@upstash/ratelimit'),
    analytics: validateBooleanEnvVar('REDIS_RATE_LIMIT_ANALYTICS', true)
  },
  session: {
    prefix: validateEnvVar('REDIS_SESSION_PREFIX', 'session:'),
    ttl: validateNumericEnvVar('REDIS_SESSION_TTL', 86400) // 24 hours
  },
  monitoring: {
    enabled: validateBooleanEnvVar('REDIS_MONITORING_ENABLED', true),
    logLevel: (process.env.REDIS_LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info'
  }
}

// Cache key patterns
export const cacheKeys = {
  posts: {
    list: (page: number = 1, limit: number = 10) => `${redisConfig.cache.keyPrefix}posts:list:${page}:${limit}`,
    detail: (id: string) => `${redisConfig.cache.keyPrefix}posts:detail:${id}`,
    bySlug: (slug: string) => `${redisConfig.cache.keyPrefix}posts:slug:${slug}`,
    count: () => `${redisConfig.cache.keyPrefix}posts:count`,
    popular: (limit: number = 10) => `${redisConfig.cache.keyPrefix}posts:popular:${limit}`,
    recent: (limit: number = 10) => `${redisConfig.cache.keyPrefix}posts:recent:${limit}`
  },
  analytics: {
    views: (postId: string) => `${redisConfig.cache.keyPrefix}analytics:views:${postId}`,
    dailyViews: (date: string) => `${redisConfig.cache.keyPrefix}analytics:daily:${date}`,
    popularPosts: (period: string) => `${redisConfig.cache.keyPrefix}analytics:popular:${period}`
  },
  user: {
    profile: (userId: string) => `${redisConfig.cache.keyPrefix}user:profile:${userId}`,
    sessions: (userId: string) => `${redisConfig.cache.keyPrefix}user:sessions:${userId}`,
    preferences: (userId: string) => `${redisConfig.cache.keyPrefix}user:preferences:${userId}`
  },
  search: {
    results: (query: string, page: number = 1) => `${redisConfig.cache.keyPrefix}search:${encodeURIComponent(query)}:${page}`,
    suggestions: (query: string) => `${redisConfig.cache.keyPrefix}search:suggestions:${encodeURIComponent(query)}`
  },
  system: {
    health: () => `${redisConfig.cache.keyPrefix}system:health`,
    stats: () => `${redisConfig.cache.keyPrefix}system:stats`,
    config: () => `${redisConfig.cache.keyPrefix}system:config`
  }
}

// Cache TTL configurations (in seconds)
export const cacheTTL = {
  posts: {
    list: 300, // 5 minutes
    detail: 1800, // 30 minutes
    count: 600, // 10 minutes
    popular: 3600, // 1 hour
    recent: 300 // 5 minutes
  },
  analytics: {
    views: 60, // 1 minute
    dailyViews: 86400, // 24 hours
    popularPosts: 3600 // 1 hour
  },
  user: {
    profile: 1800, // 30 minutes
    sessions: 3600, // 1 hour
    preferences: 7200 // 2 hours
  },
  search: {
    results: 900, // 15 minutes
    suggestions: 1800 // 30 minutes
  },
  system: {
    health: 60, // 1 minute
    stats: 300, // 5 minutes
    config: 3600 // 1 hour
  }
}

// Redis connection health check
export const healthCheck = {
  timeout: 5000,
  retries: 3,
  retryDelay: 1000
}

// Log Redis configuration (without sensitive data)
if (redisConfig.monitoring.enabled) {
  console.log(`🔧 Redis Configuration:`)
  console.log(`   Provider: ${redisConfig.provider}`)
  console.log(`   Cache TTL: ${redisConfig.cache.defaultTTL}s`)
  console.log(`   Rate Limiting: ${redisConfig.rateLimit.enabled ? 'Enabled' : 'Disabled'}`)
  console.log(`   Monitoring: ${redisConfig.monitoring.enabled ? 'Enabled' : 'Disabled'}`)
  
  if (redisConfig.provider === 'traditional') {
    console.log(`   Host: ${redisConfig.traditional.host}:${redisConfig.traditional.port}`)
    console.log(`   Database: ${redisConfig.traditional.db}`)
  }
} 