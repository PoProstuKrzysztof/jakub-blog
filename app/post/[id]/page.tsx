"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Eye, Download, FileText, ArrowLeft, User, Share2, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for a single post
const post = {
  id: 1,
  title: "Analiza fundamentalna spółki PKN Orlen - Q3 2024",
  content: `
# Wprowadzenie

PKN Orlen to największa polska spółka paliwowa, która w trzecim kwartale 2024 roku przedstawiła wyniki finansowe pokazujące stabilną pozycję na rynku mimo wyzwań makroekonomicznych.

## Kluczowe wskaźniki finansowe

W trzecim kwartale 2024 roku PKN Orlen osiągnął:

- **Przychody**: 45,2 mld PLN (wzrost o 8% r/r)
- **EBITDA**: 3,8 mld PLN (spadek o 12% r/r)
- **Zysk netto**: 1,2 mld PLN (spadek o 25% r/r)

## Analiza segmentów biznesowych

### Segment rafineryjny
Segment rafineryjny pozostaje głównym źródłem przychodów spółki. Marże rafinacyjne w Q3 2024 wyniosły średnio 8,5 USD/bbl, co stanowi spadek w porównaniu do rekordowych poziomów z poprzedniego roku.

### Segment petrochemiczny
Działalność petrochemiczna spółki pokazuje oznaki stabilizacji po trudnym okresie. Wykorzystanie mocy produkcyjnych wzrosło do 85%.

### Segment detaliczny
Sieć stacji paliw Orlen odnotowała wzrost sprzedaży o 5% r/r, co świadczy o silnej pozycji marki na rynku polskim.

## Perspektywy na przyszłość

Spółka planuje dalsze inwestycje w:
- Rozwój mocy rafineryjnych
- Projekty petrochemiczne
- Transformację energetyczną
- Ekspansję międzynarodową

## Wycena

Na podstawie przeprowadzonej analizy DCF, wartość godziwa akcji PKN Orlen wynosi 65-70 PLN za akcję, co przy obecnej cenie rynkowej daje potencjał wzrostu na poziomie 15-20%.

## Podsumowanie

PKN Orlen pozostaje solidną inwestycją długoterminową mimo krótkoterminowych wyzwań. Silna pozycja rynkowa i plany rozwojowe wspierają pozytywną rekomendację.
  `,
  author: "Jakub Kowalski",
  publishedAt: "2024-12-01",
  mainImage: "/placeholder.svg?height=500&width=1200",
  attachments: [
    { name: "Raport_PKN_Orlen_Q3_2024.pdf", type: "pdf", size: "2.3 MB" },
    { name: "Kalkulacje_finansowe.xlsx", type: "excel", size: "1.8 MB" },
    { name: "Wykresy_analiza.png", type: "image", size: "0.9 MB" },
  ],
  views: 1250,
  category: "Analiza spółek",
  pinned: true,
}

export default function PostPage() {
  const [copied, setCopied] = useState(false)

  const sharePost = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#413B61" }}>
      {/* Header */}
      <header className="bg-[#332941] shadow-lg border-b border-[#3B3486] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              Jakub Inwestycje
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                onClick={sharePost}
                className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Skopiowano!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Udostępnij
                  </>
                )}
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#864AF9] text-[#864AF9] hover:bg-[#864AF9] hover:text-white transition-all duration-300 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Powrót do bloga
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.pinned && (
              <Badge className="bg-[#864AF9] text-white rounded-xl shadow-lg animate-pulse">Przypięty</Badge>
            )}
            <Badge className="bg-[#3B3486] text-white rounded-xl shadow-lg">{post.category}</Badge>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in">{post.title}</h1>

          <div className="flex flex-wrap items-center text-gray-300 gap-6 mb-8 animate-fade-in-delay">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {post.views} wyświetleń
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </div>
          </div>

          {/* Main Image */}
          <div className="relative h-96 lg:h-[500px] mb-8 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.02] animate-fade-in-delay">
            <Image src={post.mainImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - Now takes 3/4 of the width */}
          <div className="lg:col-span-3">
            <Card className="bg-white/95 rounded-2xl shadow-2xl">
              <CardContent className="p-8 lg:p-12">
                <div className="prose prose-lg prose-gray max-w-none">
                  {post.content.split("\n").map((paragraph, index) => {
                    if (paragraph.startsWith("# ")) {
                      return (
                        <h1 key={index} className="text-3xl font-bold mt-8 mb-6 text-[#332941]">
                          {paragraph.slice(2)}
                        </h1>
                      )
                    }
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-2xl font-semibold mt-8 mb-4 text-[#332941]">
                          {paragraph.slice(3)}
                        </h2>
                      )
                    }
                    if (paragraph.startsWith("### ")) {
                      return (
                        <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-[#332941]">
                          {paragraph.slice(4)}
                        </h3>
                      )
                    }
                    if (paragraph.startsWith("- **")) {
                      const match = paragraph.match(/- \*\*(.*?)\*\*: (.*)/)
                      if (match) {
                        return (
                          <li
                            key={index}
                            className="mb-2 text-gray-700 transition-colors duration-300 hover:text-[#864AF9]"
                          >
                            <strong className="text-[#332941]">{match[1]}</strong>: {match[2]}
                          </li>
                        )
                      }
                    }
                    if (paragraph.startsWith("- ")) {
                      return (
                        <li
                          key={index}
                          className="mb-2 text-gray-700 transition-colors duration-300 hover:text-[#864AF9]"
                        >
                          {paragraph.slice(2)}
                        </li>
                      )
                    }
                    if (paragraph.trim() === "") {
                      return <br key={index} />
                    }
                    return (
                      <p
                        key={index}
                        className="mb-6 leading-relaxed text-gray-700 text-lg transition-colors duration-300 hover:text-[#3B3486]"
                      >
                        {paragraph}
                      </p>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Now takes 1/4 of the width */}
          <div className="lg:col-span-1 space-y-6">
            {/* Attachments */}
            <Card className="bg-white/95 rounded-2xl shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#332941]">Materiały do pobrania</h3>
                <div className="space-y-3">
                  {post.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-[#864AF9] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#332941] break-words leading-tight">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{attachment.size}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-shrink-0 p-1 hover:bg-[#864AF9] hover:text-white transition-all duration-300 rounded-lg"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card className="bg-white/95 rounded-2xl shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#332941]">O autorze</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-[#864AF9] rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    JK
                  </div>
                  <div>
                    <p className="font-medium text-[#332941]">{post.author}</p>
                    <p className="text-sm text-gray-500">Analityk inwestycyjny</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Specjalista w dziedzinie analizy fundamentalnej z 8-letnim doświadczeniem na rynkach finansowych.
                </p>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card className="bg-white/95 rounded-2xl shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#332941]">Powiązane posty</h3>
                <div className="space-y-4">
                  <Link href="/post/2" className="block group transition-colors duration-300">
                    <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                      <p className="text-sm font-medium text-[#332941] line-clamp-2 group-hover:text-[#864AF9] transition-colors">
                        Analiza sektora bankowego - perspektywy na 2025
                      </p>
                      <p className="text-xs text-gray-500 mt-2">28 listopada 2024</p>
                    </div>
                  </Link>
                  <Link href="/post/3" className="block group transition-colors duration-300">
                    <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                      <p className="text-sm font-medium text-[#332941] line-clamp-2 group-hover:text-[#864AF9] transition-colors">
                        Jak oceniać spółki dywidendowe
                      </p>
                      <p className="text-xs text-gray-500 mt-2">25 listopada 2024</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  )
}
