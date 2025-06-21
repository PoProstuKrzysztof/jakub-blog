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
  Euro
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
    grantAccess, 
    revokeAccess,
    searchUsers 
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
  const [selectedUser, setSelectedUser] = useState<UserWithAccess | null>(null)
  const [grantAccessModalOpen, setGrantAccessModalOpen] = useState(false)
  const [accessDuration, setAccessDuration] = useState("30") // days
  const [isGrantingAccess, setIsGrantingAccess] = useState(false)
  
  // Product access management states
  const [productAccessModalOpen, setProductAccessModalOpen] = useState(false)
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

  const handleGrantAccess = (user: UserWithAccess) => {
    setSelectedUser(user)
    setGrantAccessModalOpen(true)
  }

  const handleRevokeAccess = async (user: UserWithAccess) => {
    if (confirm(`Czy na pewno chcesz odebrać dostęp do portfela użytkownikowi ${user.email}?`)) {
      try {
        const result = await revokeAccess(user.id)
        if (!result.success) {
          console.error('Failed to revoke access:', result.error)
        }
      } catch (error) {
        console.error('Error revoking access:', error)
      }
    }
  }

  const confirmGrantAccess = async () => {
    if (!selectedUser) return
    
    setIsGrantingAccess(true)
    try {
      const result = await grantAccess(selectedUser.id, parseInt(accessDuration))
      
      if (result.success) {
        setGrantAccessModalOpen(false)
        setSelectedUser(null)
      } else {
        // Handle error from hook
        console.error('Failed to grant access:', result.error)
      }
    } catch (error) {
      console.error('Error granting access:', error)
    } finally {
      setIsGrantingAccess(false)
    }
  }

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
          // Refresh users to see updated data
          window.location.reload()
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
        // Refresh users to see updated data
        window.location.reload()
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
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Opłacone</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Oczekuje</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Anulowane</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
              <Package className="h-4 w-4 text-primary" />
              Zakupione produkty ({userProducts.length})
            </div>
            <div className="grid gap-2">
              {userProducts.map((product) => {
                const matchingProduct = products.find(p => p.slug === product.product_slug)
                return (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{product.product_name}</span>
                        {getStatusBadge(product.status)}
                        {product.expires_at && isProductExpired(product.expires_at) && (
                          <Badge variant="destructive" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Wygasł
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(product.created_at)}
                        </span>
                        {product.expires_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Wygasa: {formatDate(product.expires_at)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Euro className="h-3 w-3" />
                          {formatPrice(product.price_cents, product.currency)}
                        </span>
                      </div>
                    </div>
                    {matchingProduct && product.status === 'paid' && !isProductExpired(product.expires_at) && (
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevokeProductAccess(user, matchingProduct)}
                          className="border-red-300 text-red-700 hover:bg-red-50 text-xs px-2 py-1"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Odbierz
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Available products to grant access */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShoppingBag className="h-4 w-4 text-primary" />
            Dostępne produkty do przyznania
          </div>
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
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm truncate">{product.name}</span>
                    <Badge variant="secondary" className="text-xs bg-gray-800 text-white hover:bg-gray-700">
                      {formatPrice(product.price_cents, product.currency)}
                    </Badge>
                  </div>
                  {product.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => handleGrantProductAccess(user, product)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg active:scale-95"
                  >
                    <UserCheck className="h-3 w-3 mr-1 transition-transform duration-200" />
                    Przyznaj
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {products.filter(product => 
            product.is_active && 
            !userProducts.some(userProduct => 
              userProduct.product_slug === product.slug && 
              userProduct.status === 'paid' && 
              !isProductExpired(userProduct.expires_at)
            )
          ).length === 0 && (
            <div className="text-sm text-muted-foreground italic flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Użytkownik ma dostęp do wszystkich aktywnych produktów
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Powrót do panelu
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <UserCheck className="h-8 w-8 text-primary" />
              Zarządzanie dostępami
            </h1>
            <p className="text-muted-foreground text-lg">
              Przypisuj i zarządzaj dostępem użytkowników do portfela autora oraz przeglądaj ich zakupy
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Wszyscy użytkownicy</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Z dostępem do portfela</p>
                    <p className="text-2xl font-bold">{stats.usersWithAccess}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Aktywni użytkownicy</p>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Nowi (30 dni)</p>
                    <p className="text-2xl font-bold">{stats.recentUsers}</p>
                  </div>
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
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Użytkownicy systemu
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Przeglądaj użytkowników, ich zakupy i zarządzaj dostępami do portfela
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
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
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Ładowanie użytkowników...</span>
                </div>
              )}

              {/* Users List */}
              {!loading && (
                <div className="space-y-6">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-6 bg-card/50 hover:bg-card/80 rounded-xl border border-border/50 hover:border-border transition-all duration-300"
                    >
                      {/* User Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {user.full_name || user.username || 'Bez nazwy'}
                            </h3>
                            {getRoleBadge(user.role)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {user.email}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Zarejestrowany: {formatDate(user.created_at)}
                            </span>
                            {user.last_sign_in_at && (
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Ostatnie logowanie: {formatDate(user.last_sign_in_at)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!user.hasPortfolioAccess && (
                            <Button
                              size="sm"
                              onClick={() => handleGrantAccess(user)}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                              title="Przyznaj dostęp do portfela"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Przyznaj dostęp
                            </Button>
                          )}
                          {user.hasPortfolioAccess && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRevokeAccess(user)}
                              className="border-red-300 text-red-700 hover:bg-red-50 rounded-lg"
                              title="Odbierz dostęp do portfela"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Odbierz dostęp
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* User Products */}
                      <div className="border-t border-border/50 pt-4">
                        {renderUserProducts(user.purchasedProducts, user)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Brak użytkowników</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Nie znaleziono użytkowników spełniających kryteria wyszukiwania" : "Nie ma jeszcze żadnych zarejestrowanych użytkowników"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Grant Access Modal */}
      <Dialog open={grantAccessModalOpen} onOpenChange={setGrantAccessModalOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Przyznaj dostęp do portfela</DialogTitle>
            <DialogDescription>
              Przyznaj użytkownikowi <strong>{selectedUser?.email}</strong> dostęp do portfela autora
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Czas dostępu (dni)</Label>
              <Select value={accessDuration} onValueChange={setAccessDuration}>
                <SelectTrigger className="rounded-xl">
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
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setGrantAccessModalOpen(false)} 
              className="rounded-xl"
              disabled={isGrantingAccess}
            >
              Anuluj
            </Button>
            <Button 
              onClick={confirmGrantAccess} 
              className="rounded-xl"
              disabled={isGrantingAccess}
            >
              {isGrantingAccess && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Przyznaj dostęp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grant Product Access Modal */}
      <Dialog open={productAccessModalOpen} onOpenChange={setProductAccessModalOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Przyznaj dostęp do produktu</DialogTitle>
            <DialogDescription>
              Przyznaj użytkownikowi <strong>{selectedUser?.email}</strong> dostęp do produktu <strong>{selectedProduct?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProduct && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">{selectedProduct.name}</h4>
                {selectedProduct.description && (
                  <p className="text-sm text-muted-foreground mb-2">{selectedProduct.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {formatPrice(selectedProduct.price_cents, selectedProduct.currency)}
                  </Badge>
                  <Badge variant="outline">{selectedProduct.slug}</Badge>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="productDuration">Czas dostępu (dni)</Label>
              <Select value={productAccessDuration} onValueChange={setProductAccessDuration}>
                <SelectTrigger className="rounded-xl">
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
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setProductAccessModalOpen(false)} 
              className="rounded-xl"
              disabled={isGrantingProductAccess}
            >
              Anuluj
            </Button>
            <Button 
              onClick={confirmGrantProductAccess} 
              className="rounded-xl"
              disabled={isGrantingProductAccess}
            >
              {isGrantingProductAccess && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Przyznaj dostęp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 