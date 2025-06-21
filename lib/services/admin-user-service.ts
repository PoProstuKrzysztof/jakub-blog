import { supabaseAdmin } from '@/lib/supabase/supabase-admin'
import type { Tables } from '@/lib/supabase/database.types'

export type Profile = Tables<'profiles'>
export type Order = Tables<'orders'>
export type Product = Tables<'products'>

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  username: string | null
  role: string | null
  is_active: boolean | null
  created_at: string
  last_sign_in_at: string | null
}

export interface UserOrder {
  id: string
  created_at: string
  status: string
  expires_at: string | null
  product_name: string
}

export interface UserWithAccess extends UserProfile {
  hasPortfolioAccess: boolean
  orders: UserOrder[]
}

/**
 * Serwis do zarządzania użytkownikami w panelu administratora
 * Używa supabaseAdmin dla operacji wymagających uprawnień administratora
 */
export class AdminUserService {
  private adminClient = supabaseAdmin

  /**
   * Pobiera wszystkich użytkowników z ich statusem dostępu do portfela
   */
  async getAllUsers(): Promise<UserWithAccess[]> {
    try {
      // Fetch all user profiles using admin client to bypass RLS
      const { data: profiles, error: profilesError } = await this.adminClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        throw new Error(`Błąd pobierania profili: ${profilesError.message}`)
      }

      // Get auth users to get email addresses using admin client
      const { data: { users: authUsers }, error: authError } = await this.adminClient.auth.admin.listUsers()
      
      if (authError) {
        console.error('Error fetching auth users:', authError)
      }

      // Combine profile data with auth data and check access
      const usersWithAccess: UserWithAccess[] = []
      
      for (const profile of profiles || []) {
        const authUser = authUsers?.find(au => au.id === profile.id)
        
        // Get user orders for portfolio access using admin client to bypass RLS
        const { data: orders, error: ordersError } = await this.adminClient
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            expires_at,
            products!inner (
              name
            )
          `)
          .eq('user_id', profile.id)
          .eq('products.slug', 'portfolio-access')
          .order('created_at', { ascending: false })

        const userOrders: UserOrder[] = (orders || []).map(order => {
          let productName = 'Portfolio access'
          if (order.products) {
            if (Array.isArray(order.products) && order.products[0]) {
              productName = order.products[0].name || 'Portfolio access'
            } else if (!Array.isArray(order.products)) {
              productName = (order.products as any).name || 'Portfolio access'
            }
          }
          
          return {
            id: order.id,
            created_at: order.created_at || '',
            status: order.status,
            expires_at: order.expires_at,
            product_name: productName
          }
        })

        // Check if user has active portfolio access
        const hasActiveOrder = userOrders.some(order => 
          order.status === 'paid' && 
          (!order.expires_at || new Date(order.expires_at) > new Date())
        )

        usersWithAccess.push({
          id: profile.id,
          email: authUser?.email || 'Brak emaila',
          full_name: profile.full_name,
          username: profile.username,
          role: profile.role,
          is_active: profile.is_active,
          created_at: profile.created_at || '',
          last_sign_in_at: authUser?.last_sign_in_at || null,
          hasPortfolioAccess: hasActiveOrder,
          orders: userOrders
        })
      }

      return usersWithAccess
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  /**
   * Przyznaje dostęp do portfela użytkownikowi na określony czas
   */
  async grantPortfolioAccess(userId: string, durationDays: number): Promise<void> {
    try {
      // First, get the portfolio-access product using admin client
      const { data: product, error: productError } = await this.adminClient
        .from('products')
        .select('*')
        .eq('slug', 'portfolio-access')
        .single()

      if (productError || !product) {
        throw new Error('Nie znaleziono produktu portfolio-access')
      }

      // Calculate expiry date
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + durationDays)

      // Create an order record to grant access using admin client
      const { error: orderError } = await this.adminClient
        .from('orders')
        .insert({
          user_id: userId,
          product_id: product.id,
          status: 'paid',
          price_cents: 0, // Free admin grant
          currency: product.currency,
          expires_at: expiryDate.toISOString()
        })

      if (orderError) {
        throw new Error(`Błąd przyznawania dostępu: ${orderError.message}`)
      }
    } catch (error) {
      console.error('Error granting portfolio access:', error)
      throw error
    }
  }

  /**
   * Sprawdza czy użytkownik ma uprawnienia administratora
   */
  async checkAdminPermissions(userId: string): Promise<boolean> {
    try {
      const { data: profile, error } = await this.adminClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error || !profile) {
        return false
      }

      return ['admin', 'author'].includes(profile.role)
    } catch (error) {
      console.error('Error checking admin permissions:', error)
      return false
    }
  }

  /**
   * Wyszukuje użytkowników na podstawie zapytania
   */
  searchUsers(users: UserWithAccess[], query: string): UserWithAccess[] {
    if (!query) return users

    const searchTerm = query.toLowerCase()
    return users.filter(user => 
      user.email.toLowerCase().includes(searchTerm) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm)) ||
      (user.username && user.username.toLowerCase().includes(searchTerm))
    )
  }

  /**
   * Anuluje dostęp użytkownika do portfela (oznacza zamówienia jako cancelled)
   */
  async revokePortfolioAccess(userId: string): Promise<void> {
    try {
      // Find active orders for portfolio access using admin client
      const { data: orders, error: ordersError } = await this.adminClient
        .from('orders')
        .select(`
          id,
          products!inner (
            slug
          )
        `)
        .eq('user_id', userId)
        .eq('products.slug', 'portfolio-access')
        .eq('status', 'paid')

      if (ordersError) {
        throw new Error(`Błąd pobierania zamówień: ${ordersError.message}`)
      }

      // Cancel all active orders using admin client
      if (orders && orders.length > 0) {
        const orderIds = orders.map(order => order.id)
        const { error: updateError } = await this.adminClient
          .from('orders')
          .update({ status: 'cancelled' })
          .in('id', orderIds)

        if (updateError) {
          throw new Error(`Błąd anulowania dostępu: ${updateError.message}`)
        }
      }
    } catch (error) {
      console.error('Error revoking portfolio access:', error)
      throw error
    }
  }

  /**
   * Pobiera statystyki użytkowników
   */
  async getUserStats(): Promise<{
    totalUsers: number
    usersWithAccess: number
    activeUsers: number
    recentUsers: number
  }> {
    try {
      const users = await this.getAllUsers()
      
      const totalUsers = users.length
      const usersWithAccess = users.filter(u => u.hasPortfolioAccess).length
      const activeUsers = users.filter(u => u.is_active).length
      
      // Users registered in the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentUsers = users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length

      return {
        totalUsers,
        usersWithAccess,
        activeUsers,
        recentUsers
      }
    } catch (error) {
      console.error('Error getting user stats:', error)
      throw error
    }
  }
} 