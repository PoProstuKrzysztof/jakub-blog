"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AuthErrorHandlerConfig {
  onRefreshTokenError?: () => void
  onSessionExpired?: () => void
  showToasts?: boolean
  redirectToLogin?: boolean
}

export function useAuthErrorHandler(config: AuthErrorHandlerConfig = {}) {
  const router = useRouter()
  const supabase = createClient()
  
  const {
    onRefreshTokenError,
    onSessionExpired,
    showToasts = true,
    redirectToLogin = true
  } = config

  useEffect(() => {
    // Global error handler for Supabase auth errors
    const handleGlobalAuthError = (error: any) => {
      console.error('Global auth error:', error)
      
      // Check if it's a refresh token error
      if (
        error?.message?.includes('refresh_token_not_found') ||
        error?.message?.includes('Invalid Refresh Token') ||
        error?.message?.includes('Refresh Token Not Found')
      ) {
        if (showToasts) {
          toast.error('Sesja wygasła. Zostaniesz przekierowany do logowania.')
        }
        
        // Call custom handler if provided
        if (onRefreshTokenError) {
          onRefreshTokenError()
        }
        
        // Clear local storage and redirect
        if (redirectToLogin) {
          localStorage.removeItem('supabase.auth.token')
          setTimeout(() => {
            router.push('/login')
          }, 1000)
        }
      }
      
      // Handle session expired
      if (error?.message?.includes('session_expired')) {
        if (showToasts) {
          toast.warning('Sesja wygasła. Zaloguj się ponownie.')
        }
        
        if (onSessionExpired) {
          onSessionExpired()
        }
        
        if (redirectToLogin) {
          router.push('/login')
        }
      }
    }

    // Listen for auth errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' && !session) {
          // Check if it was due to an error
          const lastError = localStorage.getItem('auth_error')
          if (lastError) {
            handleGlobalAuthError(JSON.parse(lastError))
            localStorage.removeItem('auth_error')
          }
        }
      }
    )

    // Override console.error to catch auth errors
    const originalConsoleError = console.error
    console.error = (...args) => {
      const errorMessage = args.join(' ')
      if (
        errorMessage.includes('AuthApiError') ||
        errorMessage.includes('refresh_token_not_found') ||
        errorMessage.includes('Invalid Refresh Token')
      ) {
        handleGlobalAuthError({ message: errorMessage })
      }
      originalConsoleError(...args)
    }

    return () => {
      subscription.unsubscribe()
      console.error = originalConsoleError
    }
  }, [router, onRefreshTokenError, onSessionExpired, showToasts, redirectToLogin, supabase.auth])

  // Manual error handler function
  const handleAuthError = (error: any) => {
    if (
      error?.message?.includes('refresh_token_not_found') ||
      error?.message?.includes('Invalid Refresh Token') ||
      error?.message?.includes('Refresh Token Not Found')
    ) {
      if (showToasts) {
        toast.error('Problem z sesją. Zaloguj się ponownie.')
      }
      
      // Store error for later handling
      localStorage.setItem('auth_error', JSON.stringify(error))
      
      // Sign out to trigger cleanup
      supabase.auth.signOut()
    }
  }

  return {
    handleAuthError
  }
} 