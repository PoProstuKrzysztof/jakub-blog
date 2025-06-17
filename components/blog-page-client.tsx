"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { PostSkeleton } from "@/components/ui/post-skeleton"
import { SiteHeader } from "@/components/site-header"
import {
  CalendarDays,
  Eye,
  Search,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Star,
  Filter,
  Grid,
  List,
  Clock,
  User as UserIcon,
  Tag,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import { PinButton } from "@/components/pin-button"
import { useAuth } from "@/hooks/use-auth"
import type { User } from '@supabase/supabase-js'

interface BlogPageClientProps {
  initialPosts: PostFull[]
  user: User | null
}

export function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [posts, setPosts] = useState(initialPosts)
  const [isFiltering, setIsFiltering] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const handlePinToggle = (postId: string, isPinned: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, is_featured: isPinned }
          : post
      )
    )
  }

  const handleSearchChange = (value: string) => {
    setIsFiltering(true)
    setSearchTerm(value)
    setTimeout(() => setIsFiltering(false), 300)
  }

  const handleSortChange = (value: string) => {
    setIsFiltering(true)
    setSortBy(value)
    setTimeout(() => setIsFiltering(false), 200)
  }

  const handleCategoryChange = (value: string) => {
    setIsFiltering(true)
    setSelectedCategory(value)
    setTimeout(() => setIsFiltering(false), 200)
  }

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      const postCategories = post.post_categories?.map(pc => pc.categories.name) || []
      const matchesCategory = selectedCategory === "all" || postCategories.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1

      switch (sortBy) {
        case "date-desc":
          return new Date(b.published_at || b.created_at || '').getTime() - new Date(a.published_at || a.created_at || '').getTime()
        case "date-asc":
          return new Date(a.published_at || a.created_at || '').getTime() - new Date(b.published_at || b.created_at || '').getTime()
        case "views-desc":
          return (b.view_count || 0) - (a.view_count || 0)
        case "views-asc":
          return (a.view_count || 0) - (b.view_count || 0)
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchTerm, sortBy, selectedCategory])

  const categories = useMemo(() => {
    const allCategories = posts.flatMap(post => 
      post.post_categories?.map(pc => pc.categories.name) || []
    )
    return ["all", ...Array.from(new Set(allCategories))]
  }, [posts])

  const featuredPosts = filteredAndSortedPosts.filter(post => post.is_featured)
  const regularPosts = filteredAndSortedPosts.filter(post => !post.is_featured)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Brak daty'
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getMainCategory = (post: PostFull) => {
    return post.post_categories?.[0]?.categories?.name || 'Bez kategorii'
  }

  const getPostImage = (post: PostFull) => {
    return post.featured_image_url || "/images/default-post.svg"
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Analiza spółek': 'bg-blue-100 text-blue-800',
      'Kryptowaluty': 'bg-orange-100 text-orange-800',
      'Edukacja': 'bg-green-100 text-green-800',
      'Strategie': 'bg-purple-100 text-purple-800',
      'Bez kategorii': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getEstimatedReadTime = (content: string | null) => {
    if (!content) return '3 min'
    const words = content.split(' ').length
    const readTime = Math.ceil(words / 200) // 200 words per minute
    return `${readTime} min`
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="wpisy"
        showSearch={false}
        searchPlaceholder="Szukaj analiz, poradników..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-primary/10 border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              📚 Centrum wiedzy finansowej
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Analizy i poradniki <span className="text-primary">inwestycyjne</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Poznaj moje najnowsze analizy spółek, trendy rynkowe i praktyczne strategie inwestycyjne 
              oparte na 8-letnim doświadczeniu w analizie rynków finansowych
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="text-center p-3 sm:p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{posts.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Publikacji</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{categories.length - 1}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {categories.length - 1 === 1 ? 'Kategoria' : 
                   categories.length - 1 < 5 ? 'Kategorie' : 'Kategorii'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section - Mobile Optimized */}
      <section className="bg-card/30 border-y border-border py-4 sm:py-6 lg:py-8 sticky top-14 sm:top-16 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj analiz, poradników..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 rounded-xl border-border bg-background text-sm sm:text-base touch-manipulation tap-highlight-none"
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="flex flex-col xs:flex-row gap-3 flex-1">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="border-border rounded-xl bg-background text-sm sm:text-base touch-manipulation">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Kategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie kategorie</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="border-border rounded-xl bg-background text-sm sm:text-base touch-manipulation">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sortuj" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Najnowsze</SelectItem>
                    <SelectItem value="date-asc">Najstarsze</SelectItem>
                    <SelectItem value="views-desc">Najpopularniejsze</SelectItem>
                    <SelectItem value="views-asc">Najmniej popularne</SelectItem>
                    <SelectItem value="title-asc">A-Z</SelectItem>
                    <SelectItem value="title-desc">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle - Hidden on mobile */}
              <div className="hidden sm:flex border border-border rounded-lg p-1 bg-background">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-md touch-manipulation"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-md touch-manipulation"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Mobile Optimized */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Featured Posts - Mobile Optimized */}
        {featuredPosts.length > 0 && (
          <section className="mb-8 sm:mb-12 lg:mb-16">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  Wyróżnione analizy
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Najważniejsze publikacje wybrane przez autora
                </p>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
                {featuredPosts.length} wyróżnionych
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden bg-gradient-to-br from-card to-card/90 touch-manipulation tap-highlight-none">
                    <div className="relative h-40 sm:h-48 w-full">
                      <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 bg-yellow-500 text-yellow-50 rounded-xl text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Wyróżnione
                      </Badge>
                      {user && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20" onClick={(e) => e.preventDefault()}>
                          <PinButton 
                            postId={post.id} 
                            isPinned={post.is_featured || false}
                            onToggle={(isPinned) => handlePinToggle(post.id, isPinned)}
                          />
                        </div>
                      )}
                      <Image
                        src={getPostImage(post)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getCategoryColor(getMainCategory(post))} rounded-lg text-xs font-medium`}>
                          {getMainCategory(post).toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {getEstimatedReadTime(post.content)}
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Jakub
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden xs:inline">{formatDate(post.published_at || post.created_at)}</span>
                            <span className="xs:hidden">{new Date(post.published_at || post.created_at || '').toLocaleDateString("pl-PL", { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {post.view_count || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts - Mobile Optimized */}
        <section>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                {selectedCategory === "all" ? "Wszystkie publikacje" : `Kategoria: ${selectedCategory}`}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {searchTerm && `Wyniki wyszukiwania dla "${searchTerm}" - `}
                {regularPosts.length} publikacji znalezionych
              </p>
            </div>
            {regularPosts.length > 0 && (
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {regularPosts.length} postów
              </div>
            )}
          </div>
          
          {isFiltering ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-4 sm:space-y-6"}>
              {Array.from({ length: 9 }).map((_, i) => (
                <PostSkeleton key={i} variant={viewMode === "grid" ? "card" : "list"} />
              ))}
            </div>
          ) : regularPosts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-4 sm:space-y-6"}>
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden touch-manipulation tap-highlight-none ${
                    viewMode === "list" ? "flex" : ""
                  }`}>
                    <div className={`relative ${viewMode === "grid" ? "h-32 sm:h-40 w-full" : "h-24 sm:h-32 w-32 sm:w-48 flex-shrink-0"}`}>
                      {user && (
                        <div className="absolute top-2 right-2 z-20" onClick={(e) => e.preventDefault()}>
                          <PinButton 
                            postId={post.id} 
                            isPinned={post.is_featured || false}
                            onToggle={(isPinned) => handlePinToggle(post.id, isPinned)}
                          />
                        </div>
                      )}
                      <Image
                        src={getPostImage(post)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 sm:p-4 lg:p-6 flex-1">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <Badge className={`${getCategoryColor(getMainCategory(post))} rounded-lg text-xs font-medium`}>
                          {getMainCategory(post).toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {getEstimatedReadTime(post.content)}
                        </div>
                      </div>
                      <h3 className={`font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors ${
                        viewMode === "grid" ? "text-sm sm:text-base lg:text-lg line-clamp-2" : "text-base sm:text-lg lg:text-xl line-clamp-1"
                      }`}>
                        {post.title}
                      </h3>
                      <p className={`text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 ${
                        viewMode === "grid" ? "line-clamp-2" : "line-clamp-3"
                      }`}>
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Jakub
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden xs:inline">{formatDate(post.published_at || post.created_at)}</span>
                            <span className="xs:hidden">{new Date(post.published_at || post.created_at || '').toLocaleDateString("pl-PL", { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {post.view_count || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                {searchTerm ? "Nie znaleziono wyników" : "Brak publikacji w tej kategorii"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? "Spróbuj zmienić kryteria wyszukiwania lub przeglądnij inne kategorie."
                  : "Publikacje w tej kategorii pojawią się wkrótce. Sprawdź inne sekcje."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="touch-manipulation tap-highlight-none"
                >
                  Wyczyść filtry
                </Button>
                <Link href="/">
                  <Button className="touch-manipulation tap-highlight-none">
                    Wróć do strony głównej
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
} 