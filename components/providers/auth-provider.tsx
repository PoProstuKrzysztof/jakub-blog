"use client"

import { createContext, useContext, ReactNode } from 'react'
import { AuthContext, useAuthProvider } from '@/hooks/use-auth'
import { useAuthErrorHandler } from '@/hooks/use-auth-error-handler'
import { Toaster } from 'sonner'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authContextValue = useAuthProvider()
  
  // Initialize global auth error handler
  useAuthErrorHandler({
    onRefreshTokenError: () => {
      console.log('Refresh token error handled globally')
    },
    showToasts: true,
    redirectToLogin: true
  })

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </AuthContext.Provider>
  )
} 