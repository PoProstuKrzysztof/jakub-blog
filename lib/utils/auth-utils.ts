import { createClient } from '@/lib/supabase/supabase'
import type { AuthError } from '@supabase/supabase-js'

export interface AuthTokenValidation {
  isValid: boolean
  needsRefresh: boolean
  error?: string
}

/**
 * Check if error is related to refresh token issues
 */
export function isRefreshTokenError(error: AuthError | Error | any): boolean {
  if (!error?.message) return false
  
  const message = error.message.toLowerCase()
  return (
    message.includes('refresh_token_not_found') ||
    message.includes('invalid refresh token') ||
    message.includes('refresh token not found') ||
    message.includes('refresh_token_revoked') ||
    message.includes('token_refresh_failed')
  )
}

/**
 * Check if error is related to session expiry
 */
export function isSessionExpiredError(error: AuthError | Error | any): boolean {
  if (!error?.message) return false
  
  const message = error.message.toLowerCase()
  return (
    message.includes('session_expired') ||
    message.includes('jwt expired') ||
    message.includes('token expired') ||
    message.includes('access_token_expired')
  )
}

/**
 * Validate current authentication tokens
 */
export async function validateAuthTokens(): Promise<AuthTokenValidation> {
  try {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      if (isRefreshTokenError(error)) {
        return {
          isValid: false,
          needsRefresh: false,
          error: 'Refresh token is invalid or expired'
        }
      }
      
      if (isSessionExpiredError(error)) {
        return {
          isValid: false,
          needsRefresh: true,
          error: 'Session expired, needs refresh'
        }
      }
      
      return {
        isValid: false,
        needsRefresh: false,
        error: error.message
      }
    }
    
    if (!session) {
      return {
        isValid: false,
        needsRefresh: false,
        error: 'No active session'
      }
    }
    
    // Check if session is close to expiry (within 5 minutes)
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    
    if (expiresAt - now < fiveMinutes) {
      return {
        isValid: true,
        needsRefresh: true,
        error: 'Session expires soon'
      }
    }
    
    return {
      isValid: true,
      needsRefresh: false
    }
  } catch (error) {
    return {
      isValid: false,
      needsRefresh: false,
      error: 'Failed to validate tokens'
    }
  }
}

/**
 * Attempt to refresh the session
 */
export async function refreshAuthSession(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.refreshSession()
    
    if (error) {
      return {
        success: false,
        error: error.message
      }
    }
    
    if (!session) {
      return {
        success: false,
        error: 'Failed to refresh session'
      }
    }
    
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error during refresh'
    }
  }
}

/**
 * Clean up authentication state
 */
export async function cleanupAuthState(): Promise<void> {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Clear any stored auth tokens from localStorage
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error cleaning up auth state:', error)
  }
}

/**
 * Handle auth errors with appropriate actions
 */
export async function handleAuthError(error: AuthError | Error | any): Promise<{
  shouldSignOut: boolean
  shouldRefresh: boolean
  shouldRedirect: boolean
}> {
  if (isRefreshTokenError(error)) {
    return {
      shouldSignOut: true,
      shouldRefresh: false,
      shouldRedirect: true
    }
  }
  
  if (isSessionExpiredError(error)) {
    return {
      shouldSignOut: false,
      shouldRefresh: true,
      shouldRedirect: false
    }
  }
  
  // For other auth errors, sign out to be safe
  return {
    shouldSignOut: true,
    shouldRefresh: false,
    shouldRedirect: true
  }
}

/**
 * Get user session with error handling
 */
export async function getUserSession() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      if (isRefreshTokenError(error)) {
        await cleanupAuthState()
        return { user: null, error: 'refresh_token_error' }
      }
      
      return { user: null, error: error.message }
    }
    
    return { user, error: null }
  } catch (error) {
    return { user: null, error: 'unexpected_error' }
  }
} 