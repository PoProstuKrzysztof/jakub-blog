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
  product_slug: string
  price_cents: number
  currency: string
}

export interface UserWithAccess extends UserProfile {
  hasPortfolioAccess: boolean
  orders: UserOrder[]
  purchasedProducts: UserOrder[] // All purchased products
}

/**
 * Serwis do zarządzania użytkownikami w panelu administratora
 * Używa supabaseAdmin dla operacji wymagających uprawnień administratora
 */
export class AdminUserService {
  private adminClient = supabaseAdmin

  /**
   * Pobiera wszystkich użytkowników z ich statusem dostępu do portfela i wszystkimi zakupionymi produktami
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
        
        // Get ALL user orders using admin client to bypass RLS
        const { data: allOrders, error: allOrdersError } = await this.adminClient
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            expires_at,
            price_cents,
            currency,
            products!inner (
              name,
              slug
            )
          `)
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })

        if (allOrdersError) {
          console.error(`Error fetching orders for user ${profile.id}:`, allOrdersError)
        }

        // Transform all orders
        const allUserOrders: UserOrder[] = (allOrders || []).map(order => {
          let productName = 'Unknown Product'
          let productSlug = 'unknown'
          
          if (order.products) {
            if (Array.isArray(order.products) && order.products[0]) {
              productName = order.products[0].name || 'Unknown Product'
              productSlug = order.products[0].slug || 'unknown'
            } else if (!Array.isArray(order.products)) {
              productName = (order.products as any).name || 'Unknown Product'
              productSlug = (order.products as any).slug || 'unknown'
            }
          }
          
          return {
            id: order.id,
            created_at: order.created_at || '',
            status: order.status,
            expires_at: order.expires_at,
            product_name: productName,
            product_slug: productSlug,
            price_cents: order.price_cents,
            currency: order.currency
          }
        })

        // Filter only portfolio-access orders for backward compatibility
        const portfolioOrders = allUserOrders.filter(order => order.product_slug === 'portfolio-access')

        // Filter only paid products for purchased products display
        const purchasedProducts = allUserOrders.filter(order => order.status === 'paid')

        // Check if user has active portfolio access
        const hasActivePortfolioAccess = portfolioOrders.some(order => 
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
          hasPortfolioAccess: hasActivePortfolioAccess,
          orders: portfolioOrders, // Keep for backward compatibility
          purchasedProducts: purchasedProducts // All purchased products
        })
      }

      return usersWithAccess
    } catch (error) {
      console.error('Error fetching users:', error)
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