"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  MessageCircle,
  Clock,
  Search,
  Facebook,
  Youtube,
  Instagram,
  Rss,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Check admin status on component mount
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    setIsAdmin(adminStatus === "true")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button
          size="lg"
          className="bg-[#864AF9] hover:bg-[#7c42e8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Top Banner */}
      <div className="bg-[#864AF9] text-white text-center py-2 text-sm font-medium">
        PROFESJONALNA WIEDZA INWESTYCYJNA
      </div>

      {/* Header with Social Icons */}
      <header className="bg-[#332941] text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm"></div>
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
                <Input placeholder="Szukaj..." className="pl-10 w-48 bg-white text-gray-900 border-0 rounded-md" />
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
          <div className="flex justify-between items-center h-14">
            <div className="flex justify-center items-center flex-1">
              <div className="flex space-x-2">
                <Link href="/" className="relative group">
                  <div className="text-gray-700 hover:text-[#864AF9] font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-[#864AF9]/10 hover:shadow-md transform hover:scale-105">
                    BLOG
                    <div className="absolute inset-0 bg-gradient-to-r from-[#864AF9]/20 to-[#3B3486]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </Link>
                <Link href="/wspolpraca" className="relative group">
                  <div className="text-gray-700 hover:text-[#864AF9] font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-[#864AF9]/10 hover:shadow-md transform hover:scale-105">
                    WSPÓŁPRACA
                    <div className="absolute inset-0 bg-gradient-to-r from-[#864AF9]/20 to-[#3B3486]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </Link>
                <Link href="/kontakt" className="relative group">
                  <div className="bg-[#864AF9] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#7c42e8] hover:shadow-lg transform hover:scale-105">
                    KONTAKT
                  </div>
                </Link>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Link href="/admin">
                  <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm">
                    Panel twórcy
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    localStorage.removeItem("isAdmin")
                    setIsAdmin(false)
                  }}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                >
                  Wyloguj
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#864AF9] to-[#3B3486] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Skontaktuj się ze mną</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in-delay">
            Masz pytania dotyczące inwestycji? Chcesz omówić konkretną analizę? Napisz do mnie - odpowiem tak szybko,
            jak to możliwe.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Informacje kontaktowe</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#864AF9] p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">jakub@inwestycje.pl</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-[#3B3486] p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Telefon</p>
                      <p className="text-gray-600">+48 123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-600 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Lokalizacja</p>
                      <p className="text-gray-600">Warszawa, Polska</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-[#864AF9]" />
                  <h3 className="text-xl font-semibold text-gray-900">Czas odpowiedzi</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Staram się odpowiadać na wszystkie wiadomości w ciągu 24 godzin. W przypadku bardziej złożonych pytań
                  może to potrwać do 48 godzin.
                </p>
                <p className="text-sm text-gray-500">Najszybciej odpowiadam w dni robocze między 9:00 a 17:00.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Często zadawane pytania</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">Czy udzielasz indywidualnych porad inwestycyjnych?</p>
                    <p className="text-sm text-gray-600">
                      Tak, oferuję konsultacje indywidualne. Skontaktuj się ze mną, aby omówić szczegóły.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium text-gray-900">Czy analizy są bezpłatne?</p>
                    <p className="text-sm text-gray-600">
                      Podstawowe analizy publikowane na blogu są bezpłatne. Szczegółowe raporty są płatne.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:order-last">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Formularz kontaktowy</CardTitle>
                <CardDescription className="text-gray-600">
                  Wypełnij formularz, a skontaktuję się z Tobą w ciągu 24 godzin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8 animate-fade-in">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Wiadomość wysłana!</h3>
                    <p className="text-gray-600">Dziękuję za kontakt. Odpowiem tak szybko, jak to możliwe.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900 font-medium">
                          Imię i nazwisko
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-gray-300 rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-900 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-gray-300 rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                          placeholder="jan@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-900 font-medium">
                        Temat
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="border-gray-300 rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                        placeholder="Pytanie dotyczące analizy PKN Orlen"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-900 font-medium">
                        Wiadomość
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="border-gray-300 rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                        placeholder="Opisz swoje pytanie lub temat, który chcesz omówić..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Wysyłanie...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Wyślij wiadomość
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Jakub Inwestycje</h4>
              <p className="text-gray-600">Platforma edukacyjna dedykowana profesjonalnej wiedzy inwestycyjnej.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Kontakt</h4>
              <p className="text-gray-600 mb-4">Masz pytania? Skontaktuj się ze mną poprzez formularz kontaktowy.</p>
              <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl">
                Formularz kontaktowy
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Jakub Inwestycje. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </footer>

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
