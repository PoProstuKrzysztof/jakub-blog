"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { createClient } from '@/lib/supabase/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user?: User | null; session?: Session | null; error?: string }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user?: User | null; session?: Session | null; error?: string }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error?: string }>
  refreshSession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to check if error is a refresh token error
function isRefreshTokenError(error: AuthError | Error): boolean {
  return error.message?.includes('refresh_token_not_found') ||
         error.message?.includes('Invalid Refresh Token') ||
         error.message?.includes('Refresh Token Not Found')
}

// Helper function to check if error is a normal auth session missing error
function isAuthSessionMissingError(error: any): boolean {
  return error?.message?.includes('Auth session missing') ||
         error?.message?.includes('AuthSessionMissingError') ||
         error?.message?.includes('session is required') ||
         error?.code === 'PGRST301' ||
         error?.status === 400 ||
         error?.name === 'AuthSessionMissingError'
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Function to handle session refresh
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) {
        if (isRefreshTokenError(error)) {
          console.warn('Refresh token expired, signing out user')
          await handleSignOut()
        } else {
          console.error('Session refresh failed:', error)
        }
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      await handleSignOut()
    }
  }

  // Helper function to handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
    } catch (error) {
      console.error('Error during sign out:', error)
      // Force local state cleanup even if server call fails
      setSession(null)
      setUser(null)
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          // Only log non-normal auth errors
          if (!isAuthSessionMissingError(error)) {
            console.error('Error getting initial session:', error)
          }
          if (isRefreshTokenError(error)) {
            await handleSignOut()
          }
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        if (!mounted) return
        
        // Only log non-normal auth errors
        if (!isAuthSessionMissingError(error)) {
          console.error('Error in getInitialSession:', error)
        }
        if (error instanceof Error && isRefreshTokenError(error)) {
          await handleSignOut()
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        console.log('Auth state changed:', event, session?.user?.id)
        
        try {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              setSession(session)
              setUser(session?.user ?? null)
              break
              
            case 'SIGNED_OUT':
              setSession(null)
              setUser(null)
              break
              
            case 'USER_UPDATED':
              if (session) {
                setSession(session)
                setUser(session.user)
              }
              break
              
            default:
              // For other events, update if we have a session
              setSession(session)
              setUser(session?.user ?? null)
          }
        } catch (error) {
          console.error('Error handling auth state change:', error)
          if (error instanceof Error && isRefreshTokenError(error)) {
            await handleSignOut()
          }
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      // Ustawiamy stan lokalny natychmiast, aby uniknąć opóźnienia do zdarzenia onAuthStateChange
      setSession(data.session ?? null)
      setUser(data.user ?? null)

      return { user: data.user ?? null, session: data.session ?? null, error: undefined }
    } catch (error) {
      return { error: 'Wystąpił nieoczekiwany błąd' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        return { error: error.message }
      }

      // Po udanej rejestracji ustaw sesję (może być null zależnie od polityki potwierdzania maila)
      setSession(data.session ?? null)
      setUser(data.user ?? null)

      return { user: data.user ?? null, session: data.session ?? null, error: undefined }
    } catch (error) {
      return { error: 'Wystąpił nieoczekiwany błąd' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await handleSignOut()
    } catch (error) {
      console.error('Error in signOut:', error)
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { error: undefined }
    } catch (error) {
      return { error: 'Wystąpił nieoczekiwany błąd' }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    refreshSession,
  }
} 