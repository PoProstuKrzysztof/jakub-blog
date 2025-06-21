import { createClient } from '@/lib/supabase/supabase'
import type { Tables } from '@/lib/supabase/database.types'

export type Order = Tables<'orders'>
export type Product = Tables<'products'>

export interface OrderWithProduct extends Order {
  products: Product | null
}

export interface UserProduct {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  expires_at: string | null
  purchased_at: string
}

/**
 * Serwis do zarządzania danymi użytkownika
 */
export class UserService {
  private supabase = createClient()

  /**
   * Pobiera zamówienia użytkownika z produktami
   */
  async getUserOrders(userId: string): Promise<OrderWithProduct[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Błąd pobierania zamówień: ${error.message}`)
    }

    return data || []
  }

  /**
   * Pobiera aktywne produkty użytkownika
   */
  async getUserProducts(userId: string): Promise<UserProduct[]> {
    const orders = await this.getUserOrders(userId)
    const activeProducts: UserProduct[] = []

    for (const order of orders) {
      if (order.status === 'paid' && order.products) {
        const isExpired = order.expires_at ? new Date(order.expires_at) <= new Date() : false
        
        // Sprawdź czy produkt już nie jest w liście (unikaj duplikatów)
        const existingProduct = activeProducts.find(p => p.id === order.products!.id)
        if (!existingProduct) {
          activeProducts.push({
            id: order.products.id,
            name: order.products.name,
            slug: order.products.slug,
            description: order.products.description,
            is_active: !isExpired,
            expires_at: order.expires_at,
            purchased_at: order.created_at || ''
          })
        }
      }
    }

    return activeProducts
  }

  /**
   * Sprawdza czy użytkownik ma dostęp do produktu
   */
  async hasProductAccess(userId: string, productSlug: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('has_product', { 
        p_slug: productSlug 
      })

      if (error) {
        console.error('Error checking product access:', error)
        return false
      }

      return data || false
    } catch (error) {
      console.error('Error in hasProductAccess:', error)
      return false
    }
  }

  /**
   * Pobiera statystyki użytkownika
   */
  async getUserStats(userId: string): Promise<{
    totalOrders: number
    totalSpent: number
    activeProducts: number
  }> {
    const orders = await this.getUserOrders(userId)
    const products = await this.getUserProducts(userId)

    const totalSpent = orders
      .filter(order => order.status === 'paid')
      .reduce((sum, order) => sum + order.price_cents, 0)

    const activeProducts = products.filter(p => p.is_active).length

    return {
      totalOrders: orders.length,
      totalSpent,
      activeProducts
    }
  }
}

/**
 * Singleton instance serwisu użytkownika
 */
export const userService = new UserService() 