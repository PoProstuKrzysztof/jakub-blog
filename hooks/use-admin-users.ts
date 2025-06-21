import { useState, useEffect } from 'react'
import { type UserWithAccess } from '@/lib/services/admin-user-service'

export function useAdminUsers() {
  const [users, setUsers] = useState<UserWithAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersWithAccess: 0,
    activeUsers: 0,
    recentUsers: 0
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [usersResponse, statsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/users/stats')
      ])

      if (!usersResponse.ok) {
        const errorData = await usersResponse.json()
        throw new Error(errorData.error || 'Błąd podczas pobierania użytkowników')
      }

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json()
        throw new Error(errorData.error || 'Błąd podczas pobierania statystyk')
      }

      const usersData = await usersResponse.json()
      const statsData = await statsResponse.json()
      
      setUsers(usersData.users)
      setStats(statsData.stats)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania użytkowników')
    } finally {
      setLoading(false)
    }
  }

  const grantAccess = async (userId: string, durationDays: number) => {
    try {
      const response = await fetch('/api/admin/users/grant-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, durationDays }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Błąd podczas przyznawania dostępu')
      }

      // Refresh data after granting access
      await fetchUsers()
      return { success: true }
    } catch (err) {
      console.error('Error granting access:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Wystąpił błąd podczas przyznawania dostępu' 
      }
    }
  }

  const revokeAccess = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users/revoke-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Błąd podczas odbierania dostępu')
      }

      // Refresh data after revoking access
      await fetchUsers()
      return { success: true }
    } catch (err) {
      console.error('Error revoking access:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Wystąpił błąd podczas odbierania dostępu' 
      }
    }
  }

  const searchUsers = (query: string) => {
    if (!query) return users

    const searchTerm = query.toLowerCase()
    return users.filter(user => 
      user.email.toLowerCase().includes(searchTerm) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm)) ||
      (user.username && user.username.toLowerCase().includes(searchTerm))
    )
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    stats,
    fetchUsers,
    grantAccess,
    revokeAccess,
    searchUsers
  }
} 