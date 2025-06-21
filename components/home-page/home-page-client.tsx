"use client";

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingCard } from "@/components/ui/loading-card"
import { PostSkeleton } from "@/components/ui/post-skeleton"
import { SiteHeader } from "@/components/common/site-header"
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
  TrendingDown,
  Zap,
  PinIcon,
  PinOffIcon,
  } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import { PinButton } from "@/components/common/pin-button"
import { useAuth } from "@/hooks/use-auth"
import { useUserRole } from "@/hooks/use-user-role"
import { getUserPanelPath } from "@/lib/utils/user-role"
import type { User } from '@supabase/supabase-js'

interface HomePageClientProps {
  initialPosts: PostFull[];
  user: User | null;
}

export function HomePageClient({ initialPosts }: HomePageClientProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [posts, setPosts] = useState(initialPosts);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showBlogSection, setShowBlogSection] = useState(false);
  const router = useRouter();
  const { role } = useUserRole();

  const handlePinToggle = (postId: string, isPinned: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, is_featured: isPinned } : post,
      ),
    );
  };

  const handleSearchChange = (value: string) => {
    setIsFiltering(true);
    setSearchTerm(value);
    setTimeout(() => setIsFiltering(false), 300);
  };

  const handleSortChange = (value: string) => {
    setIsFiltering(true);
    setSortBy(value);
    setTimeout(() => setIsFiltering(false), 200);
  };

  const handleCategoryChange = (value: string) => {
    setIsFiltering(true);
    setSelectedCategory(value);
    setTimeout(() => setIsFiltering(false), 200);
  };

  const handleOfferClick = () => {
    if (user) {
      router.push(getUserPanelPath(role))
    } else {
      router.push('/login?from=offer')
    }
  }

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const postCategories =
        post.post_categories?.map((pc) => pc.categories.name) || [];
      const matchesCategory =
        selectedCategory === "all" || postCategories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;

      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.published_at || b.created_at || "").getTime() -
            new Date(a.published_at || a.created_at || "").getTime()
          );
        case "date-asc":
          return (
            new Date(a.published_at || a.created_at || "").getTime() -
            new Date(b.published_at || b.created_at || "").getTime()
          );
        case "views-desc":
          return (b.view_count || 0) - (a.view_count || 0);
        case "views-asc":
          return (a.view_count || 0) - (b.view_count || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchTerm, sortBy, selectedCategory]);

  const categories = useMemo(() => {
    const allCategories = posts.flatMap(
      (post) => post.post_categories?.map((pc) => pc.categories.name) || [],
    );
    return ["all", ...Array.from(new Set(allCategories))];
  }, [posts]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Brak daty";
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const getMainCategory = (post: PostFull) => {
    return post.post_categories?.[0]?.categories?.name || "Bez kategorii";
  };

  const getPostImage = (post: PostFull) => {
    return post.featured_image_url || "/images/default-post.svg";
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        currentPage="home"
        showSearch={false}
        searchPlaceholder="Szukaj analiz, poradników..."
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left">
              <div className="space-y-4 sm:space-y-6">
                <Badge className="bg-primary/10 border-primary/20 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium">
                  🚀 Profesjonalne analizy finansowe
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                  Osiągnij <span className="text-primary">finansową niezależność</span> dzięki inteligentnym inwestycjom
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Wykorzystaj moje 8-letnie doświadczenie w analizie rynków finansowych. 
                  Otrzymuj profesjonalne analizy spółek, strategie inwestycyjne i edukację finansową 
                  – wszystko w jednym miejscu.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                <Link href="/wpisy">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl text-base sm:text-lg lg:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation tap-highlight-none"
                  >
                    <BookOpen className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Poznaj moje analizy
                  </Button>
                </Link>
                <Link href="/wspolpraca">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-border hover:border-primary px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl text-base sm:text-lg lg:text-xl font-semibold transition-all duration-300 hover:bg-primary/5 w-full sm:w-auto touch-manipulation tap-highlight-none"
                  >
                    <MessageCircle className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    Współpraca
                  </Button>
                </Link>
              </div>

              {/* Social Proof - Mobile Optimized */}
              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start space-y-4 xs:space-y-0 xs:space-x-8 pt-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">100+</div>
                  <div className="text-sm sm:text-base text-muted-foreground">Zadowolonych klientów</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">15.2%</div>
                  <div className="text-sm sm:text-base text-muted-foreground">Średnia stopa zwrotu</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">5+</div>
                  <div className="text-sm sm:text-base text-muted-foreground">lat doświadczenia</div>
                </div>
              </div>
            </div>

            {/* Hero Visual - Investment Chart with Profit Effects */}
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border group">
                {/* Main Chart Image */}
                <div className="relative h-64 sm:h-80 lg:h-96">
                  <Image
                    src="/concept-prrof.jpeg"
                    alt="Wykres zysków z portfela inwestycyjnego"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  
                  {/* Gradient Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Animated Profit Indicators */}
                  <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg animate-pulse">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold text-sm">+77.95%</span>
                    </div>
                  </div>
                  
                  {/* Floating Profit Numbers */}
                  <div className="absolute top-1/3 left-4 bg-green-400/90 backdrop-blur-sm text-white px-2 py-1 rounded-md shadow-md animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <span className="font-semibold text-xs">+42.5%</span>
                  </div>
                  
                  <div className="absolute top-1/2 right-8 bg-green-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-md shadow-md animate-bounce" style={{ animationDelay: '1s' }}>
                    <span className="font-semibold text-xs">+27.93%</span>
                  </div>
                  
                  <div className="absolute bottom-1/3 left-1/3 bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md shadow-md animate-bounce" style={{ animationDelay: '1.5s' }}>
                    <span className="font-semibold text-xs">+20.9%</span>
                  </div>
                  
                  {/* Main Portfolio Value */}
                  <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="text-xs text-muted-foreground mb-1">Wartość portfela</div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-600 text-lg">€ 127,450</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">Zysk: zł 42,450</div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Floating badges with Glow Effect */}
              <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 lg:-top-4 lg:-left-4 bg-primary text-primary-foreground px-2 py-1 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium shadow-lg shadow-primary/25 animate-pulse">
                ✨ Sprawdzone strategie
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 lg:-bottom-4 lg:-right-4 bg-green-500 text-white px-2 py-1 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium shadow-lg shadow-green-500/25">
                📈 +77.95% ROI
              </div>
              
              {/* Glowing Success Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 via-primary/20 to-green-400/20 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 lg:py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Dlaczego kilkudziesięciu inwestorów mi zaufało?
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Profesjonalne podejście do inwestowania oparte na wieloletnim doświadczeniu i sprawdzonych metodach analizy
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: Shield,
                title: "Bezpieczne inwestowanie",
                description:
                  "Konserwatywne podejście z naciskiem na zarządzanie ryzykiem i długoterminowy wzrost",
                color: "text-blue-600",
              },
              {
                icon: BarChart3,
                title: "Szczegółowa analiza",
                description:
                  "Analizy portfela inwestycyjnego oparte na rzetelnych danych finansowych i modelach wyceny",
                color: "text-green-600",
              },
              {
                icon: Target,
                title: "Celne rekomendacje",
                description:
                  "Średnia stopa zwrotu 15.2% z moich rekomendacji potwierdza skuteczność metod",
                color: "text-purple-600",
              },
              {
                icon: Users,
                title: "Społeczność",
                description:
                  "Aktywna społeczność inwestorów dzieląca się wiedzą i doświadczeniem na Messengerze",
                color: "text-orange-600",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group touch-manipulation">
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Rozwijaj się ze mną finansowo
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Od analiz twojego portfela po indywidualne konsultacje – wszystko czego potrzebujesz do inteligentnego inwestowania
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: FileText,
                title: "Analizy portfela inwestycyjnego",
                description:
                  "Szczegółowa analiza twojego portfela inwestycyjnego wraz z rekomendacjami ścieżki inwestycyjnej",
                features: [
                  "Analiza finansowa",
                  "Przedstawienie portfela inwestycyjnego",
                  "Poziomy wsparcia",
                  "PDF raport",
                ],
                href: "/wpisy",
                cta: "Przeglądaj analizy",
              },
              {
                icon: MessageCircle,
                title: "Konsultacje indywidualne",
                description:
                  "Spersonalizowane doradztwo inwestycyjne dostosowane do Twojego profilu ryzyka i celów",
                features: [
                  "Analiza portfela",
                  "Strategia inwestycyjna",
                  "Sesja 1-na-1",
                  "Plan działania",
                ],
                href: "/wspolpraca#cennik",
                cta: "Umów konsultację",
              },
              {
                icon: TrendingUp,
                title: "Portfel autora",
                description:
                  "Miesięczny dostęp do mojego portfela inwestycyjnego z regularnymi analizami i aktualizacjami",
                features: [
                  "Aktualny skład portfela",
                  "Regularne analizy",
                  "Powiadomienia o zmianach",
                  "Pełna transparentność",
                ],
                href: "/portfel-autora",
                cta: "Zobacz portfel",
                badge: "49 zł/miesięcznie",
              },
              {
                icon: Award,
                title: "Edukacja finansowa",
                description:
                  "Kursy, poradniki i webinaria pomagające zrozumieć rynki i podejmować lepsze decyzje",
                features: [
                  "Poradniki praktyczne",
                  "Case studies",
                  "Webinaria live",
                  "Społeczność",
                ],
                href: "/kontakt",
                cta: "Zapisz się",
              },
            ].map((service, index) => (
              <div key={index} className="min-h-[500px]">
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden h-full flex flex-col touch-manipulation">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Główna treść karty */}
                  <div className="p-6 lg:p-8 relative z-10 flex flex-col h-full">
                    {/* Ikona */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Tytuł */}
                    <h3 className="text-xl font-semibold text-foreground mb-4 text-center">{service.title}</h3>
                    
                    {/* Opis */}
                    <p className="text-sm text-muted-foreground mb-6 text-center leading-relaxed">{service.description}</p>
                    
                    {/* Features - rozciągają się aby wypełnić przestrzeń */}
                    <div className="space-y-3 flex-1 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Przycisk - zawsze na dole */}
                    <div>
                      <Button 
                        onClick={handleOfferClick}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300 py-3 touch-manipulation tap-highlight-none"
                      >
                        {service.cta}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Co mówią o mnie inwestorzy?
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
              Opinie od osób, które zaufały moim analizom i konsultacjom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                name: "Marcin K.",
                role: "Inwestor indywidualny",
                content:
                  "Analiza PKN Orlen okazała się strzałem w dziesiątkę. Dzięki Jakubowi zyskałem 18% w 6 miesięcy. Profesjonalne podejście i rzetelne dane.",
                rating: 5,
              },
              {
                name: "Anna W.",
                role: "Doradca finansowy",
                content:
                  "Konsultacja z Jakubem pomogła mi lepiej zrozumieć sektor bankowy. Jego znajomość rynku i umiejętność przekazywania wiedzy są na najwyższym poziomie.",
                rating: 5,
              },
              {
                name: "Tomasz L.",
                role: "CEO Tech Startup",
                content:
                  "Rozpocząłem inwestowanie dzięki poradnikom Jakuba. Po roku mój portfel osiągnął zysk 12%. Polecam każdemu, kto chce profesjonalnie podejść do inwestycji.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground text-xs sm:text-sm lg:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section (conditionally rendered) - Mobile Optimized */}
      {showBlogSection && (
        <section className="py-8 sm:py-12 lg:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Najnowsze analizy i poradniki
              </h2>
              <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mb-6 sm:mb-8">
                Poznaj moje najnowsze analizy spółek, trendy rynkowe i strategie inwestycyjne
              </p>

              {/* Search and Filters - Mobile Optimized */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-4xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj analiz, poradników..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 rounded-xl border-border text-sm sm:text-base touch-manipulation tap-highlight-none"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="border-border rounded-xl text-sm sm:text-base touch-manipulation">
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
                    <SelectTrigger className="border-border rounded-xl text-sm sm:text-base touch-manipulation">
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

            {/* Featured Posts - Mobile Optimized */}
            {filteredAndSortedPosts.filter((post) => post.is_featured).length > 0 && (
              <div className="mb-6 sm:mb-8 lg:mb-12">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">Wyróżnione analizy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredAndSortedPosts
                    .filter((post) => post.is_featured)
                    .slice(0, 3)
                    .map((post) => (
                      <Link key={post.id} href={`/post/${post.id}`}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden touch-manipulation tap-highlight-none">
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

            {/* All Posts - Mobile Optimized */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  Wszystkie publikacje ({filteredAndSortedPosts.filter((post) => !post.is_featured).length})
                </h3>
                <Link href="/wpisy">
                  <Button variant="outline" className="rounded-xl text-sm sm:text-base touch-manipulation tap-highlight-none">
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
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden touch-manipulation tap-highlight-none">
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

      {/* CTA Section - Mobile Optimized */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Gotowy na rozpoczęcie swojej inwestycyjnej podróży?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 text-primary-foreground/90 max-w-3xl mx-auto">
            Dołącz do tysięcy inwestorów, którzy już korzystają z moich analiz i osiągają lepsze wyniki finansowe
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 lg:mb-16">
            <Link href="/wpisy">
              <Button 
                size="lg" 
                className="bg-card text-primary hover:bg-card/90 font-semibold px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg w-full sm:w-auto touch-manipulation tap-highlight-none"
              >
                <BookOpen className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Rozpocznij lekturę
              </Button>
            </Link>
            <Link href="/wspolpraca#cennik">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg w-full sm:w-auto touch-manipulation tap-highlight-none"
              >
                <MessageCircle className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Umów konsultację
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Messenger CTA Banner - Mobile Optimized */}
      <div className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Dołącz do społeczności Kryptodegeneraci!</h3>
              <p className="text-sm sm:text-base lg:text-lg text-secondary-foreground/90">Otrzymuj najnowsze analizy, sygnały i dyskutuj z innymi inwestorami na Messengerze</p>
            </div>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base lg:text-lg w-full lg:w-auto touch-manipulation tap-highlight-none"
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
  );
}
