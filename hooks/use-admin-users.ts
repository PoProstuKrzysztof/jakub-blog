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
    searchUsers
  }
} 