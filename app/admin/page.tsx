"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/common/site-header"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Shield,
  CheckCircle,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAdminPosts } from "@/hooks/use-admin-posts"
import { useAuth } from "@/hooks/use-auth"
import { PostFull } from "@/lib/models/post"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/supabase"

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Nie opublikowano"
  return new Date(dateString).toLocaleDateString("pl-PL")
}

const getCategoryName = (post: PostFull): string => {
  if (post.post_categories && post.post_categories.length > 0) {
    return post.post_categories[0].categories.name
  }
  return "Bez kategorii"
}

const getMainImage = (post: PostFull): string => {
  if (post.featured_image_url) {
    return post.featured_image_url
  }
  if (post.post_attachments && post.post_attachments.length > 0) {
    const imageAttachment = post.post_attachments.find(
      att => att.attachments.mime_type?.startsWith('image/')
    )
    if (imageAttachment?.attachments.public_url) {
      return imageAttachment.attachments.public_url
    }
  }
  return "/placeholder.svg?height=100&width=150"
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostFull | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Check authorization before loading data
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/login?redirectTo=/admin')
        return
      }
      
      // Check if user is admin or author by checking profile in database
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
      
      if (error) {
        console.error('Error fetching user profile:', error)
        router.push('/')
        return
      }
      
      console.log('User profile role:', profile?.role)
      
      if (profile?.role !== 'admin' && profile?.role !== 'author') {
        console.log('User not authorized for admin panel')
        router.push('/')
        return
      }
      
      console.log('User authorized for admin panel')
    } catch (error) {
      console.error('Error checking user role:', error)
      router.push('/')
    }
  }

  // Use custom hook for data management only if authorized
  const {
    posts,
    stats: adminStats,
    loading,
    error,
    deletePost,
    updatePost,
    refreshPosts
  } = useAdminPosts()

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

  // Create stats array from adminStats
  const stats = adminStats ? [
    {
      title: "Łączne wyświetlenia",
      value: formatNumber(adminStats.totalViews),
      change: "+12%", // Mock change for now
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Opublikowane posty",
      value: adminStats.publishedPosts.toString(),
      change: "+3", // Mock change for now
      icon: FileText,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Szkice",
      value: adminStats.draftPosts.toString(),
      change: "+2", // Mock change for now
      icon: Edit,
      color: "from-orange-500 to-orange-600", 
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      title: "Średnie wyświetlenia",
      value: formatNumber(adminStats.averageViews),
      change: "+8%", // Mock change for now
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
  ] : []

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 rounded-xl">Opublikowany</Badge>
      case "draft":
        return <Badge variant="secondary" className="rounded-xl">Szkic</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 rounded-xl">Zaplanowany</Badge>
      case "archived":
        return <Badge variant="outline" className="rounded-xl">Zarchiwizowany</Badge>
      default:
        return <Badge variant="outline" className="rounded-xl">Nieznany</Badge>
    }
  }

  const handleDeletePost = (post: PostFull) => {
    setSelectedPost(post)
    setDeleteModalOpen(true)
  }

  const handleEditPost = (post: PostFull) => {
    setSelectedPost(post)
    setEditTitle(post.title || "")
    setEditCategory(getCategoryName(post))
    setEditModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPost) return
    
    setIsDeleting(true)
    try {
      const success = await deletePost(selectedPost.id)
      if (success) {
        setDeleteModalOpen(false)
        setSelectedPost(null)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const saveEdit = async () => {
    if (!selectedPost) return
    
    setIsUpdating(true)
    try {
      const success = await updatePost(selectedPost.id, {
        title: editTitle
      })
      if (success) {
        setEditModalOpen(false)
        setSelectedPost(null)
      }
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="admin"
        adminMode={true}
        showSearch={false}
        searchPlaceholder="Szukaj w panelu..."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Zarządzaj swoją <span className="text-primary">treścią</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Profesjonalny panel administracyjny do zarządzania postami, analizami i treścią na Twoim blogu finansowym
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin/nowy-post">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Nowy post
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-border hover:border-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-primary/5"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Statistics Cards */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Przegląd statystyk
            </h2>
            <p className="text-xl text-muted-foreground">
              Kluczowe metryki wydajności Twojego bloga
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Błąd podczas ładowania danych: {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
              // Loading skeleton for stats
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse"></div>
                      <div className="w-12 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                      <Badge 
                        className={`${stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-lg`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Posts Management */}
        <section>
          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
            <CardHeader className="border-b border-border/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                    <FileText className="mr-2 h-6 w-6 text-primary" />
                    Zarządzanie postami
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Przeglądaj, edytuj i zarządzaj swoimi postami
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/admin/analytics">
                    <Button 
                      variant="outline"
                      className="border-2 border-border hover:border-primary hover:bg-primary/5 rounded-xl px-6 py-2.5 font-medium transition-all duration-300"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  <Link href="/admin/nowy-post">
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nowy post
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Search */}
              <div className="mb-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Szukaj postów..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Ładowanie postów...</span>
                </div>
              )}

              {/* Posts List */}
              {!loading && (
                <div className="space-y-4">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-6 bg-card/50 hover:bg-card/80 rounded-xl border border-border/50 hover:border-border transition-all duration-300 transform hover:scale-[1.01]"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Thumbnail */}
                        <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                          <Image 
                            src={getMainImage(post)} 
                            alt={post.title || "Post image"} 
                            fill 
                            className="object-cover" 
                          />
                        </div>

                        {/* Post Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground truncate">
                              {post.title}
                            </h3>
                            {getStatusBadge(post.status || 'draft')}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.view_count || 0} wyświetleń
                            </span>
                            <Badge variant="secondary" className="rounded-lg">
                              {getCategoryName(post)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPost(post)}
                        className="rounded-lg hover:bg-primary/5 hover:border-primary transition-all duration-300"
                        title="Edytuj post"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
                        title="Podgląd posta"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePost(post)}
                        className="rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300"
                        title="Usuń post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              )}

              {!loading && filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Brak postów</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? "Nie znaleziono postów spełniających kryteria wyszukiwania" : "Nie masz jeszcze żadnych postów"}
                  </p>
                  <Link href="/admin/nowy-post">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Utwórz pierwszy post
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Szybkie akcje
            </h2>
            <p className="text-xl text-muted-foreground">
              Najczęściej używane funkcje w panelu administracyjnym
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Plus,
                title: "Nowy post",
                description: "Utwórz nową analizę lub artykuł edukacyjny",
                href: "/admin/nowy-post",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600"
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Przegląd statystyk i analityki bloga",
                href: "/admin/analytics",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                iconColor: "text-green-600"
              },
              {
                icon: MessageCircle,
                title: "Wiadomości",
                description: "Sprawdź wiadomości od czytelników",
                href: "/kontakt",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                iconColor: "text-purple-600"
              },
              {
                icon: Star,
                title: "Portfel autora",
                description: "Zarządzaj portfelem i publikuj analizy",
                href: "/admin/portfel",
                color: "from-yellow-500 to-yellow-600",
                bgColor: "bg-yellow-50",
                iconColor: "text-yellow-600"
              },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{action.title}</h3>
                    <p className="text-muted-foreground mb-6">{action.description}</p>
                    <div className="flex items-center justify-center text-primary font-medium">
                      Przejdź
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć post "{selectedPost?.title}"? Ta akcja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteModalOpen(false)} 
              className="rounded-xl"
              disabled={isDeleting}
            >
              Anuluj
            </Button>
            <Button 
              onClick={confirmDelete} 
              variant="destructive" 
              className="rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Edytuj post</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany w wybranym poście
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Tytuł</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="category">Kategoria</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analiza spółek">Analiza spółek</SelectItem>
                  <SelectItem value="Kryptowaluty">Kryptowaluty</SelectItem>
                  <SelectItem value="Edukacja">Edukacja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditModalOpen(false)} 
              className="rounded-xl"
              disabled={isUpdating}
            >
              Anuluj
            </Button>
            <Button 
              onClick={saveEdit} 
              className="rounded-xl"
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}