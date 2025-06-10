"use client"

import { Suspense } from 'react'
import { AuthContext, useAuthProvider } from "@/hooks/use-auth"

interface AuthProviderProps {
  children: React.ReactNode
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const auth = useAuthProvider()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </Suspense>
  )
} 