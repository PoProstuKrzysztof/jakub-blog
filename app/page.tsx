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
  MessageCircle,
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

// Mock data for posts
const posts = [
  {
    id: 1,
    title: "Analiza fundamentalna spółki PKN Orlen - Q3 2024",
    excerpt:
      "Szczegółowa analiza wyników finansowych największej polskiej spółki paliwowej wraz z prognozami na kolejne kwartały i oceną potencjału inwestycyjnego.",
    author: "Jakub Kowalski",
    publishedAt: "2024-12-01",
    mainImage: "/placeholder.svg?height=200&width=300",
    attachments: [
      { name: "Raport_PKN_Orlen_Q3_2024.pdf", type: "pdf" },
      { name: "Kalkulacje_finansowe.xlsx", type: "excel" },
    ],
    views: 1250,
    category: "Analiza spółek",
    comments: 12,
    featured: true,
    pinned: true,
  },
  {
    id: 2,
    title: "Trendy na rynku kryptowalut - Grudzień 2024",
    excerpt:
      "Przegląd najważniejszych wydarzeń na rynku kryptowalut i analiza potencjalnych kierunków rozwoju w nadchodzącym roku.",
    author: "Jakub Kowalski",
    publishedAt: "2024-11-28",
    mainImage: "/placeholder.svg?height=200&width=300",
    attachments: [
      { name: "Analiza_crypto_grudzien.pdf", type: "pdf" },
      { name: "Wykresy_BTC_ETH.png", type: "image" },
    ],
    views: 890,
    category: "Kryptowaluty",
    comments: 8,
    featured: false,
    pinned: false,
  },
  {
    id: 3,
    title: "Jak czytać sprawozdania finansowe - Poradnik",
    excerpt:
      "Kompleksowy przewodnik po sprawozdaniach finansowych z praktycznymi przykładami i wskazówkami dla początkujących inwestorów.",
    author: "Jakub Kowalski",
    publishedAt: "2024-11-25",
    mainImage: "/placeholder.svg?height=200&width=300",
    attachments: [
      { name: "Przewodnik_sprawozdania.pdf", type: "pdf" },
      { name: "Przykład_analizy.xlsx", type: "excel" },
    ],
    views: 2100,
    category: "Edukacja",
    comments: 15,
    featured: false,
    pinned: false,
  },
  {
    id: 4,
    title: "Sektor bankowy - perspektywy na 2025",
    excerpt:
      "Analiza kondycji polskiego sektora bankowego i prognozy na nadchodzący rok z uwzględnieniem zmian regulacyjnych.",
    author: "Jakub Kowalski",
    publishedAt: "2024-11-20",
    mainImage: "/placeholder.svg?height=200&width=300",
    attachments: [{ name: "Analiza_banki_2025.pdf", type: "pdf" }],
    views: 756,
    category: "Analiza spółek",
    comments: 6,
    featured: false,
    pinned: false,
  },
  {
    id: 5,
    title: "Strategie inwestycyjne w czasach inflacji",
    excerpt:
      "Jak chronić kapitał i generować zyski w okresie wysokiej inflacji. Praktyczne porady i strategie dla inwestorów.",
    author: "Jakub Kowalski",
    publishedAt: "2024-11-15",
    mainImage: "/placeholder.svg?height=200&width=300",
    attachments: [
      { name: "Strategie_inflacja.pdf", type: "pdf" },
      { name: "Kalkulacje_ROI.xlsx", type: "excel" },
    ],
    views: 1340,
    category: "Edukacja",
    comments: 9,
    featured: false,
    pinned: false,
  },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort pinned posts to the top first
    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      switch (sortBy) {
        case "date-desc":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "date-asc":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        case "views-desc":
          return b.views - a.views
        case "views-asc":
          return a.views - b.views
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, sortBy, selectedCategory])

  const categories = ["all", ...Array.from(new Set(posts.map((post) => post.category)))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-[#864AF9] text-white text-center py-2 text-sm font-medium">
        PROFESJONALNA WIEDZA INWESTYCYJNA
      </div>

      {/* Header with Social Icons */}
      <header className="bg-[#332941] text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm">{/* Removed ranking text */}</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Facebook className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Youtube className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Instagram className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Rss className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Szukaj..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48 bg-white text-gray-900 border-0 rounded-md"
                />
              </div>
              <Link href="/admin/login">
                <Button
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 rounded-md"
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
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JAKUB INWESTYCJE</h1>
          <p className="text-gray-600 text-lg">FINANSE BARDZO OSOBISTE</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-14">
            <div className="flex space-x-2">
              <Link href="/" className="relative group">
                <div className="bg-[#864AF9] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#7c42e8] hover:shadow-lg transform hover:scale-105">
                  BLOG
                </div>
              </Link>
              <Link href="/wspolpraca" className="relative group">
                <div className="text-gray-700 hover:text-[#864AF9] font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-[#864AF9]/10 hover:shadow-md transform hover:scale-105">
                  WSPÓŁPRACA
                  <div className="absolute inset-0 bg-gradient-to-r from-[#864AF9]/20 to-[#3B3486]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </Link>
              <Link href="/kontakt" className="relative group">
                <div className="text-gray-700 hover:text-[#864AF9] font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-[#864AF9]/10 hover:shadow-md transform hover:scale-105">
                  KONTAKT
                  <div className="absolute inset-0 bg-gradient-to-r from-[#864AF9]/20 to-[#3B3486]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">STRONA Z WPISAMI</h2>

          {/* Pinned Posts Grid - 2x2 */}
          {filteredAndSortedPosts.filter((post) => post.pinned).length > 0 && (
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Przypięte posty</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredAndSortedPosts
                  .filter((post) => post.pinned)
                  .slice(0, 4)
                  .map((post, index) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div className="relative h-48 w-full">
                        <Badge className="absolute top-3 right-3 z-10 bg-[#864AF9] text-white rounded-md">
                          Przypięty
                        </Badge>
                        <Image
                          src={post.mainImage || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-3 left-3 bg-[#3B3486] text-white rounded-md text-xs font-medium">
                          {post.category.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="p-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#864AF9] transition-colors cursor-pointer line-clamp-2">
                          <Link href={`/post/${post.id}`}>{post.title}</Link>
                        </h4>

                        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {post.views}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                        <Link href={`/post/${post.id}`}>
                          <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white rounded-md font-medium text-sm">
                            CZYTAJ
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 border-gray-300 rounded-md">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 rounded-md">
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-gray-300 rounded-md">
                <SelectValue placeholder="Sortuj" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 rounded-md">
                <SelectItem value="date-desc">Najnowsze</SelectItem>
                <SelectItem value="date-asc">Najstarsze</SelectItem>
                <SelectItem value="views-desc">Najpopularniejsze</SelectItem>
                <SelectItem value="views-asc">Najmniej popularne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts List - exclude pinned posts */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Wszystkie posty ({filteredAndSortedPosts.filter((post) => !post.pinned).length})
        </h3>
        <div className="space-y-8">
          {filteredAndSortedPosts
            .filter((post) => !post.pinned)
            .map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex">
                  {/* Post Image */}
                  <div className="w-80 flex-shrink-0">
                    <div className="relative h-48 w-full">
                      {post.pinned && (
                        <Badge className="absolute top-3 right-3 z-10 bg-[#864AF9] text-white rounded-md">
                          Przypięty
                        </Badge>
                      )}
                      <Image
                        src={post.mainImage || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 p-6">
                    <div className="mb-3">
                      <Badge className="bg-[#864AF9] text-white rounded-md text-xs font-medium px-2 py-1">
                        {post.category.toUpperCase()}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-[#864AF9] transition-colors cursor-pointer">
                      <Link href={`/post/${post.id}`}>{post.title}</Link>
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments} Komentarzy
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.views} wyświetleń
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>

                    <Link href={`/post/${post.id}`}>
                      <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white rounded-md font-medium">
                        CZYTAJ
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {filteredAndSortedPosts.filter((post) => !post.pinned).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nie znaleziono postów spełniających kryteria wyszukiwania.</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/kontakt">
          <Button
            size="lg"
            className="bg-[#864AF9] hover:bg-[#7c42e8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Jakub Inwestycje</h4>
              <p className="text-gray-600">Platforma edukacyjna dedykowana profesjonalnej wiedzy inwestycyjnej.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Kontakt</h4>
              <p className="text-gray-600 mb-4">Masz pytania? Skontaktuj się ze mną poprzez formularz kontaktowy.</p>
              <Link href="/kontakt">
                <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-md">
                  Formularz kontaktowy
                </Button>
              </Link>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Jakub Inwestycje. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
