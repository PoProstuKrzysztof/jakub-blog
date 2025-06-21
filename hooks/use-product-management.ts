import { useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price_cents: number
  currency: string
  is_active: boolean
  created_at: string
}

export interface ProductManagementResult {
  products: Product[]
  loading: boolean
  error: string | null
  grantProductAccess: (userId: string, productId: string, durationDays: number) => Promise<{ success: boolean; error?: string }>
  revokeProductAccess: (userId: string, productId: string) => Promise<{ success: boolean; error?: string }>
  refreshProducts: () => Promise<void>
}

export function useProductManagement(): ProductManagementResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/products')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd podczas pobierania produktów')
      }

      setProducts(data.products || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  const grantProductAccess = async (
    userId: string, 
    productId: string, 
    durationDays: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/users/grant-product-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          durationDays,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Błąd podczas przyznawania dostępu' }
      }

      return { success: true }
    } catch (err) {
      console.error('Error granting product access:', err)
      return { success: false, error: 'Błąd podczas przyznawania dostępu do produktu' }
    }
  }

  const revokeProductAccess = async (
    userId: string, 
    productId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/users/revoke-product-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Błąd podczas odbierania dostępu' }
      }

      return { success: true }
    } catch (err) {
      console.error('Error revoking product access:', err)
      return { success: false, error: 'Błąd podczas odbierania dostępu do produktu' }
    }
  }

  const refreshProducts = async () => {
    await fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    grantProductAccess,
    revokeProductAccess,
    refreshProducts,
  }
} 