"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/common/site-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  UserCheck, 
  Loader2, 
  AlertCircle, 
  Users, 
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  ArrowLeft,
  Package,
  ShoppingBag,
  Clock,
  Euro,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/supabase"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { useProductManagement, type Product } from "@/hooks/use-product-management"
import type { UserWithAccess, UserOrder } from "@/lib/services/admin-user-service"

export default function AdminAccessManagementPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  // Use the custom hook for user management
  const { 
    users, 
    loading, 
    error, 
    stats, 
    searchUsers,
    fetchUsers
  } = useAdminUsers()
  
  // Use the product management hook
  const {
    products,
    loading: productsLoading,
    error: productsError,
    grantProductAccess,
    revokeProductAccess,
    refreshProducts
  } = useProductManagement()
  
  const [filteredUsers, setFilteredUsers] = useState<UserWithAccess[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())
  
  // Product access management states
  const [productAccessModalOpen, setProductAccessModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserWithAccess | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productAccessDuration, setProductAccessDuration] = useState("30")
  const [isGrantingProductAccess, setIsGrantingProductAccess] = useState(false)

  // Check authorization
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirectTo=/admin/dostepy')
        return
      }
      checkUserRole()
    }
  }, [user, authLoading, router])

  const checkUserRole = async () => {
    if (!user) return
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (error || !profile || !['admin', 'author'].includes(profile.role)) {
        router.push('/')
        return
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      router.push('/')
    }
  }

  // Users are automatically fetched by the hook

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users)
    } else {
      const filtered = searchUsers(searchTerm)
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users, searchUsers])

  const handleGrantProductAccess = (user: UserWithAccess, product: Product) => {
    setSelectedUser(user)
    setSelectedProduct(product)
    setProductAccessModalOpen(true)
  }

  const handleRevokeProductAccess = async (user: UserWithAccess, product: Product) => {
    if (confirm(`Czy na pewno chcesz odebrać dostęp do produktu "${product.name}" użytkownikowi ${user.email}?`)) {
      try {
        const result = await revokeProductAccess(user.id, product.id)
        if (result.success) {
          // Refresh users to see updated data without page reload
          await fetchUsers()
        } else {
          alert(result.error || 'Błąd podczas odbierania dostępu')
        }
      } catch (error) {
        console.error('Error revoking product access:', error)
        alert('Błąd podczas odbierania dostępu do produktu')
      }
    }
  }

  const confirmGrantProductAccess = async () => {
    if (!selectedUser || !selectedProduct) return
    
    setIsGrantingProductAccess(true)
    try {
      const result = await grantProductAccess(
        selectedUser.id, 
        selectedProduct.id, 
        parseInt(productAccessDuration)
      )
      
      if (result.success) {
        setProductAccessModalOpen(false)
        setSelectedUser(null)
        setSelectedProduct(null)
        // Refresh users to see updated data without page reload
        await fetchUsers()
      } else {
        alert(result.error || 'Błąd podczas przyznawania dostępu')
      }
    } catch (error) {
      console.error('Error granting product access:', error)
      alert('Błąd podczas przyznawania dostępu do produktu')
    } finally {
      setIsGrantingProductAccess(false)
    }
  }

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nigdy"
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (priceCents: number, currency: string) => {
    const price = priceCents / 100
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price)
  }

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>
      case 'author':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Autor</Badge>
      case 'user':
        return <Badge variant="secondary">Użytkownik</Badge>
      default:
        return <Badge variant="outline">Brak roli</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="text-xs text-white bg-gray-800">Opłacone</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-xs">Oczekuje</Badge>
      case 'cancelled':
        return <Badge variant="destructive" className="text-xs">Anulowane</Badge>
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
  }

  const isProductExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) <= new Date()
  }

  const renderUserProducts = (userProducts: UserOrder[], user: UserWithAccess) => {
    return (
      <div className="space-y-4">
        {/* Existing products */}
        {userProducts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Package className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">Zakupione produkty ({userProducts.length})</span>
            </div>
            <div className="grid gap-2">
              {userProducts.map((product) => {
                const matchingProduct = products.find(p => p.slug === product.product_slug)
                return (
                  <div 
                    key={product.id} 
                    className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:gap-2 sm:mb-1">
                        <span className="font-medium text-sm truncate">{product.product_name}</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(product.status)}
                          {product.expires_at && isProductExpired(product.expires_at) && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Wygasł
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">{formatDate(product.created_at)}</span>
                        </span>
                        {product.expires_at && (
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            <span className="truncate">Wygasa: {formatDate(product.expires_at)}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Euro className="h-3 w-3" />
                          {formatPrice(product.price_cents, product.currency)}
                        </span>
                      </div>
                    </div>
                    {product.status === 'paid' && !isProductExpired(product.expires_at) && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border/30 sm:pt-0 sm:border-t-0 sm:ml-4">
                        {matchingProduct && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRevokeProductAccess(user, matchingProduct)}
                            className="border-red-300 text-red-700 hover:bg-red-50 text-xs px-2 py-1 transition-all duration-200 hover:scale-105"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Odbierz
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Available products to grant access */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShoppingBag className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">Zarządzanie dostępami do produktów</span>
            </div>
          </div>
          
          {/* Products available to grant */}
          {products.filter(product => 
            product.is_active && 
            !userProducts.some(userProduct => 
              userProduct.product_slug === product.slug && 
              userProduct.status === 'paid' && 
              !isProductExpired(userProduct.expires_at)
            )
          ).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Dostępne do przyznania
              </h4>
              <div className="grid gap-2">
                {products.filter(product => 
                  product.is_active && 
                  !userProducts.some(userProduct => 
                    userProduct.product_slug === product.slug && 
                    userProduct.status === 'paid' && 
                    !isProductExpired(userProduct.expires_at)
                  )
                ).map((product) => (
                  <div 
                    key={product.id} 
                    className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-1 sm:flex-row sm:items-center sm:gap-2 sm:mb-1">
                        <span className="font-medium text-sm truncate">{product.name}</span>
                        <Badge variant="outline" className="text-xs w-fit">
                          {formatPrice(product.price_cents, product.currency)}
                        </Badge>
                      </div>
                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 sm:truncate">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border/30 sm:pt-0 sm:border-t-0 sm:ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleGrantProductAccess(user, product)}
                        className="text-xs px-3 py-1 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg active:scale-95"
                      >
                        <UserCheck className="h-3 w-3 mr-1 transition-transform duration-200" />
                        <span className="hidden sm:inline">Przyznaj dostęp</span>
                        <span className="sm:hidden">Przyznaj</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Show message if user has access to everything */}
          {products.filter(product => 
            product.is_active && 
            !userProducts.some(userProduct => 
              userProduct.product_slug === product.slug && 
              userProduct.status === 'paid' && 
              !isProductExpired(userProduct.expires_at)
            )
          ).length === 0 && (
            <div className="text-sm text-muted-foreground italic flex items-start gap-2 p-4 bg-muted/30 rounded-lg border border-border/50">
              <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span>Użytkownik ma dostęp do wszystkich dostępnych produktów i usług</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Sprawdzanie uprawnień...</span>
          </div>
        </div>
      </div>
    )
  }

  // Don't render content if not authorized
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="admin"
        adminMode={true}
        showSearch={false}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Powrót do panelu</span>
              <span className="sm:hidden">Powrót</span>
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <span className="truncate">Zarządzanie dostępami</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Przypisuj i zarządzaj dostępem użytkowników do portfela autora oraz przeglądaj ich zakupy
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4 sm:gap-6 sm:mb-8">
            <Card>
              <CardContent className="p-4 sm:p-6 flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Wszyscy</p>
                  <p className="text-lg sm:text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6 flex items-center">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Z dostępem</p>
                  <p className="text-lg sm:text-2xl font-bold">{stats.usersWithAccess}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6 flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Aktywni</p>
                  <p className="text-lg sm:text-2xl font-bold">{stats.activeUsers}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6 flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                  <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Nowi (30 dni)</p>
                  <p className="text-lg sm:text-2xl font-bold">{stats.recentUsers}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Users Management Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start lg:items-center">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <span className="truncate">Użytkownicy systemu</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Przeglądaj użytkowników, ich zakupy i zarządzaj dostępami do portfela
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Search */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Szukaj użytkowników..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <span className="ml-2 text-sm sm:text-base text-muted-foreground">Ładowanie użytkowników...</span>
                </div>
              )}

              {/* Users List */}
              {!loading && (
                <div className="space-y-4 sm:space-y-6">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 sm:p-6 bg-card/50 hover:bg-card/80 rounded-xl border border-border/50 hover:border-border transition-all duration-300"
                    >
                      {/* User Header */}
                      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:gap-3">
                            <h3 className="font-semibold text-foreground text-base sm:text-lg truncate">
                              {user.full_name || user.username || 'Bez nazwy'}
                            </h3>
                            {getRoleBadge(user.role)}
                          </div>
                          
                          <div className="space-y-2 sm:space-y-1">
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Zarejestrowany: {formatDate(user.created_at)}</span>
                              </span>
                              {user.last_sign_in_at && (
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                  <span className="truncate">Ostatnie: {formatDate(user.last_sign_in_at)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Products Section */}
                      <div className="border-t border-border/50 pt-4">
                        <button
                          onClick={() => toggleUserExpansion(user.id)}
                          className="flex items-center justify-between w-full p-3 bg-muted/20 hover:bg-muted/40 rounded-lg border border-border/30 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            {expandedUsers.has(user.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                            )}
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="font-medium text-foreground text-sm sm:text-base">
                                Produkty i dostępy
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {user.purchasedProducts.length} zakupionych
                            </Badge>
                          </div>
                        </button>
                        
                        {expandedUsers.has(user.id) && (
                          <div className="mt-4 pl-2 sm:pl-4 border-l-2 border-primary/20">
                            {renderUserProducts(user.purchasedProducts, user)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Brak użytkowników</h3>
                  <p className="text-sm sm:text-base text-muted-foreground px-4">
                    {searchTerm ? "Nie znaleziono użytkowników spełniających kryteria wyszukiwania" : "Nie ma jeszcze żadnych zarejestrowanych użytkowników"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Grant Product Access Modal */}
      <Dialog open={productAccessModalOpen} onOpenChange={setProductAccessModalOpen}>
        <DialogContent className="rounded-xl w-[95vw] max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Przyznaj dostęp do produktu</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Przyznaj użytkownikowi <strong className="break-all">{selectedUser?.email}</strong> dostęp do produktu <strong>{selectedProduct?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProduct && (
              <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2 truncate">{selectedProduct.name}</h4>
                {selectedProduct.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{selectedProduct.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {formatPrice(selectedProduct.price_cents, selectedProduct.currency)}
                  </Badge>
                  <Badge variant="outline" className="text-xs truncate max-w-[120px]">{selectedProduct.slug}</Badge>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="productDuration" className="text-sm font-medium">Czas dostępu (dni)</Label>
              <Select value={productAccessDuration} onValueChange={setProductAccessDuration}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dni</SelectItem>
                  <SelectItem value="30">30 dni (miesiąc)</SelectItem>
                  <SelectItem value="90">90 dni (3 miesiące)</SelectItem>
                  <SelectItem value="365">365 dni (rok)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setProductAccessModalOpen(false)} 
              className="rounded-xl w-full sm:w-auto order-2 sm:order-1"
              disabled={isGrantingProductAccess}
            >
              Anuluj
            </Button>
            <Button 
              onClick={confirmGrantProductAccess} 
              className="rounded-xl w-full sm:w-auto order-1 sm:order-2"
              disabled={isGrantingProductAccess}
            >
              {isGrantingProductAccess && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <span className="hidden sm:inline">Przyznaj dostęp</span>
              <span className="sm:hidden">Przyznaj</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 