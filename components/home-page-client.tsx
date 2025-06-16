"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  TrendingUp,
  Shield,
  BarChart3,
  Users,
  Star,
  CheckCircle,
  PlayCircle,
  BookOpen,
  MessageCircle,
  Target,
  Award,
  FileText,
  Lightbulb,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import { PinButton } from "@/components/pin-button"
import { useAuth } from "@/hooks/use-auth"
import type { User } from '@supabase/supabase-js'

interface HomePageClientProps {
  initialPosts: PostFull[]
  user: User | null
}

export function HomePageClient({ initialPosts }: HomePageClientProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [posts, setPosts] = useState(initialPosts)
  const [isFiltering, setIsFiltering] = useState(false)
  const [showBlogSection, setShowBlogSection] = useState(false)

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
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium">
                  🚀 Profesjonalne analizy finansowe
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Osiągnij <span className="text-primary">finansową niezależność</span> dzięki inteligentnym inwestycjom
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Wykorzystaj moje 8-letnie doświadczenie w analizie rynków finansowych. 
                  Otrzymuj profesjonalne analizy spółek, strategie inwestycyjne i edukację finansową 
                  – wszystko w jednym miejscu.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setShowBlogSection(true)}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Poznaj moje analizy
                </Button>
                <Link href="/wspolpraca">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-border hover:border-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-primary/5"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Współpraca
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">200+</div>
                  <div className="text-sm text-muted-foreground">Analiz spółek</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">15.2%</div>
                  <div className="text-sm text-muted-foreground">Średnia stopa zwrotu</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">8+</div>
                  <div className="text-sm text-muted-foreground">lat doświadczenia</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative bg-card rounded-2xl p-8 shadow-2xl border border-border">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Portfolio Performance</h3>
                    <Badge className="bg-green-100 text-green-800 rounded-lg">+15.2%</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm font-medium">PKN Orlen</span>
                      <span className="text-green-600 font-semibold">+18.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm font-medium">CD Projekt</span>
                      <span className="text-green-600 font-semibold">+12.3%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <span className="text-sm font-medium">Allegro</span>
                      <span className="text-green-600 font-semibold">+8.7%</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Łączny zysk</span>
                      <span className="text-lg font-bold text-green-600">+€ 12,450</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                ✨ Najlepsze analizy
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                📊 Real-time updates
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Dlaczego tysiące inwestorów mi zaufało?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Profesjonalne podejście do inwestowania oparte na wieloletnim doświadczeniu i sprawdzonych metodach analizy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Bezpieczne inwestowanie",
                description: "Konserwatywne podejście z naciskiem na zarządzanie ryzykiem i długoterminowy wzrost",
                color: "text-blue-600"
              },
              {
                icon: BarChart3,
                title: "Szczegółowa analiza",
                description: "Analizy fundamentalne oparte na rzetelnych danych finansowych i modelach wyceny",
                color: "text-green-600"
              },
              {
                icon: Target,
                title: "Celne rekomendacje",
                description: "Średnia stopa zwrotu 15.2% z moich rekomendacji potwierdza skuteczność metod",
                color: "text-purple-600"
              },
              {
                icon: Users,
                title: "Społeczność",
                description: "Aktywna społeczność inwestorów dzieląca się wiedzą i doświadczeniem na Telegramie",
                color: "text-orange-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Rozwijaj się ze mną finansowo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Od analiz spółek po indywidualne konsultacje – wszystko czego potrzebujesz do inteligentnego inwestowania
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Analizy spółek",
                description: "Szczegółowe analizy fundamentalne polskich i zagranicznych spółek z rekomendacjami inwestycyjnymi",
                features: ["Analiza finansowa", "Wycena spółki", "Poziomy wsparcia", "PDF raport"],
                href: "/wpisy",
                cta: "Przeglądaj analizy"
              },
              {
                icon: MessageCircle,
                title: "Konsultacje indywidualne",
                description: "Spersonalizowane doradztwo inwestycyjne dostosowane do Twojego profilu ryzyka i celów",
                features: ["Analiza portfela", "Strategia inwestycyjna", "Sesja 1-na-1", "Plan działania"],
                href: "/wspolpraca",
                cta: "Umów konsultację"
              },
              {
                icon: Award,
                title: "Edukacja finansowa",
                description: "Kursy, poradniki i webinaria pomagające zrozumieć rynki i podejmować lepsze decyzje",
                features: ["Poradniki praktyczne", "Case studies", "Webinaria live", "Społeczność"],
                href: "/kontakt",
                cta: "Zapisz się"
              }
            ].map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 text-center">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 text-center leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Link href={service.href} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300">
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Co mówią o mnie inwestorzy?
            </h2>
            <p className="text-xl text-muted-foreground">
              Opinie od osób, które zaufały moim analizom i konsultacjom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marcin K.",
                role: "Inwestor indywidualny",
                content: "Analiza PKN Orlen okazała się strzałem w dziesiątkę. Dzięki Jakubowi zyskałem 18% w 6 miesięcy. Profesjonalne podejście i rzetelne dane.",
                rating: 5
              },
              {
                name: "Anna W.",
                role: "Doradca finansowy",
                content: "Konsultacja z Jakubem pomogła mi lepiej zrozumieć sektor bankowy. Jego znajomość rynku i umiejętność przekazywania wiedzy są na najwyższym poziomie.",
                rating: 5
              },
              {
                name: "Tomasz L.",
                role: "CEO Tech Startup",
                content: "Rozpocząłem inwestowanie dzięki poradnikom Jakuba. Po roku mój portfel osiągnął zysk 12%. Polecam każdemu, kto chce profesjonalnie podejść do inwestycji.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section (conditionally rendered) */}
      {showBlogSection && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Najnowsze analizy i poradniki
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Poznaj moje najnowsze analizy spółek, trendy rynkowe i strategie inwestycyjne
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 justify-center mb-8 max-w-4xl mx-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj analiz, poradników..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 rounded-xl border-border"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-48 border-border rounded-xl">
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
                  <SelectTrigger className="w-48 border-border rounded-xl">
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

            {/* Featured Posts */}
            {filteredAndSortedPosts.filter((post) => post.is_featured).length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-foreground mb-6">Wyróżnione analizy</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAndSortedPosts
                    .filter((post) => post.is_featured)
                    .slice(0, 3)
                    .map((post) => (
                      <Link key={post.id} href={`/post/${post.id}`}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                          <div className="relative h-48 w-full">
                            <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground rounded-xl">
                              Wyróżnione
                            </Badge>
                            <Image
                              src={getPostImage(post)}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-6">
                            <Badge className="mb-3 bg-accent/10 text-accent-foreground rounded-lg text-xs">
                              {getMainCategory(post).toUpperCase()}
                            </Badge>
                            <h4 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
                              <div className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                {formatDate(post.published_at || post.created_at)}
                              </div>
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {post.view_count || 0}
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Wszystkie publikacje ({filteredAndSortedPosts.filter((post) => !post.is_featured).length})
                </h3>
                <Link href="/wpisy">
                  <Button variant="outline" className="rounded-xl">
                    Zobacz wszystkie
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              {isFiltering ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PostSkeleton key={i} variant="card" />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedPosts
                    .filter((post) => !post.is_featured)
                    .slice(0, 6)
                    .map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`}>
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden">
                        <div className="relative h-40 w-full">
                          <Image
                            src={getPostImage(post)}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6">
                          <Badge className="mb-3 bg-accent/10 text-accent-foreground rounded-lg text-xs">
                            {getMainCategory(post).toUpperCase()}
                          </Badge>
                          <h4 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
                            <div className="flex items-center">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              {formatDate(post.published_at || post.created_at)}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.view_count || 0}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
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
      <section className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Gotowy na rozpoczęcie swojej inwestycyjnej podróży?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Dołącz do tysięcy inwestorów, którzy już korzystają z moich analiz i osiągają lepsze wyniki finansowe
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-card text-primary hover:bg-card/90 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowBlogSection(true)}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Rozpocznij lekturę
            </Button>
            <Link href="/wspolpraca">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-300"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Umów konsultację
              </Button>
            </Link>
          </div>

          {/* Newsletter signup */}
          <div className="max-w-md mx-auto">
            <p className="text-sm text-primary-foreground/80 mb-4">
              Zapisz się do newslettera i otrzymuj najlepsze analizy prosto na email
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Twój email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-xl"
              />
              <Button className="bg-card text-primary hover:bg-card/90 rounded-xl px-6">
                Zapisz się
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Telegram CTA Banner */}
      <div className="bg-gradient-to-r from-accent to-accent/90 text-primary-foreground py-8">
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
    </div>
  )
} 