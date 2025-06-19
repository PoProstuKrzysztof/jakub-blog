"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SiteHeader } from '@/components/common/site-header'
import { Loader2, Package, CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  created_at: string
  status: string
  price_cents: number
  currency: string
  expires_at: string | null
  products: {
    id: string
    name: string
    slug: string
    description: string | null
  } | null
}

interface UserProduct {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  expires_at: string | null
  purchased_at: string
}

export default function UserPanelPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [userProducts, setUserProducts] = useState<UserProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
              router.push('/login')
    }
  }, [authLoading, user, router])

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const supabase = createClient()

        // Fetch orders with product details
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            price_cents,
            currency,
            expires_at,
            products!inner (
              id,
              name,
              slug,
              description
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersError) {
          throw new Error(`Błąd pobierania zamówień: ${ordersError.message}`)
        }

        // Transform the data to match our interface
        const transformedOrders: Order[] = (ordersData || []).map(order => ({
          ...order,
          products: Array.isArray(order.products) ? order.products[0] : order.products
        })).filter(order => order.products !== null) as Order[]

        setOrders(transformedOrders)

        // Extract user products from paid orders
        const activeProducts: UserProduct[] = []
        for (const order of transformedOrders) {
          if (order.status === 'paid' && order.products) {
            const isExpired = order.expires_at ? new Date(order.expires_at) <= new Date() : false
            activeProducts.push({
              id: order.products.id,
              name: order.products.name,
              slug: order.products.slug,
              description: order.products.description,
              is_active: !isExpired,
              expires_at: order.expires_at,
              purchased_at: order.created_at
            })
          }
        }

        setUserProducts(activeProducts)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania danych')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Opłacone
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Anulowane
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Zwrócone
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        )
    }
  }

  const getProductLink = (slug: string) => {
    switch (slug) {
      case 'portfolio-access':
        return '/portfel-autora'
      default:
        return '/wpisy'
    }
  }

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader currentPage="panel" />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg text-muted-foreground">Ładowanie panelu użytkownika...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (this should be handled by useEffect above)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader currentPage="panel" user={user} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Panel użytkownika</h1>
          <p className="text-muted-foreground">
            Zarządzaj swoimi zakupami i dostępami
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Informacje o koncie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Konto utworzone:</strong> {formatDate(user.created_at)}</p>
              {user.last_sign_in_at && (
                <p><strong>Ostatnie logowanie:</strong> {formatDate(user.last_sign_in_at)}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Moje produkty
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Historia zakupów
            </TabsTrigger>
          </TabsList>

          {/* User Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dostępne produkty</CardTitle>
                <CardDescription>
                  Produkty które zakupiłeś i masz do nich aktualnie dostęp
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">Brak zakupionych produktów</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Odkryj nasze produkty i zacznij swoją przygodę inwestycyjną
                    </p>
                    <Link href="/wspolpraca">
                      <Button>Zobacz produkty</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{product.name}</h3>
                            {product.description && (
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Zakupiono: {formatDate(product.purchased_at)}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            {product.is_active ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Aktywny
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="h-3 w-3 mr-1" />
                                Wygasły
                              </Badge>
                            )}
                            {product.expires_at && (
                              <p className="text-xs text-muted-foreground">
                                Wygasa: {formatDate(product.expires_at)}
                              </p>
                            )}
                          </div>
                        </div>
                        {product.is_active && (
                          <Link href={getProductLink(product.slug)}>
                            <Button size="sm" className="w-full sm:w-auto">
                              Przejdź do produktu
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders History Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historia transakcji</CardTitle>
                <CardDescription>
                  Wszystkie twoje zakupy i transakcje
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Brak historii zakupów</p>
                    <p className="text-sm text-muted-foreground">
                      Twoje przyszłe zakupy będą tutaj widoczne
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                                                 <div className="flex items-start justify-between mb-3">
                           <div className="space-y-1">
                             <h3 className="font-semibold">{order.products?.name || 'Nieznany produkt'}</h3>
                             <p className="text-sm text-muted-foreground">
                               Zamówienie #{order.id.substring(0, 8)}
                             </p>
                             <p className="text-sm text-muted-foreground flex items-center">
                               <Calendar className="h-3 w-3 mr-1" />
                               {formatDate(order.created_at)}
                             </p>
                           </div>
                          <div className="text-right space-y-2">
                            {getStatusBadge(order.status)}
                            <p className="font-semibold">
                              {formatPrice(order.price_cents, order.currency)}
                            </p>
                          </div>
                        </div>
                        {order.expires_at && (
                          <p className="text-xs text-muted-foreground">
                            Dostęp do: {formatDate(order.expires_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 