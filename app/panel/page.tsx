"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/common/site-header'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  Package, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Sparkles,
  ArrowRight,
  Gift,
  ShoppingBag,
  Star,
  TrendingUp
} from 'lucide-react'
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
          <Badge variant="default" className="bg-success-green-100 text-success-green-800 hover:bg-success-green-100 border-success-green-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Opłacone
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="destructive" className="shadow-sm">
            <XCircle className="h-3 w-3 mr-1.5" />
            Anulowane
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="secondary" className="shadow-sm">
            <Clock className="h-3 w-3 mr-1.5" />
            Zwrócone
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="shadow-sm">
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
      <div className="min-h-screen bg-gradient-to-br from-background via-light-gray-100 to-background">
        <SiteHeader currentPage="panel" />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-2 border-primary/20 border-t-primary mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-foreground">Ładowanie panelu użytkownika...</p>
                <p className="text-sm text-muted-foreground">Przygotowujemy Twoje dane</p>
              </div>
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

  const activeProductsCount = userProducts.filter(p => p.is_active).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-light-gray-100 to-background">
      <SiteHeader currentPage="panel" user={user} />
      
      <div className="container mx-auto p-4 sm:p-6 space-y-8 max-w-6xl">
        {/* Header with animation */}
        <div className="space-y-6 animate-in slide-in-from-top-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Panel użytkownika
                      </h1>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Zarządzaj swoimi zakupami i dostępami
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Quick stats */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-bold text-2xl text-primary">{activeProductsCount}</div>
                    <div className="text-muted-foreground">Aktywne produkty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5 animate-in slide-in-from-top-2">
              <CardContent className="pt-6">
                <p className="text-destructive flex items-center space-x-2">
                  <XCircle className="h-4 w-4" />
                  <span>{error}</span>
                </p>
              </CardContent>
            </Card>
          )}

          {/* User Info Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-top-3">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <span>Informacje o koncie</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Konto utworzone</span>
                  </div>
                  <p className="font-medium">{formatDate(user.created_at)}</p>
                </div>
                {user.last_sign_in_at && (
                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Ostatnie logowanie</span>
                    </div>
                    <p className="font-medium">{formatDate(user.last_sign_in_at)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Products Section */}
        <div className="animate-in slide-in-from-left-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-success-green-100 rounded-xl">
                  <Gift className="h-5 w-5 text-success-green-600" />
                </div>
                <span>Dostępne produkty</span>
              </CardTitle>
              <CardDescription>
                Produkty które zakupiłeś i masz do nich aktualnie dostęp
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-full blur-2xl"></div>
                    <div className="relative p-6 bg-primary/5 rounded-full inline-block">
                      <ShoppingBag className="h-12 w-12 text-primary/60" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Brak zakupionych produktów</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Odkryj nasze produkty i zacznij swoją przygodę inwestycyjną już dziś
                  </p>
                  <Link href="/wspolpraca">
                    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                      <Star className="h-4 w-4 mr-2" />
                      Zobacz produkty
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {userProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="group relative overflow-hidden border border-border/50 rounded-2xl p-6 bg-gradient-to-br from-card via-card to-card/50 hover:shadow-xl transition-all duration-300 hover:border-primary/30"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slide-in-from-left 0.5s ease-out forwards'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative flex items-start justify-between flex-col sm:flex-row gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                                {product.name}
                              </h3>
                              {product.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {product.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Zakupiono: {formatDate(product.purchased_at)}</span>
                            </div>
                            {product.expires_at && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Wygasa: {formatDate(product.expires_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3 sm:min-w-[140px]">
                          {product.is_active ? (
                            <Badge variant="default" className="bg-success-green-100 text-success-green-800 border-success-green-200 shadow-sm">
                              <CheckCircle className="h-3 w-3 mr-1.5" />
                              Aktywny
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="shadow-sm">
                              <XCircle className="h-3 w-3 mr-1.5" />
                              Wygasły
                            </Badge>
                          )}
                          
                          {product.is_active && (
                            <Link href={getProductLink(product.slug)} className="w-full sm:w-auto">
                              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 group">
                                Przejdź do produktu
                                <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders History Section */}
        <div className="animate-in slide-in-from-right-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span>Historia transakcji</span>
              </CardTitle>
              <CardDescription>
                Wszystkie twoje zakupy i transakcje
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-transparent to-muted/20 rounded-full blur-2xl"></div>
                    <div className="relative p-6 bg-muted/10 rounded-full inline-block">
                      <CreditCard className="h-12 w-12 text-muted-foreground/60" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Brak historii zakupów</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Twoje przyszłe zakupy będą tutaj widoczne
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div 
                      key={order.id} 
                      className="group border border-border/50 rounded-2xl p-6 bg-gradient-to-br from-card via-card to-card/50 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slide-in-from-right 0.5s ease-out forwards'
                      }}
                    >
                      <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">
                                {order.products?.name || 'Nieznany produkt'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Zamówienie #{order.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(order.created_at)}</span>
                            </div>
                            {order.expires_at && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Dostęp do: {formatDate(order.expires_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3 sm:min-w-[140px]">
                          {getStatusBadge(order.status)}
                          <div className="text-right">
                            <p className="font-bold text-lg text-success-green-600">
                              {formatPrice(order.price_cents, order.currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 