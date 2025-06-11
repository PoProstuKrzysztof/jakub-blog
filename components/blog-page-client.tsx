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
        showSearch={true}
        searchPlaceholder="Szukaj analiz, poradników..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
              📚 Centrum wiedzy finansowej
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Analizy i poradniki <span className="text-primary">inwestycyjne</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Poznaj moje najnowsze analizy spółek, trendy rynkowe i praktyczne strategie inwestycyjne 
              oparte na 8-letnim doświadczeniu w analizie rynków finansowych
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-2xl font-bold text-foreground">{posts.length}</div>
                <div className="text-sm text-muted-foreground">Publikacji</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-2xl font-bold text-foreground">15.2%</div>
                <div className="text-sm text-muted-foreground">Średnia stopa zwrotu</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-2xl font-bold text-foreground">
                  {posts.reduce((sum, post) => sum + (post.view_count || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Wyświetleń</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-2xl font-bold text-foreground">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">Kategorii</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="bg-card/30 border-y border-border py-8 sticky top-16 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj analiz, poradników..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 rounded-xl border-border bg-background"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48 border-border rounded-xl bg-background">
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
                <SelectTrigger className="w-48 border-border rounded-xl bg-background">
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

              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg p-1 bg-background">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-md"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Wyróżnione analizy
                </h2>
                <p className="text-muted-foreground">
                  Najważniejsze publikacje wybrane przez autora
                </p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                {featuredPosts.length} wyróżnionych
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden bg-gradient-to-br from-card to-card/90">
                    <div className="relative h-48 w-full">
                      <Badge className="absolute top-4 left-4 z-10 bg-yellow-500 text-yellow-50 rounded-xl">
                        <Star className="h-3 w-3 mr-1" />
                        Wyróżnione
                      </Badge>
                      {user && (
                        <div className="absolute top-4 right-4 z-20" onClick={(e) => e.preventDefault()}>
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
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getCategoryColor(getMainCategory(post))} rounded-lg text-xs font-medium`}>
                          {getMainCategory(post).toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {getEstimatedReadTime(post.content)}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          Jakub
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
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

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {selectedCategory === "all" ? "Wszystkie publikacje" : `Kategoria: ${selectedCategory}`}
              </h2>
              <p className="text-muted-foreground">
                {searchTerm && `Wyniki wyszukiwania dla "${searchTerm}" - `}
                {regularPosts.length} publikacji znalezionych
              </p>
            </div>
            {regularPosts.length > 0 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-1" />
                {regularPosts.length} postów
              </div>
            )}
          </div>
          
          {isFiltering ? (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {Array.from({ length: 9 }).map((_, i) => (
                <PostSkeleton key={i} variant={viewMode === "grid" ? "card" : "list"} />
              ))}
            </div>
          ) : regularPosts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden ${
                    viewMode === "list" ? "flex" : ""
                  }`}>
                    <div className={`relative ${viewMode === "grid" ? "h-40 w-full" : "h-32 w-48 flex-shrink-0"}`}>
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
                    <CardContent className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getCategoryColor(getMainCategory(post))} rounded-lg text-xs font-medium`}>
                          {getMainCategory(post).toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {getEstimatedReadTime(post.content)}
                        </div>
                      </div>
                      <h3 className={`font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${
                        viewMode === "grid" ? "text-lg line-clamp-2" : "text-xl line-clamp-1"
                      }`}>
                        {post.title}
                      </h3>
                      <p className={`text-muted-foreground text-sm mb-4 ${
                        viewMode === "grid" ? "line-clamp-2" : "line-clamp-3"
                      }`}>
                        {post.excerpt}
                      </p>
                                             <div className="flex items-center justify-between text-sm text-muted-foreground">
                         <div className="flex items-center">
                           <UserIcon className="h-4 w-4 mr-1" />
                           Jakub
                         </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
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
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {searchTerm ? "Nie znaleziono wyników" : "Brak publikacji w tej kategorii"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
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
                >
                  Wyczyść filtry
                </Button>
                <Link href="/">
                  <Button>
                    Wróć do strony głównej
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-20 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 text-center border border-border">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Nie przegap najnowszych analiz
            </h3>
            <p className="text-muted-foreground mb-6">
              Zapisz się do newslettera i otrzymuj najlepsze analizy spółek, 
              trendy rynkowe i praktyczne porady inwestycyjne prosto na email
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                placeholder="Twój email"
                className="rounded-xl border-border bg-background"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 font-semibold">
                Zapisz się
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Bez spamu. Możesz zrezygnować w każdej chwili.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Jakub Inwestycje</h4>
              <p className="text-muted-foreground mb-4">Profesjonalne analizy finansowe i doradztwo inwestycyjne.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Usługi</h4>
              <ul className="space-y-2">
                <li><Link href="/wpisy" className="text-muted-foreground hover:text-primary transition-colors">Analizy spółek</Link></li>
                <li><Link href="/wspolpraca" className="text-muted-foreground hover:text-primary transition-colors">Konsultacje</Link></li>
                <li><Link href="/wpisy" className="text-muted-foreground hover:text-primary transition-colors">Edukacja</Link></li>
                <li><Link href="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">Newsletter</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Kategorie</h4>
              <ul className="space-y-2">
                {categories.slice(1, 5).map((category) => (
                  <li key={category}>
                    <button 
                      onClick={() => handleCategoryChange(category)}
                      className="text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Kontakt</h4>
              <ul className="space-y-2">
                <li><Link href="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">Formularz kontaktowy</Link></li>
                <li><Link href="/wspolpraca" className="text-muted-foreground hover:text-primary transition-colors">Współpraca</Link></li>

                <li><a href="https://t.me/kryptodegeneraci" className="text-muted-foreground hover:text-primary transition-colors">Telegram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Jakub Inwestycje. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 