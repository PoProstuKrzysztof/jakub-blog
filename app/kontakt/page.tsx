"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  MessageCircle,
  Calendar,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Shield,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function ContactPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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
      <SiteHeader 
        currentPage="contact"
        showSearch={false}
        searchPlaceholder="Szukaj informacji kontaktowych..."
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10  border-primary/20 px-4 py-2 rounded-full text-sm font-medium">
                💬 Skontaktuj się bezpośrednio
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Masz pytania o <span className="text-primary">inwestowanie</span>?
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Napisz do mnie – odpowiem w ciągu 24 godzin. Czy to pytanie o konkretną analizę, 
                chęć umówienia konsultacji, czy ogólne zagadnienia inwestycyjne – jestem tutaj, aby pomóc.
              </p>
            </div>

            {/* Response Time Highlight */}
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-foreground">Odpowiedź w 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-foreground">Bezpłatna konsultacja wstępna</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-foreground">Dni robocze 9:00-17:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Contact Card */}
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Informacje kontaktowe</h3>
                  <p className="text-muted-foreground">Najszybsze sposoby na skontaktowanie się ze mną</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-background rounded-xl group-hover:bg-card/50 transition-colors duration-300">
                    <div className="bg-primary p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-muted-foreground">jakub@inwestycje.pl</p>
                      <p className="text-xs text-green-600 mt-1">Odpowiedź w ciągu 2-4h</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-background rounded-xl group-hover:bg-card/50 transition-colors duration-300">
                    <div className="bg-green-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Telefon</p>
                      <p className="text-muted-foreground">+48 123 456 789</p>
                      <p className="text-xs text-green-600 mt-1">Dni robocze 9:00-17:00</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-background rounded-xl group-hover:bg-card/50 transition-colors duration-300">
                    <div className="bg-blue-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Lokalizacja</p>
                      <p className="text-muted-foreground">Warszawa, Polska</p>
                      <p className="text-xs text-blue-600 mt-1">Konsultacje online i stacjonarne</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/wspolpraca">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Współpraca</h4>
                    <p className="text-sm text-muted-foreground">Konsultacje i analizy</p>
                  </CardContent>
                </Card>
              </Link>

                              <Link href="/wpisy">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                      <Lightbulb className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Blog</h4>
                    <p className="text-sm text-muted-foreground">Analizy i poradniki</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* FAQ Section */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <MessageCircle className="h-5 w-5 text-primary mr-2" />
                  Często zadawane pytania
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-background rounded-xl">
                    <p className="font-medium text-foreground mb-2">Czy udzielasz indywidualnych porad inwestycyjnych?</p>
                    <p className="text-sm text-muted-foreground">
                      Tak, oferuję konsultacje indywidualne dostosowane do Twojego profilu ryzyka i celów finansowych. 
                      Skontaktuj się ze mną, aby omówić szczegóły.
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-xl">
                    <p className="font-medium text-foreground mb-2">Czy analizy są bezpłatne?</p>
                    <p className="text-sm text-muted-foreground">
                      Podstawowe analizy publikowane na blogu są bezpłatne. Szczegółowe, spersonalizowane raporty 
                      są częścią płatnych usług konsultacyjnych.
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-xl">
                    <p className="font-medium text-foreground mb-2">Jak długo trwa konsultacja?</p>
                    <p className="text-sm text-muted-foreground">
                      Standardowa konsultacja trwa 60 minut. W przypadku bardziej złożonych zagadnień 
                      możemy przedłużyć sesję lub umówić dodatkowe spotkania.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:order-last">
            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 sticky top-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-foreground">Napisz do mnie</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Wypełnij formularz, a skontaktuję się z Tobą w ciągu 24 godzin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Wiadomość wysłana!</h3>
                    <p className="text-muted-foreground mb-6">
                      Dziękuję za kontakt. Odpowiem tak szybko, jak to możliwe.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                      <Clock className="h-4 w-4" />
                      <span>Czas odpowiedzi: 2-24 godziny</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground font-medium">
                          Imię i nazwisko *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground font-medium">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                          placeholder="jan@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-foreground font-medium">
                        Temat *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        placeholder="Pytanie dotyczące analizy PKN Orlen"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-foreground font-medium">
                        Wiadomość *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                        placeholder="Opisz swoje pytanie lub temat, który chcesz omówić..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 rounded-xl px-8 py-4 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                          <span>Wysyłanie...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Send className="h-5 w-5" />
                          <span>Wyślij wiadomość</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Wysyłając formularz, zgadzasz się na przetwarzanie danych w celu odpowiedzi na Twoje pytanie
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <section className="mt-20 py-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Dlaczego warto się skontaktować?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dołącz do tysięcy zadowolonych inwestorów, którzy skorzystali z moich usług
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "8+ lat doświadczenia",
                description: "Profesjonalna analiza rynków finansowych",
                color: "text-blue-600"
              },
              {
                icon: Users,
                title: "1000+ konsultacji",
                description: "Zadowoleni klienci na całym świecie",
                color: "text-green-600"
              },
              {
                icon: TrendingUp,
                title: "15.2% średnia stopa zwrotu",
                description: "Potwierdzona skuteczność rekomendacji",
                color: "text-purple-600"
              },
              {
                icon: Star,
                title: "4.9/5 ocena",
                description: "Najwyższa jakość usług",
                color: "text-orange-600"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
