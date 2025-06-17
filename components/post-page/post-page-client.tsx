"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/common/site-header"
import { ShareButton } from "@/components/share-button"
import { PinButton } from "@/components/common/pin-button"
import {
  CalendarDays,
  Eye,
  ArrowLeft,
  Clock,
  User as UserIcon,
  Tag,
  Share2,
  Heart,
  MessageCircle,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import { PostContentRenderer } from "@/components/post-page/post-content-renderer"
import type { User } from '@supabase/supabase-js'

interface PostPageClientProps {
  post: PostFull
  relatedPosts: PostFull[]
  user: User | null
}

export function PostPageClient({ post, relatedPosts, user }: PostPageClientProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isReading, setIsReading] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)
      
      // Show reading indicator when user scrolls past hero
      setIsReading(winScroll > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePinToggle = (postId: string, isPinned: boolean) => {
    // Handle pin toggle logic
  }

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
      'Analiza spółek': 'bg-blue-100 text-blue-800 border-blue-200',
      'Kryptowaluty': 'bg-orange-100 text-orange-800 border-orange-200',
      'Edukacja': 'bg-green-100 text-green-800 border-green-200',
      'Strategie': 'bg-purple-100 text-purple-800 border-purple-200',
      'Bez kategorii': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getEstimatedReadTime = (content: string | null) => {
    if (!content) return '3 min'
    const words = content.split(' ').length
    const readTime = Math.ceil(words / 200) // 200 words per minute
    return `${readTime} min`
  }

  const getAllCategories = (post: PostFull) => {
    return post.post_categories?.map(pc => pc.categories.name) || []
  }

  // Enhanced content renderer with chart support
  const renderContent = (content: string) => {
    return <PostContentRenderer content={content} />
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="post"
        showSearch={false}
      />

      {/* Reading Progress Bar - Mobile Optimized */}
      <div className="fixed top-14 sm:top-16 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back Navigation - Mobile Optimized */}
      <div className="bg-card/50 border-b border-border sticky top-15 sm:top-17 z-40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Link href="/wpisy">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground touch-manipulation tap-highlight-none"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Wróć do wpisów</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content - Mobile Optimized */}
      <article className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Article Header - Mobile Optimized */}
        <header className="mb-6 sm:mb-8 lg:mb-12">
          {/* Categories - Mobile Optimized */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            {getAllCategories(post).map((category, index) => (
              <Badge 
                key={index}
                className={`${getCategoryColor(category)} rounded-lg text-xs font-medium border touch-manipulation`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {category.toUpperCase()}
              </Badge>
            ))}
          </div>

          {/* Title - Mobile Optimized */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt - Mobile Optimized */}
          {post.excerpt && (
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta Information - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center">
                <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="font-medium">Jakub</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{formatDate(post.published_at || post.created_at)}</span>
                <span className="sm:hidden">{new Date(post.published_at || post.created_at || '').toLocaleDateString("pl-PL", { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {getEstimatedReadTime(post.content)}
              </div>
              <div className="flex items-center">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {post.view_count || 0}
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ShareButton 
                url={`${window.location.origin}/post/${post.id}`}
                title={post.title}
                className="touch-manipulation tap-highlight-none"
              />
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="touch-manipulation tap-highlight-none"
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-xs sm:text-sm">{likeCount}</span>
              </Button>

              {user && (
                <PinButton 
                  postId={post.id} 
                  isPinned={post.is_featured || false}
                  onToggle={(isPinned) => handlePinToggle(post.id, isPinned)}
                />
              )}
            </div>
          </div>

          {/* Featured Image - Mobile Optimized */}
          {post.featured_image_url && (
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 lg:mb-12">
              <Image
                src={getPostImage(post)}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          )}
        </header>

        {/* Article Content - Mobile Optimized Typography */}
        <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none prose-gray dark:prose-invert">
          <div 
            className="text-sm sm:text-base leading-relaxed sm:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </div>

        {/* Article Footer - Mobile Optimized */}
        <footer className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Tagi:</span>
              {getAllCategories(post).map((category, index) => (
                <Link key={index} href={`/wpisy?category=${encodeURIComponent(category)}`}>
                  <Badge 
                    variant="outline" 
                    className="hover:bg-primary/10 transition-colors cursor-pointer text-xs touch-manipulation tap-highlight-none"
                  >
                    #{category.toLowerCase().replace(/\s+/g, '')}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="touch-manipulation tap-highlight-none"
              >
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Komentarz</span>
              </Button>
              
              <ShareButton 
                url={`${window.location.origin}/post/${post.id}`}
                title={post.title}
                variant="outline"
                className="touch-manipulation tap-highlight-none"
              />
            </div>
          </div>
        </footer>
      </article>

      {/* Related Posts Section - Mobile Optimized */}
      {relatedPosts.length > 0 && (
        <section className="bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  Powiązane artykuły
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Może Cię również zainteresować
                </p>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {relatedPosts.length} artykułów
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <Link key={relatedPost.id} href={`/post/${relatedPost.id}`}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden touch-manipulation tap-highlight-none">
                    <div className="relative h-32 sm:h-40 w-full">
                      <Image
                        src={getPostImage(relatedPost)}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <Badge className={`${getCategoryColor(getMainCategory(relatedPost))} rounded-lg text-xs font-medium`}>
                          {getMainCategory(relatedPost).toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {getEstimatedReadTime(relatedPost.content)}
                        </div>
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Jakub
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden xs:inline">{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                            <span className="xs:hidden">{new Date(relatedPost.published_at || relatedPost.created_at || '').toLocaleDateString("pl-PL", { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {relatedPost.view_count || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {relatedPosts.length > 3 && (
              <div className="text-center mt-6 sm:mt-8">
                <Link href="/wpisy">
                  <Button 
                    variant="outline" 
                    className="touch-manipulation tap-highlight-none"
                  >
                    Zobacz więcej artykułów
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Navigation to Next/Previous Posts - Mobile Optimized */}
      <div className="bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Poprzedni artykuł</div>
              <Link href="#" className="group">
                <div className="flex items-center p-3 sm:p-4 rounded-xl border border-border hover:border-primary/50 transition-colors touch-manipulation tap-highlight-none">
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary mr-2 sm:mr-3" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      Analiza spółki XYZ - kompletny przegląd
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="flex-1">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 text-right">Następny artykuł</div>
              <Link href="#" className="group">
                <div className="flex items-center p-3 sm:p-4 rounded-xl border border-border hover:border-primary/50 transition-colors touch-manipulation tap-highlight-none">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors truncate text-right">
                      Strategie inwestycyjne na 2024 rok
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary ml-2 sm:ml-3" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action - Mobile Optimized */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-t border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Podobał Ci się ten artykuł?
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Odkryj więcej analiz, poradników i strategii inwestycyjnych. 
            Dołącz do społeczności świadomych inwestorów.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/wpisy">
              <Button size="lg" className="w-full sm:w-auto touch-manipulation tap-highlight-none">
                <BookOpen className="h-4 w-4 mr-2" />
                Zobacz więcej artykułów
              </Button>
            </Link>
            <Link href="/kontakt">
              <Button variant="outline" size="lg" className="w-full sm:w-auto touch-manipulation tap-highlight-none">
                <MessageCircle className="h-4 w-4 mr-2" />
                Skontaktuj się
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 