"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { PostSkeleton } from "@/components/ui/post-skeleton"
import { SiteHeader } from "@/components/common/site-header"
import {
  CalendarDays,
  Eye,
  Search,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import { useAuth } from "@/hooks/use-auth"
import type { User } from '@supabase/supabase-js'

// Import sekcji Builder.io
import { 
  HeroSectionInfo, 
  FeaturesSectionInfo, 
  ServicesSectionInfo, 
  TestimonialsSectionInfo, 
  CTASectionInfo 
} from '@/components/builder/home-page-sections'

interface HomePageBuilderProps {
  initialPosts?: PostFull[]
  user?: User | null
  showSections?: {
    hero?: boolean
    features?: boolean
    services?: boolean
    testimonials?: boolean
    blog?: boolean
    cta?: boolean
  }
  heroProps?: {
    title?: string
    subtitle?: string
    primaryCtaText?: string
    primaryCtaUrl?: string
    secondaryCtaText?: string
    secondaryCtaUrl?: string
    badge?: string
    showStats?: boolean
  }
  featuresProps?: {
    title?: string
    subtitle?: string
  }
  servicesProps?: {
    title?: string
    subtitle?: string
  }
  testimonialsProps?: {
    title?: string
    subtitle?: string
  }
  ctaProps?: {
    title?: string
    subtitle?: string
    primaryCtaText?: string
    primaryCtaUrl?: string
    secondaryCtaText?: string
    secondaryCtaUrl?: string
  }
}

function HomePageBuilder({ 
  initialPosts = [],
  showSections = {
    hero: true,
    features: true,
    services: true,
    testimonials: true,
    blog: true,
    cta: true
  },
  heroProps = {},
  featuresProps = {},
  servicesProps = {},
  testimonialsProps = {},
  ctaProps = {}
}: HomePageBuilderProps) {
  const { user: authUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [posts, setPosts] = useState(initialPosts)
  const [isFiltering, setIsFiltering] = useState(false)
  const [showBlogSection, setShowBlogSection] = useState(false)

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
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Renderowanie komponentów Builder.io
  const HeroComponent = HeroSectionInfo.component
  const FeaturesComponent = FeaturesSectionInfo.component
  const ServicesComponent = ServicesSectionInfo.component
  const TestimonialsComponent = TestimonialsSectionInfo.component
  const CTAComponent = CTASectionInfo.component

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="home"
        showSearch={false}
        searchPlaceholder="Szukaj analiz, poradników..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Hero Section */}
      {showSections.hero && (
        <HeroComponent
          {...heroProps}
          primaryCtaUrl={heroProps.primaryCtaUrl || "#blog"}
          primaryCtaText={heroProps.primaryCtaText || "Poznaj moje analizy"}
        />
      )}

      {/* Features Section */}
      {showSections.features && (
        <FeaturesComponent {...featuresProps} />
      )}

      {/* Services Section */}
      {showSections.services && (
        <ServicesComponent {...servicesProps} />
      )}

      {/* Testimonials Section */}
      {showSections.testimonials && (
        <TestimonialsComponent {...testimonialsProps} />
      )}

      {/* Blog Section (conditionally rendered) */}
      {showSections.blog && (showBlogSection || initialPosts.length > 0) && (
        <section className="py-8 sm:py-12 lg:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Najnowsze analizy i poradniki
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mb-6 sm:mb-8">
                Poznaj moje najnowsze analizy spółek, trendy rynkowe i strategie inwestycyjne
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj analiz, poradników..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 rounded-xl border-border text-sm sm:text-base"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="border-border rounded-xl text-sm sm:text-base">
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
                    <SelectTrigger className="border-border rounded-xl text-sm sm:text-base">
                      <SelectValue placeholder="Sortuj" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Najnowsze</SelectItem>
                      <SelectItem value="date-asc">Najstarsze</SelectItem>
                      <SelectItem value="views-desc">Najpopularniejsze</SelectItem>
                      <SelectItem value="views-asc">Najmniej popularne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Featured Posts */}
            {filteredAndSortedPosts.filter((post) => post.is_featured).length > 0 && (
              <div className="mb-6 sm:mb-8 lg:mb-12">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">Wyróżnione analizy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredAndSortedPosts
                    .filter((post) => post.is_featured)
                    .slice(0, 3)
                    .map((post) => (
                      <Link key={post.id} href={`/post/${post.id}`}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                          <div className="relative h-32 sm:h-40 lg:h-48 w-full">
                            <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-primary text-primary-foreground rounded-xl text-xs">
                              Wyróżnione
                            </Badge>
                            <Image
                              src={getPostImage(post)}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-3 sm:p-4 lg:p-6">
                            <Badge className="mb-2 sm:mb-3 bg-accent/10 text-accent-foreground rounded-lg text-xs">
                              {getMainCategory(post).toUpperCase()}
                            </Badge>
                            <h4 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3 line-clamp-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 space-x-3 sm:space-x-4">
                              <div className="flex items-center">
                                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {formatDate(post.published_at || post.created_at)}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {post.view_count || 0}
                              </div>
                            </div>
                            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">{post.excerpt}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  Wszystkie publikacje ({filteredAndSortedPosts.filter((post) => !post.is_featured).length})
                </h3>
                <Link href="/wpisy">
                  <Button variant="outline" className="rounded-xl text-sm sm:text-base">
                    Zobacz wszystkie
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>
              </div>
              
              {isFiltering ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PostSkeleton key={i} variant="card" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredAndSortedPosts
                    .filter((post) => !post.is_featured)
                    .slice(0, 6)
                    .map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                        <div className="relative h-28 sm:h-32 lg:h-40 w-full">
                          <Image
                            src={getPostImage(post)}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-3 sm:p-4 lg:p-6">
                          <Badge className="mb-2 sm:mb-3 bg-accent/10 text-accent-foreground rounded-lg text-xs">
                            {getMainCategory(post).toUpperCase()}
                          </Badge>
                          <h4 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mb-2 sm:mb-3 line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 space-x-3 sm:space-x-4">
                            <div className="flex items-center">
                              <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {formatDate(post.published_at || post.created_at)}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {post.view_count || 0}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{post.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {showSections.cta && (
        <CTAComponent 
          {...ctaProps}
          primaryCtaUrl={ctaProps.primaryCtaUrl || "#blog"}
        />
      )}

      {/* Messenger CTA Banner */}
      <div className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Dołącz do społeczności Kryptodegeneraci!</h3>
              <p className="text-sm sm:text-base lg:text-lg text-secondary-foreground/90">Otrzymuj najnowsze analizy, sygnały i dyskutuj z innymi inwestorami na Messengerze</p>
            </div>
            <Button 
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg w-full lg:w-auto"
            >
              <a 
                href="https://m.me/kryptodegeneraci" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.732 8.1l3.13 3.259L19.752 8.1l-6.559 6.863z"/>
                </svg>
                Dołącz do grupy
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Konfiguracja komponentu dla Builder.io
export const HomePageBuilderInfo = {
  name: 'HomePageBuilder',
  component: HomePageBuilder,
  inputs: [
    {
      name: 'showSections',
      type: 'object',
      friendlyName: 'Widoczność sekcji',
      subFields: [
        { name: 'hero', type: 'boolean', defaultValue: true, friendlyName: 'Sekcja Hero' },
        { name: 'features', type: 'boolean', defaultValue: true, friendlyName: 'Sekcja Features' },
        { name: 'services', type: 'boolean', defaultValue: true, friendlyName: 'Sekcja Services' },
        { name: 'testimonials', type: 'boolean', defaultValue: true, friendlyName: 'Sekcja Testimonials' },
        { name: 'blog', type: 'boolean', defaultValue: true, friendlyName: 'Sekcja Blog' },
        { name: 'cta', type: 'boolean', defaultValue: true, friendlyName: 'Sekcja CTA' }
      ]
    },
    {
      name: 'heroProps',
      type: 'object',
      friendlyName: 'Ustawienia Hero',
      subFields: [
        { name: 'title', type: 'text', friendlyName: 'Tytuł' },
        { name: 'subtitle', type: 'longText', friendlyName: 'Podtytuł' },
        { name: 'primaryCtaText', type: 'text', friendlyName: 'Tekst głównego przycisku' },
        { name: 'primaryCtaUrl', type: 'url', friendlyName: 'Link głównego przycisku' },
        { name: 'secondaryCtaText', type: 'text', friendlyName: 'Tekst drugiego przycisku' },
        { name: 'secondaryCtaUrl', type: 'url', friendlyName: 'Link drugiego przycisku' },
        { name: 'badge', type: 'text', friendlyName: 'Tekst znaczka' },
        { name: 'showStats', type: 'boolean', friendlyName: 'Pokaż statystyki' }
      ]
    }
  ]
}

export default HomePageBuilder 