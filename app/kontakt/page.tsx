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
  LogOut,
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
    <div className="min-h-screen bg-background">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button
          size="lg"
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 border-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          </div>
        </Button>
      </div>

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
                <Mail className="h-4 w-4 text-text-gray hover:text-navy-blue cursor-pointer transition-colors" />
                <Facebook className="h-4 w-4 text-text-gray hover:text-navy-blue cursor-pointer transition-colors" />
                <Youtube className="h-4 w-4 text-text-gray hover:text-navy-blue cursor-pointer transition-colors" />
                <Instagram className="h-4 w-4 text-text-gray hover:text-navy-blue cursor-pointer transition-colors" />
                <Rss className="h-4 w-4 text-text-gray hover:text-navy-blue cursor-pointer transition-colors" />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray h-4 w-4" />
                <Input placeholder="Szukaj..." className="pl-10 w-48 bg-background text-foreground border border-border rounded-md shadow-sm focus:border-navy-blue focus:ring-1 focus:ring-navy-blue" />
              </div>
              {isAdmin && (
                <Button
                  onClick={() => {
                    localStorage.removeItem("isAdmin")
                    setIsAdmin(false)
                  }}
                  size="sm"
                  className="group relative overflow-hidden border-2 border-border bg-transparent text-foreground hover:text-white hover:border-destructive transition-all duration-300 rounded-xl shadow-sm hover:shadow-lg transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive to-destructive/80 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                  <div className="relative flex items-center">
                    <LogOut className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-12" />
                    Wyloguj
                  </div>
                </Button>
              )}
              <Link href="/admin/login">
                <Button
                  size="sm"
                  className="group relative overflow-hidden border-2 border-border bg-transparent text-foreground hover:text-white hover:border-primary transition-all duration-300 rounded-xl shadow-sm hover:shadow-lg transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                  <div className="relative flex items-center">
                    <Settings className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-90" />
                    Panel administratora
                  </div>
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
          <div className="flex justify-between items-center h-14">
            <div className="flex justify-center items-center flex-1">
              <div className="flex space-x-2">
                <Link href="/" className="relative group" prefetch={true}>
                  <div className="text-foreground hover:text-primary font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:shadow-md transform hover:scale-105">
                    BLOG
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </Link>
                <Link href="/wspolpraca" className="relative group">
                  <div className="text-foreground hover:text-primary font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:shadow-md transform hover:scale-105">
                    WSPÓŁPRACA
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </Link>
                <Link href="/kontakt" className="relative group">
                  <div className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-lg transform hover:scale-105">
                    KONTAKT
                  </div>
                </Link>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2 ml-auto">
                <Link href="/admin">
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 border-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">Panel twórcy</div>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Skontaktuj się ze mną</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in-delay">
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
                <h3 className="text-xl font-semibold text-foreground mb-6">Informacje kontaktowe</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground">jakub@inwestycje.pl</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-accent p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Telefon</p>
                      <p className="text-muted-foreground">+48 123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-accent p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Lokalizacja</p>
                      <p className="text-muted-foreground">Warszawa, Polska</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">Czas odpowiedzi</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Staram się odpowiadać na wszystkie wiadomości w ciągu 24 godzin. W przypadku bardziej złożonych pytań
                  może to potrwać do 48 godzin.
                </p>
                <p className="text-sm text-muted-foreground">Najszybciej odpowiadam w dni robocze między 9:00 a 17:00.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Często zadawane pytania</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-foreground">Czy udzielasz indywidualnych porad inwestycyjnych?</p>
                    <p className="text-sm text-muted-foreground">
                      Tak, oferuję konsultacje indywidualne. Skontaktuj się ze mną, aby omówić szczegóły.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium text-foreground">Czy analizy są bezpłatne?</p>
                    <p className="text-sm text-muted-foreground">
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
                <CardTitle className="text-2xl font-bold text-foreground">Formularz kontaktowy</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Wypełnij formularz, a skontaktuję się z Tobą w ciągu 24 godzin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8 animate-fade-in">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Wiadomość wysłana!</h3>
                    <p className="text-muted-foreground">Dziękuję za kontakt. Odpowiem tak szybko, jak to możliwe.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                          Imię i nazwisko
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-border rounded-xl focus:border-primary transition-colors duration-300"
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-border rounded-xl focus:border-primary transition-colors duration-300"
                          placeholder="jan@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-foreground font-medium">
                        Temat
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="border-border rounded-xl focus:border-primary transition-colors duration-300"
                        placeholder="Pytanie dotyczące analizy PKN Orlen"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground font-medium">
                        Wiadomość
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="border-border rounded-xl focus:border-primary transition-colors duration-300"
                        placeholder="Opisz swoje pytanie lub temat, który chcesz omówić..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white transition-all duration-500 rounded-2xl px-8 py-3 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:opacity-70 border-0"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Wysyłanie...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                            Wyślij wiadomość
                          </div>
                        )}
                      </div>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Jakub Inwestycje</h4>
              <p className="text-muted-foreground">Platforma edukacyjna dedykowana profesjonalnej wiedzy inwestycyjnej.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Kontakt</h4>
              <p className="text-muted-foreground mb-4">Masz pytania? Skontaktuj się ze mną poprzez formularz kontaktowy.</p>
              <Button className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground transition-all duration-300 rounded-xl px-6 py-2.5 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 border-0">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">Formularz kontaktowy</div>
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-muted-foreground">
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
