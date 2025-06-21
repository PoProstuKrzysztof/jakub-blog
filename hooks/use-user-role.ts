"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { getUserRole, type UserRole } from '@/lib/utils/user-role'

/**
 * Hook do zarządzania rolą użytkownika
 */
export function useUserRole() {
  const { user, loading: authLoading } = useAuth()
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userRole = await getUserRole(user.id)
        setRole(userRole as UserRole)
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    // Jeśli auth się jeszcze ładuje, czekamy
    if (authLoading) {
      return
    }

    fetchUserRole()
  }, [user, authLoading])

  return {
    role,
    loading: loading || authLoading,
    isAdmin: role === 'admin' || role === 'author',
    isUser: role === 'user' || role === null,
    user
  }
} 