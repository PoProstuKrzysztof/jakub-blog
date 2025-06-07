"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { LoadingCard } from "@/components/ui/loading-card"
import { PostSkeleton } from "@/components/ui/post-skeleton"
import { SiteHeader } from "@/components/site-header"
import {
  CalendarDays,
  Eye,
  Search,
  ArrowRight,
  Plus,
  Edit,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import { PinButton } from "@/components/pin-button"
import { useAuth } from "@/hooks/use-auth"
import type { User } from '@supabase/supabase-js'

interface HomePageClientProps {
  initialPosts: PostFull[]
  user: User | null // Zachowujemy dla kompatybilności, ale będziemy używać useAuth
}

export function HomePageClient({ initialPosts }: HomePageClientProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [posts, setPosts] = useState(initialPosts)
  const [isFiltering, setIsFiltering] = useState(false)

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
    // Simulate filtering delay for better UX
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
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="blog"
        showSearch={true}
        searchPlaceholder="Szukaj posty, kategorie..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

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
                      <article className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer relative group">
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
                          <Badge className="absolute bottom-4 left-4 bg-accent text-primary-foreground rounded-xl text-xs font-medium shadow-md">
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
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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

            <Select value={sortBy} onValueChange={handleSortChange}>
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
        
        {isFiltering ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostSkeleton key={i} variant="list" />
            ))}
          </div>
        ) : (
          <div>
            {filteredAndSortedPosts
              .filter((post) => !post.is_featured)
              .map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <article className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group my-4 mx-2">
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
                        <Badge className="bg-accent text-primary-foreground rounded-xl text-xs font-medium px-3 py-1 shadow-sm">
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
        )}

        {!isFiltering && filteredAndSortedPosts.filter((post) => !post.is_featured).length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nie znaleziono postów spełniających kryteria wyszukiwania.</p>
          </div>
        )}
      </main>

      {/* Telegram CTA Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Dołącz do społeczności Kryptodegeneraci!</h3>
              <p className="text-primary-foreground/90">Otrzymuj najnowsze analizy, sygnały i dyskutuj z innymi inwestorami na Telegramie</p>
            </div>
            <Button 
              asChild
              className="bg-card text-primary hover:bg-card/90 font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <a 
                href="https://t.me/kryptodegeneraci" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Dołącz do grupy
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Jakub Inwestycje</h4>
              <p className="text-muted-foreground">Blog o inwestowaniu i analizie rynków finansowych.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Kontakt</h4>
              <p className="text-muted-foreground mb-4">Masz pytania? Skontaktuj się ze mną poprzez formularz kontaktowy.</p>
              <Link href="/kontakt">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
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