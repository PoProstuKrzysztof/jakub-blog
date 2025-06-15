/**
 * Redis Session Management
 * Advanced session handling with TTL, refresh tokens, and invalidation
 */

import { redis } from './client'
import { redisConfig } from './config'
import { randomBytes, createHash } from 'crypto'

export interface SessionData {
  userId: string
  email?: string
  role?: string
  permissions?: string[]
  metadata?: Record<string, any>
  createdAt: number
  lastAccessedAt: number
  expiresAt: number
  ipAddress?: string
  userAgent?: string
}

export interface SessionOptions {
  ttl?: number
  refreshable?: boolean
  maxSessions?: number
  ipBinding?: boolean
  userAgentBinding?: boolean
}

export interface RefreshTokenData {
  sessionId: string
  userId: string
  createdAt: number
  expiresAt: number
  used: boolean
}

class RedisSessionManager {
  private readonly SESSION_PREFIX = `${redisConfig.session.prefix}`
  private readonly REFRESH_PREFIX = `${redisConfig.session.prefix}refresh:`
  private readonly USER_SESSIONS_PREFIX = `${redisConfig.session.prefix}user:`
  private readonly ACTIVE_SESSIONS_KEY = `${redisConfig.session.prefix}active`

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    sessionData: Partial<SessionData> = {},
    options: SessionOptions = {}
  ): Promise<{
    sessionId: string
    refreshToken?: string
    expiresAt: number
  }> {
    const sessionId = this.generateSessionId()
    const now = Date.now()
    const ttl = options.ttl || redisConfig.session.ttl
    const expiresAt = now + (ttl * 1000)

    const session: SessionData = {
      userId,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt,
      ...sessionData
    }

    try {
      // Store session data
      const sessionKey = `${this.SESSION_PREFIX}${sessionId}`
      await redis.set(sessionKey, JSON.stringify(session), ttl)

      // Track user sessions
      const userSessionsKey = `${this.USER_SESSIONS_PREFIX}${userId}`
      await redis.sadd(userSessionsKey, sessionId)
      await redis.expire(userSessionsKey, ttl)

      // Add to active sessions
      await redis.zadd(this.ACTIVE_SESSIONS_KEY, expiresAt, sessionId)

      // Enforce max sessions per user
      if (options.maxSessions && options.maxSessions > 0) {
        await this.enforceMaxSessions(userId, options.maxSessions)
      }

      // Create refresh token if requested
      let refreshToken: string | undefined
      if (options.refreshable) {
        refreshToken = await this.createRefreshToken(sessionId, userId)
      }

      return {
        sessionId,
        refreshToken,
        expiresAt
      }
    } catch (error) {
      console.error('Failed to create session:', error)
      throw new Error('Session creation failed')
    }
  }

  /**
   * Get session data
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionKey = `${this.SESSION_PREFIX}${sessionId}`
      const sessionData = await redis.get(sessionKey)

      if (!sessionData) {
        return null
      }

      const session: SessionData = JSON.parse(sessionData)

      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        await this.destroySession(sessionId)
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  /**
   * Update session data
   */
  async updateSession(
    sessionId: string,
    updates: Partial<SessionData>,
    touchLastAccessed: boolean = true
  ): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId)
      if (!session) {
        return false
      }

      const updatedSession: SessionData = {
        ...session,
        ...updates,
        lastAccessedAt: touchLastAccessed ? Date.now() : session.lastAccessedAt
      }

      const sessionKey = `${this.SESSION_PREFIX}${sessionId}`
      const ttl = Math.ceil((updatedSession.expiresAt - Date.now()) / 1000)

      if (ttl <= 0) {
        await this.destroySession(sessionId)
        return false
      }

      await redis.set(sessionKey, JSON.stringify(updatedSession), ttl)
      return true
    } catch (error) {
      console.error('Failed to update session:', error)
      return false
    }
  }

  /**
   * Touch session (update last accessed time)
   */
  async touchSession(sessionId: string): Promise<boolean> {
    return await this.updateSession(sessionId, {}, true)
  }

  /**
   * Extend session TTL
   */
  async extendSession(sessionId: string, additionalTtl: number): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId)
      if (!session) {
        return false
      }

      const newExpiresAt = session.expiresAt + (additionalTtl * 1000)
      const newTtl = Math.ceil((newExpiresAt - Date.now()) / 1000)

      if (newTtl <= 0) {
        return false
      }

      const updatedSession: SessionData = {
        ...session,
        expiresAt: newExpiresAt,
        lastAccessedAt: Date.now()
      }

      const sessionKey = `${this.SESSION_PREFIX}${sessionId}`
      await redis.set(sessionKey, JSON.stringify(updatedSession), newTtl)

      // Update active sessions score
      await redis.zadd(this.ACTIVE_SESSIONS_KEY, newExpiresAt, sessionId)

      return true
    } catch (error) {
      console.error('Failed to extend session:', error)
      return false
    }
  }

  /**
   * Destroy a session
   */
  async destroySession(sessionId: string): Promise<boolean> {
    try {
      const session = await this.getSession(sessionId)
      
      const sessionKey = `${this.SESSION_PREFIX}${sessionId}`
      await redis.del(sessionKey)

      // Remove from active sessions
      await redis.zrem(this.ACTIVE_SESSIONS_KEY, sessionId)

      // Remove from user sessions
      if (session) {
        const userSessionsKey = `${this.USER_SESSIONS_PREFIX}${session.userId}`
        await redis.srem(userSessionsKey, sessionId)
      }

      // Invalidate associated refresh tokens
      await this.invalidateRefreshTokensForSession(sessionId)

      return true
    } catch (error) {
      console.error('Failed to destroy session:', error)
      return false
    }
  }

  /**
   * Destroy all sessions for a user
   */
  async destroyUserSessions(userId: string): Promise<number> {
    try {
      const userSessionsKey = `${this.USER_SESSIONS_PREFIX}${userId}`
      const sessionIds = await redis.smembers(userSessionsKey)

      if (sessionIds.length === 0) {
        return 0
      }

      // Destroy each session
      const destroyPromises = sessionIds.map(sessionId => this.destroySession(sessionId))
      await Promise.all(destroyPromises)

      // Clear user sessions set
      await redis.del(userSessionsKey)

      return sessionIds.length
    } catch (error) {
      console.error('Failed to destroy user sessions:', error)
      return 0
    }
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      const userSessionsKey = `${this.USER_SESSIONS_PREFIX}${userId}`
      const sessionIds = await redis.smembers(userSessionsKey)

      if (sessionIds.length === 0) {
        return []
      }

      const sessionPromises = sessionIds.map(sessionId => this.getSession(sessionId))
      const sessions = await Promise.all(sessionPromises)

      return sessions.filter((session): session is SessionData => session !== null)
    } catch (error) {
      console.error('Failed to get user sessions:', error)
      return []
    }
  }

  /**
   * Create refresh token
   */
  async createRefreshToken(sessionId: string, userId: string): Promise<string> {
    const refreshToken = this.generateRefreshToken()
    const now = Date.now()
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000) // 30 days

    const tokenData: RefreshTokenData = {
      sessionId,
      userId,
      createdAt: now,
      expiresAt,
      used: false
    }

    try {
      const tokenKey = `${this.REFRESH_PREFIX}${refreshToken}`
      const ttl = Math.ceil((expiresAt - now) / 1000)
      await redis.set(tokenKey, JSON.stringify(tokenData), ttl)

      return refreshToken
    } catch (error) {
      console.error('Failed to create refresh token:', error)
      throw new Error('Refresh token creation failed')
    }
  }

  /**
   * Use refresh token to create new session
   */
  async refreshSession(refreshToken: string): Promise<{
    sessionId: string
    refreshToken: string
    expiresAt: number
  } | null> {
    try {
      const tokenKey = `${this.REFRESH_PREFIX}${refreshToken}`
      const tokenDataStr = await redis.get(tokenKey)

      if (!tokenDataStr) {
        return null
      }

      const tokenData: RefreshTokenData = JSON.parse(tokenDataStr)

      // Check if token is expired or already used
      if (tokenData.expiresAt < Date.now() || tokenData.used) {
        await redis.del(tokenKey)
        return null
      }

      // Mark token as used
      tokenData.used = true
      await redis.set(tokenKey, JSON.stringify(tokenData), 60) // Keep for 1 minute for audit

      // Get original session data
      const originalSession = await this.getSession(tokenData.sessionId)
      if (!originalSession) {
        return null
      }

      // Create new session
      const newSession = await this.createSession(
        tokenData.userId,
        {
          email: originalSession.email,
          role: originalSession.role,
          permissions: originalSession.permissions,
          metadata: originalSession.metadata,
          ipAddress: originalSession.ipAddress,
          userAgent: originalSession.userAgent
        },
        { refreshable: true }
      )

      // Destroy old session
      await this.destroySession(tokenData.sessionId)

      return newSession
    } catch (error) {
      console.error('Failed to refresh session:', error)
      return null
    }
  }

  /**
   * Invalidate refresh tokens for a session
   */
  async invalidateRefreshTokensForSession(sessionId: string): Promise<void> {
    try {
      // This is a simplified approach - in production, you might want to maintain
      // a reverse index of refresh tokens by session ID
      const pattern = `${this.REFRESH_PREFIX}*`
      const keys = await redis.keys(pattern)

      for (const key of keys) {
        const tokenDataStr = await redis.get(key)
        if (tokenDataStr) {
          const tokenData: RefreshTokenData = JSON.parse(tokenDataStr)
          if (tokenData.sessionId === sessionId) {
            await redis.del(key)
          }
        }
      }
    } catch (error) {
      console.error('Failed to invalidate refresh tokens:', error)
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const now = Date.now()
      const expiredSessionIds = await redis.zrangebyscore(
        this.ACTIVE_SESSIONS_KEY,
        0,
        now
      )

      if (expiredSessionIds.length === 0) {
        return 0
      }

      // Remove expired sessions
      const cleanupPromises = expiredSessionIds.map(sessionId => this.destroySession(sessionId))
      await Promise.all(cleanupPromises)

      return expiredSessionIds.length
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error)
      return 0
    }
  }

  /**
   * Get session statistics
   */
  async getSessionStats(): Promise<{
    totalActiveSessions: number
    sessionsPerUser: Record<string, number>
    oldestSession: number | null
    newestSession: number | null
  }> {
    try {
      const totalActiveSessions = await redis.zcard(this.ACTIVE_SESSIONS_KEY)
      
      // Get oldest and newest session timestamps
      const oldest = await redis.zrange(this.ACTIVE_SESSIONS_KEY, 0, 0, 'WITHSCORES')
      const newest = await redis.zrange(this.ACTIVE_SESSIONS_KEY, -1, -1, 'WITHSCORES')

      const oldestSession = oldest.length > 1 ? parseInt(oldest[1]) : null
      const newestSession = newest.length > 1 ? parseInt(newest[1]) : null

      // Count sessions per user (simplified - would need optimization for large datasets)
      const userSessionsPattern = `${this.USER_SESSIONS_PREFIX}*`
      const userSessionKeys = await redis.keys(userSessionsPattern)
      const sessionsPerUser: Record<string, number> = {}

      for (const key of userSessionKeys) {
        const userId = key.replace(this.USER_SESSIONS_PREFIX, '')
        const sessionCount = await redis.scard(key)
        sessionsPerUser[userId] = sessionCount
      }

      return {
        totalActiveSessions,
        sessionsPerUser,
        oldestSession,
        newestSession
      }
    } catch (error) {
      console.error('Failed to get session stats:', error)
      return {
        totalActiveSessions: 0,
        sessionsPerUser: {},
        oldestSession: null,
        newestSession: null
      }
    }
  }

  /**
   * Enforce maximum sessions per user
   */
  private async enforceMaxSessions(userId: string, maxSessions: number): Promise<void> {
    try {
      const userSessionsKey = `${this.USER_SESSIONS_PREFIX}${userId}`
      const sessionIds = await redis.smembers(userSessionsKey)

      if (sessionIds.length <= maxSessions) {
        return
      }

      // Get session data to sort by last accessed time
      const sessionPromises = sessionIds.map(async sessionId => {
        const session = await this.getSession(sessionId)
        return { sessionId, session }
      })

      const sessionResults = await Promise.all(sessionPromises)
      const validSessions = sessionResults
        .filter(result => result.session !== null)
        .sort((a, b) => (a.session!.lastAccessedAt - b.session!.lastAccessedAt))

      // Remove oldest sessions
      const sessionsToRemove = validSessions.slice(0, validSessions.length - maxSessions)
      const removePromises = sessionsToRemove.map(({ sessionId }) => this.destroySession(sessionId))
      
      await Promise.all(removePromises)
    } catch (error) {
      console.error('Failed to enforce max sessions:', error)
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return randomBytes(32).toString('hex')
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(): string {
    const randomData = randomBytes(64)
    return createHash('sha256').update(randomData).digest('hex')
  }
}

// Singleton instance
let sessionManager: RedisSessionManager | null = null

export function getSessionManager(): RedisSessionManager {
  if (!sessionManager) {
    sessionManager = new RedisSessionManager()
  }
  return sessionManager
}

// Helper functions
export async function createUserSession(
  userId: string,
  sessionData: Partial<SessionData> = {},
  options: SessionOptions = {}
): Promise<{
  sessionId: string
  refreshToken?: string
  expiresAt: number
}> {
  const manager = getSessionManager()
  return await manager.createSession(userId, sessionData, options)
}

export async function getUserSession(sessionId: string): Promise<SessionData | null> {
  const manager = getSessionManager()
  return await manager.getSession(sessionId)
}

export async function destroyUserSession(sessionId: string): Promise<boolean> {
  const manager = getSessionManager()
  return await manager.destroySession(sessionId)
}

export async function refreshUserSession(refreshToken: string): Promise<{
  sessionId: string
  refreshToken: string
  expiresAt: number
} | null> {
  const manager = getSessionManager()
  return await manager.refreshSession(refreshToken)
}

export async function cleanupSessions(): Promise<number> {
  const manager = getSessionManager()
  return await manager.cleanupExpiredSessions()
}

export { RedisSessionManager }
export default getSessionManager() 