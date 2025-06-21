"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SiteHeader } from '@/components/common/site-header'
import { Loader2, Package, CreditCard, CalendarDays, CheckCircle, XCircle, Clock, ShoppingCart, ArrowRight, Target, BarChart3, BookOpen, Layers, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { isValidCooperationProductId, getProductByCooperationId } from '@/lib/utils/product-mapping'
import { HighlightedProductBanner } from '@/components/panel/highlighted-product-banner'

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

interface AvailableProduct {
  id: number
  title: string
  description: string
  price: string
  originalPrice?: string
  priceNote: string
  features: string[]
  type: 'jednorazowa' | 'subskrypcja'
  ctaText: string
  badge?: string
  icon: string
}

export default function UserPanelPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [userProducts, setUserProducts] = useState<UserProduct[]>([])
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buttonWidth, setButtonWidth] = useState<string>('min-w-[250px]')
  const [activeTab, setActiveTab] = useState<string>('products')
  const [highlightedProduct, setHighlightedProduct] = useState<{id: number, title: string} | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle URL parameters for tab selection and product highlighting
  useEffect(() => {
    const tab = searchParams.get('tab')
    const productId = searchParams.get('product')
    
    if (tab && ['products', 'available', 'orders'].includes(tab)) {
      setActiveTab(tab)
    }
    
    // If product ID is specified, switch to available products tab
    if (productId) {
      const productIdNum = parseInt(productId, 10)
      
      // Sprawdź czy ID produktu jest poprawne
      if (isValidCooperationProductId(productIdNum)) {
        setActiveTab('available')
        
        // Ustaw podświetlony produkt
        const productInfo = getProductByCooperationId(productIdNum)
        if (productInfo) {
          setHighlightedProduct({
            id: productIdNum,
            title: productInfo.title
          })
        }
        
        // Scroll to highlighted product after a short delay to ensure tab content is rendered
        setTimeout(() => {
          const productElement = document.querySelector(`[data-product-id="${productId}"]`)
          if (productElement) {
            productElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }, 300)
      } else {
        console.warn(`Invalid product ID in URL: ${productId}`)
        // Usuń niepoprawny parametr z URL
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('product')
        window.history.replaceState({}, '', newUrl.toString())
      }
    }
  }, [searchParams])

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

        // Load available products and filter out purchased ones
        loadAvailableProducts(activeProducts)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania danych')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Load available products from cooperation page data
  const loadAvailableProducts = (purchasedProducts: UserProduct[]) => {
    const jednorazoweServices: AvailableProduct[] = [
      {
        id: 2,
        title: "Konsultacja Majątkowa-Edukacyjna",
        description: "Inwestowanie bywa wyzwaniem, zwłaszcza gdy zaczynasz przygodę z rynkami. Ta konsultacja pomoże Ci zrozumieć zasady gry i pewniej budować własny portfel.",
        price: "899 zł",
        priceNote: "jednorazowo",
        type: "jednorazowa",
        ctaText: "Zarezerwuj konsultację",
        badge: "NAJLEPSZA WARTOŚĆ",
        features: [
          "Analiza profilu inwestycyjnego - poznaj swoje podejście do ryzyka",
          "Modelowe portfele dopasowane do Twojej strategii",
          "Konkretne przykłady funduszy ETF i papierów wartościowych",
          "Pakiet informacji 'krok po kroku' - jak założyć konto maklerskie",
          "Materiały edukacyjne: e-booki, prezentacje, poradniki wideo",
          "Instrukcje dotyczące prowizji i platform inwestycyjnych",
        ],
        icon: "Target",
      },
      {
        id: 5,
        title: "Pakiet Biedny Student",
        description: "Młody inwestor z ograniczonym budżetem, ale ogromnymi ambicjami? Ten pakiet to kompleksowy zestaw wszystkich kluczowych usług w jednym - za ułamek ceny.",
        price: "2500 zł",
        originalPrice: "3500 zł",
        priceNote: "jednorazowo - oszczędzasz 30%",
        type: "jednorazowa",
        ctaText: "Kup pakiet",
        badge: "NAJLEPSZA OFERTA",
        features: [
          "Indywidualna konsultacja finansowa (wartość 899 zł)",
          "Roczny dostęp do mojego portfela inwestycyjnego (wartość 1400 zł)",
          "Roczne wsparcie strategiczne (wartość 900 zł)",
          "Prenumerata raportów kwartalnych na rok (wartość 150 zł)",
          "Pakiet edukacyjny na start (wartość 100 zł)",
        ],
        icon: "GraduationCap",
      },
      {
        id: 3,
        title: "Pakiet Startowy",
        description: "Podstawowa wiedza inwestycyjna w przystępnej cenie. Idealne dla osób, które chcą zacząć, ale nie są gotowe na pełną konsultację.",
        price: "300 zł",
        priceNote: "jednorazowo",
        type: "jednorazowa",
        ctaText: "Rozpocznij naukę",
        features: [
          "Podstawy inwestowania - e-book 50+ stron",
          "Poradnik wyboru pierwszych inwestycji",
          "Lista rekomendowanych brokerów i platform",
          "Kalkulator ryzyka inwestycyjnego",
          "Dostęp do webinarium grupowego (2h)",
        ],
        icon: "BookOpen",
      },
      {
        id: 4,
        title: "Dostęp do modeli",
        description: "Gotowy zestaw autorskich modeli inwestycyjnych – stworzonych na bazie doświadczenia i przetestowanych w praktyce.",
        price: "300 zł",
        priceNote: "jednorazowo",
        type: "jednorazowa",
        ctaText: "Zakup dostęp",
        features: [
          "Zestaw modeli portfeli - różne podejścia inwestycyjne",
          "Gotowe struktury alokacji aktywów",
          "Praktyczne szablony do organizacji własnego podejścia",
          "Materiały w formie plików do analizy we własnym tempie",
          "Uniwersalne modele edukacyjne jako punkt wyjścia do nauki",
        ],
        icon: "Layers",
      },
    ]

    const subskrypcyjneServices: AvailableProduct[] = [
      {
        id: 1,
        title: "Wsparcie Inwestycyjne",
        description: "Dla tych, którzy chcą mieć pewność, że ich inwestycje są na właściwej ścieżce. Regularne monitorowanie, raporty kwartalne i wsparcie przy zmianach strategii.",
        price: "297 zł",
        priceNote: "miesięcznie",
        type: "subskrypcja",
        ctaText: "Rozpocznij subskrypcję",
        badge: "NAJLEPSZA WARTOŚĆ",
        features: [
          "Monitorowanie portfela - śledzenie wyników Twoich inwestycji",
          "Raporty kwartalne z analizą osiągnięć i wykresami",
          "Wsparcie przy modyfikacjach portfela",
          "Pomoc podatkowa - rozliczenie zysków kapitałowych (PIT-38)",
          "Priorytetowy kontakt mailowy/telefoniczny",
          "Dostęp do ekskluzywnych materiałów edukacyjnych",
        ],
        icon: "BarChart3",
      },
    ]

    // Combine all products
    const allProducts = [...jednorazoweServices, ...subskrypcyjneServices]

    // Filter out purchased products (basic matching by title similarity)
    const purchasedTitles = purchasedProducts.map(p => p.name.toLowerCase())
    const available = allProducts.filter(product => {
      const productTitle = product.title.toLowerCase()
      return !purchasedTitles.some(purchased => 
        purchased.includes('konsultacja') && productTitle.includes('konsultacja') ||
        purchased.includes('student') && productTitle.includes('student') ||
        purchased.includes('startowy') && productTitle.includes('startowy') ||
        purchased.includes('model') && productTitle.includes('model') ||
        purchased.includes('wsparcie') && productTitle.includes('wsparcie') ||
        purchased.includes('portfolio') && productTitle.includes('portfolio')
      )
    })

    setAvailableProducts(available)
  }

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
          <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
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

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="h-8 w-8 text-primary" />
      case 'BarChart3':
        return <BarChart3 className="h-8 w-8 text-primary" />
      case 'BookOpen':
        return <BookOpen className="h-8 w-8 text-primary" />
      case 'Layers':
        return <Layers className="h-8 w-8 text-primary" />
      case 'GraduationCap':
        return <GraduationCap className="h-8 w-8 text-primary" />
      default:
        return <Package className="h-8 w-8 text-primary" />
    }
  }

  const handlePurchaseClick = () => {
    router.push('/wspolpraca')
  }

  const handleDismissHighlight = () => {
    setHighlightedProduct(null)
    // Usuń parametr z URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('product')
    window.history.replaceState({}, '', newUrl.toString())
  }

  // Calculate button width based on longest text
  const calculateButtonWidth = () => {
    const buttonTexts = [
      'Zobacz produkty',
      'Przejdź do produktu',
      'Sprawdź aktualne oferty',
      ...availableProducts.map(p => p.ctaText)
    ]

    // Calculate approximate width based on character count
    // Using rough estimate: 1 character ≈ 8px + padding/margins
    const maxLength = Math.max(...buttonTexts.map(text => text.length))
    const baseWidth = maxLength * 8 + 60 // 60px for padding, margins, icons
    const roundedWidth = Math.ceil(baseWidth / 10) * 10 // Round to nearest 10
    
    return `min-w-[${Math.max(roundedWidth, 180)}px]` // Minimum 180px
  }

  // Update button width when available products change
  useEffect(() => {
    if (availableProducts.length > 0) {
      setButtonWidth(calculateButtonWidth())
    }
  }, [availableProducts])

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Moje produkty
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Produkty
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
                      <Button className={buttonWidth}>Zobacz produkty</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            {product.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                Zakupiono: {formatDate(product.purchased_at)}
                              </span>
                              {product.expires_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Wygasa: {formatDate(product.expires_at)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            {product.is_active ? (
                              <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Aktywny
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="h-3 w-3 mr-1" />
                                Wygasły
                              </Badge>
                            )}
                            {product.is_active && (
                              <Link href={getProductLink(product.slug)}>
                                <Button size="sm" className={buttonWidth}>
                                  Przejdź do produktu
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
          </TabsContent>

          {/* Available Products Tab */}
          <TabsContent value="available" className="space-y-4">
            {/* Banner dla podświetlonego produktu */}
            {highlightedProduct && (
              <HighlightedProductBanner
                productTitle={highlightedProduct.title}
                onDismiss={handleDismissHighlight}
              />
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Dostępne produkty</CardTitle>
                <CardDescription>
                  Produkty które możesz zakupić aby rozszerzyć swoje możliwości inwestycyjne
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-lg text-foreground mb-2">Wszystkie produkty już zakupione!</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Gratulacje! Masz dostęp do wszystkich naszych produktów edukacyjnych
                    </p>
                    <Link href="/wspolpraca">
                      <Button variant="outline" className={buttonWidth}>Sprawdź aktualne oferty</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {availableProducts.map((product) => {
                      const isHighlighted = highlightedProduct?.id === product.id
                      return (
                        <div 
                          key={product.id}
                          data-product-id={product.id}
                          className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-300 ${
                            isHighlighted ? 'border-primary bg-primary/5 shadow-lg' : ''
                          }`}
                        >
                          <div className="grid grid-cols-2 gap-6">
                          {/* Lewa sekcja - Informacje o produkcie */}
                          <div className="flex gap-4">
                            {/* Ikona produktu */}
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getProductIcon(product.icon)}
                            </div>
                            
                            {/* Informacje o produkcie */}
                            <div className="flex-1 space-y-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-semibold">{product.title}</h3>
                                  {isHighlighted && (
                                    <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                                      Wybrane
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {product.description}
                                </p>
                              </div>
                              
                              {/* Features */}
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">Co otrzymasz:</p>
                                <div className="grid gap-1">
                                  {product.features.slice(0, 3).map((feature, idx) => (
                                    <div key={idx} className="flex items-start text-xs text-muted-foreground">
                                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                  {product.features.length > 3 && (
                                    <p className="text-xs text-muted-foreground pl-5">
                                      ...i {product.features.length - 3} więcej funkcji
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Prawa sekcja - Cena i przycisk */}
                          <div className="flex flex-col justify-center items-center gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-foreground mb-2">
                                {product.price}
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-400 line-through ml-2">
                                    {product.originalPrice}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{product.priceNote}</div>
                              {product.type === 'subskrypcja' && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  • Można anulować w każdej chwili
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              onClick={handlePurchaseClick}
                              className={`${buttonWidth} group`}
                            >
                              {product.ctaText}
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                          </div>
                        </div>
                        </div>
                      )
                    })}
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
                               <CalendarDays className="h-3 w-3 mr-1" />
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