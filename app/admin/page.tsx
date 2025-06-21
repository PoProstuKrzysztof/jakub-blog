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
  UserCheck,
  Briefcase,
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
      color: "from-primary to-primary",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      title: "Szkice",
      value: adminStats.draftPosts.toString(),
      change: "+2", // Mock change for now
      icon: Edit,
      color: "from-primary to-primary", 
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      title: "Średnie wyświetlenia",
      value: formatNumber(adminStats.averageViews),
      change: "+8%", // Mock change for now
      icon: TrendingUp,
      color: "from-primary to-primary",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
  ] : []

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-xl">Opublikowany</Badge>
      case "draft":
        return <Badge variant="secondary" className="rounded-xl">Szkic</Badge>
      case "scheduled":
        return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-xl">Zaplanowany</Badge>
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
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 sm:py-12 lg:py-16 xl:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight px-2">
                Zarządzaj swoją <span className="text-primary">treścią</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 sm:px-0 sm:text-xl">
                Profesjonalny panel administracyjny do zarządzania postami, analizami i treścią na Twoim blogu finansowym
              </p>
            </div>

            <div className="flex flex-col gap-3 justify-center px-4 sm:flex-row sm:gap-4 sm:px-0">
              <Link href="/admin/nowy-post">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Nowy post
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-2 border-border hover:border-primary px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-primary/5 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  <BarChart3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 lg:py-16">
        {/* Statistics Cards */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4 px-4">
              Przegląd statystyk
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
              Kluczowe metryki wydajności Twojego bloga
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-6 mx-3 sm:mx-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Błąd podczas ładowania danych: {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mb-12">
            {loading ? (
              // Loading skeleton for stats
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-200 animate-pulse"></div>
                      <div className="w-10 h-5 sm:w-12 sm:h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-16 sm:w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardContent className="p-4 sm:p-6 relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                      </div>
                      <Badge 
                        className={`text-xs ${stat.change.startsWith('+') ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'} rounded-lg`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
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
            <CardHeader className="border-b border-border/50 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start lg:items-center">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground flex items-center">
                    <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary flex-shrink-0" />
                    <span className="truncate">Zarządzanie postami</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Przeglądaj, edytuj i zarządzaj swoimi postami
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <Link href="/admin/analytics">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-2 border-border hover:border-primary hover:bg-primary/5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 sm:px-4 sm:text-sm lg:px-6 lg:py-2.5 lg:text-base"
                    >
                      <BarChart3 className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Analytics</span>
                    </Button>
                  </Link>
                  <Link href="/admin/nowy-post">
                    <Button 
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-3 py-2 text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 sm:px-4 sm:text-sm lg:px-6 lg:py-2.5 lg:text-base"
                    >
                      <Plus className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Nowy post</span>
                      <span className="sm:hidden">Nowy</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6">
              {/* Search */}
              <div className="mb-6 sm:mb-8">
                <div className="relative w-full sm:max-w-md">
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
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <span className="ml-2 text-sm sm:text-base text-muted-foreground">Ładowanie postów...</span>
                </div>
              )}

              {/* Posts List */}
              {!loading && (
                <div className="space-y-3 sm:space-y-4">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex flex-col p-3 bg-card/50 hover:bg-card/80 rounded-xl border border-border/50 hover:border-border transition-all duration-300 transform hover:scale-[1.01] sm:flex-row sm:items-center sm:p-4 lg:p-6"
                    >
                      <div className="flex items-start space-x-3 flex-1 min-w-0 sm:items-center sm:space-x-4">
                        {/* Thumbnail */}
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md sm:h-14 sm:w-20 lg:h-16 lg:w-24">
                          <Image 
                            src={getMainImage(post)} 
                            alt={post.title || "Post image"} 
                            fill 
                            className="object-cover" 
                          />
                        </div>

                        {/* Post Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:gap-3">
                            <h3 className="text-sm font-semibold text-foreground line-clamp-2 sm:text-base sm:line-clamp-1 lg:text-lg">
                              {post.title}
                            </h3>
                            {getStatusBadge(post.status || 'draft')}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3 sm:text-sm">
                            <span className="flex items-center flex-shrink-0">
                              <Calendar className="h-3 w-3 mr-1 sm:h-4 sm:w-4" />
                              <span className="truncate">
                                {formatDate(post.published_at)}
                              </span>
                            </span>
                            <span className="flex items-center flex-shrink-0">
                              <Eye className="h-3 w-3 mr-1 sm:h-4 sm:w-4" />
                              {post.view_count || 0}
                              <span className="hidden sm:inline ml-1">wyświetleń</span>
                            </span>
                            <Badge variant="secondary" className="rounded-lg text-xs truncate max-w-[120px] sm:max-w-none">
                              {getCategoryName(post)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-1 mt-3 pt-3 border-t border-border/30 sm:mt-0 sm:pt-0 sm:border-t-0 sm:ml-4 sm:space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPost(post)}
                          className="rounded-lg hover:bg-primary/5 hover:border-primary transition-all duration-300 p-2"
                          title="Edytuj post"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg hover:bg-muted hover:border-border hover:text-muted-foreground transition-all duration-300 p-2"
                          title="Podgląd posta"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePost(post)}
                          className="rounded-lg hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all duration-300 p-2"
                          title="Usuń post"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Brak postów</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 px-4">
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
        <section className="mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4 px-4">
              Szybkie akcje
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
              Najczęściej używane funkcje w panelu administracyjnym
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {[
              {
                icon: Plus,
                title: "Nowy post",
                description: "Utwórz nową analizę lub artykuł edukacyjny",
                href: "/admin/nowy-post",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-primary/10",
                iconColor: "text-primary"
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Przegląd statystyk i analityki bloga",
                href: "/admin/analytics",
                color: "from-green-500 to-green-600",
                bgColor: "bg-primary/10",
                iconColor: "text-primary"
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
                color: "from-primary to-primary",
                bgColor: "bg-primary/10",
                iconColor: "text-primary"
              },
              {
                icon: UserCheck,
                title: "Zarządzanie dostępami",
                description: "Przypisuj dostęp do portfela użytkownikom",
                href: "/admin/dostepy",
                color: "from-indigo-500 to-indigo-600",
                bgColor: "bg-indigo-50",
                iconColor: "text-indigo-600"
              },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                  <CardContent className="p-6 text-center sm:p-8">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${action.iconColor}`} />
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">{action.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{action.description}</p>
                    <div className="flex items-center justify-center text-primary font-medium text-sm sm:text-base">
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
        <DialogContent className="rounded-xl w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Potwierdź usunięcie</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Czy na pewno chcesz usunąć post "{selectedPost?.title}"? Ta akcja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteModalOpen(false)} 
              className="rounded-xl w-full sm:w-auto order-2 sm:order-1"
              disabled={isDeleting}
            >
              Anuluj
            </Button>
            <Button 
              onClick={confirmDelete} 
              variant="destructive" 
              className="rounded-xl w-full sm:w-auto order-1 sm:order-2"
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
        <DialogContent className="rounded-xl w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edytuj post</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Wprowadź zmiany w wybranym poście
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Tytuł</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-xl mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-sm font-medium">Kategoria</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="rounded-xl mt-1">
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
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setEditModalOpen(false)} 
              className="rounded-xl w-full sm:w-auto order-2 sm:order-1"
              disabled={isUpdating}
            >
              Anuluj
            </Button>
            <Button 
              onClick={saveEdit} 
              className="rounded-xl w-full sm:w-auto order-1 sm:order-2"
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