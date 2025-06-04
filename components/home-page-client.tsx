"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  Eye,
  Search,
  ArrowRight,
  Mail,
  Facebook,
  Youtube,
  Instagram,
  Rss,
  Settings,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import { PinButton } from "@/components/pin-button"
import type { User } from '@supabase/supabase-js'

interface HomePageClientProps {
  initialPosts: PostFull[]
  user: User | null
}

export function HomePageClient({ initialPosts, user }: HomePageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [posts, setPosts] = useState(initialPosts)

  const handlePinToggle = (postId: string, isPinned: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, is_featured: isPinned }
          : post
      )
    )
  }

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Extract category from post_categories
      const postCategories = post.post_categories?.map(pc => pc.categories.name) || []
      const matchesCategory = selectedCategory === "all" || postCategories.includes(selectedCategory)
      
      return matchesSearch && matchesCategory
    })

    // Sort pinned posts to the top first
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
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchTerm, sortBy, selectedCategory])

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const allCategories = posts.flatMap(post => 
      post.post_categories?.map(pc => pc.categories.name) || []
    )
    return ["all", ...Array.from(new Set(allCategories))]
  }, [posts])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Brak daty'
    return new Date(dateString).toLocaleDateString("pl-PL")
  }

  const getMainCategory = (post: PostFull) => {
    return post.post_categories?.[0]?.categories?.name || 'Bez kategorii'
  }

  const getPostImage = (post: PostFull) => {
    return post.featured_image_url || "/images/default-post.svg"
  }

  return (
    <div className="min-h-screen bg-background antialiased">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        PROFESJONALNA WIEDZA INWESTYCYJNA
      </div>

      {/* Header with Social Icons */}
      <header className="bg-card shadow-sm py-3 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm"></div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Facebook className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Youtube className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Rss className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Szukaj..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48 bg-background text-foreground border border-border rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Link href="/admin/login">
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 rounded-md shadow-sm"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Panel administratora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Logo Section */}
      <div className="bg-card py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">JAKUB INWESTYCJE</h1>
          <p className="text-muted-foreground text-lg">FINANSE BARDZO OSOBISTE</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-14">
            <div className="flex space-x-2">
              <Link href="/" className="relative group">
                <div className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-lg transform hover:scale-105">
                  BLOG
                </div>
              </Link>
              <Link href="/wspolpraca" className="relative group">
                <div className="text-foreground hover:text-primary font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:shadow-md transform hover:scale-105">
                  WSPÓŁPRACA
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </Link>
              <Link href="/kontakt" className="relative group">
                <div className="text-foreground hover:text-primary font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:shadow-md transform hover:scale-105">
                  KONTAKT
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">STRONA Z WPISAMI</h2>

          {/* Pinned Posts Grid - 2x2 */}
          {filteredAndSortedPosts.filter((post) => post.is_featured).length > 0 && (
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">Przypięte posty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {filteredAndSortedPosts
                  .filter((post) => post.is_featured)
                  .slice(0, 4)
                  .map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <article className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer relative group">
                        <div className="relative h-48 w-full">
                          <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground rounded-xl shadow-md">
                            Przypięty
                          </Badge>
                          <Image
                            src={getPostImage(post)}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute bottom-4 left-4 bg-accent text-accent-foreground rounded-xl text-xs font-medium shadow-md">
                            {getMainCategory(post).toUpperCase()}
                          </Badge>
                        </div>

                        <div className="p-6 relative">
                          {user && (
                            <div className="absolute top-4 right-4 z-20" onClick={(e) => e.preventDefault()}>
                              <PinButton 
                                postId={post.id} 
                                isPinned={post.is_featured || false}
                                onToggle={(isPinned) => handlePinToggle(post.id, isPinned)}
                              />
                            </div>
                          )}
                          
                          <h4 className="text-lg font-bold text-foreground mb-3 hover:text-primary transition-colors line-clamp-2 pr-12">
                            {post.title}
                          </h4>

                          <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              {formatDate(post.published_at || post.created_at)}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.view_count || 0}
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                        </div>
                      </article>
                    </Link>
                  ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border-border rounded-xl shadow-sm">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent className="border-border rounded-xl">
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-border rounded-xl shadow-sm">
                <SelectValue placeholder="Sortuj" />
              </SelectTrigger>
              <SelectContent className="border-border rounded-xl">
                <SelectItem value="date-desc">Najnowsze</SelectItem>
                <SelectItem value="date-asc">Najstarsze</SelectItem>
                <SelectItem value="views-desc">Najpopularniejsze</SelectItem>
                <SelectItem value="views-asc">Najmniej popularne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts List - exclude pinned posts */}
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Wszystkie posty ({filteredAndSortedPosts.filter((post) => !post.is_featured).length})
        </h3>
        
        <div>
          {filteredAndSortedPosts
            .filter((post) => !post.is_featured)
            .map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <article className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:scale-[1.01] my-4 mx-2">
                  <div className="flex">
                    {/* Post Image */}
                    <div className="w-80 flex-shrink-0 relative">
                      <div className="relative h-48 w-full">
                        <Image
                          src={getPostImage(post)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 p-6 relative">
                      {user && (
                        <div className="absolute top-4 right-4 z-20" onClick={(e) => e.preventDefault()}>
                          <PinButton 
                            postId={post.id} 
                            isPinned={post.is_featured || false}
                            onToggle={(isPinned) => handlePinToggle(post.id, isPinned)}
                          />
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <Badge className="bg-primary text-primary-foreground rounded-xl text-xs font-medium px-3 py-1 shadow-sm">
                          {getMainCategory(post).toUpperCase()}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors pr-12">
                        {post.title}
                      </h3>

                      <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {formatDate(post.published_at || post.created_at)}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.view_count || 0} wyświetleń
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
        </div>

        {filteredAndSortedPosts.filter((post) => !post.is_featured).length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nie znaleziono postów spełniających kryteria wyszukiwania.</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/kontakt">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Jakub Inwestycje</h4>
              <p className="text-muted-foreground">Platforma edukacyjna dedykowana profesjonalnej wiedzy inwestycyjnej.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Kontakt</h4>
              <p className="text-muted-foreground mb-4">Masz pytania? Skontaktuj się ze mną poprzez formularz kontaktowy.</p>
              <Link href="/kontakt">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl shadow-md">
                  Formularz kontaktowy
                </Button>
              </Link>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Jakub Inwestycje. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 