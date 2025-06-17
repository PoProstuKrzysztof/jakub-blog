"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/common/site-header"
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
  Quote,
  Award,
  BookOpen,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-primary/10 border-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              💬 Skontaktuj się ze mną
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Masz pytania o <span className="text-primary">inwestycje</span>?
            </h1>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Jestem tutaj, aby pomóc Ci w podejmowaniu mądrych decyzji inwestycyjnych. 
              Skontaktuj się ze mną w sprawie konsultacji, współpracy lub pytań dotyczących analizy rynków finansowych.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="text-center p-3 sm:p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">24h</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Czas odpowiedzi</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">8+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Lat doświadczenia</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Zadowolonych klientów</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">95%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Skuteczność porad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Contact Form - Mobile Optimized */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="p-4 sm:p-6 lg:p-8">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-4">
                  Wyślij wiadomość
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Wypełnij formularz poniżej, a odpowiem w ciągu 24 godzin
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8 pt-0">
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs sm:text-sm font-medium">
                        Imię *
                      </Label>
                      <Input 
                        id="firstName"
                        placeholder="Twoje imię"
                        className="rounded-xl border-border text-sm sm:text-base touch-manipulation tap-highlight-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs sm:text-sm font-medium">
                        Nazwisko *
                      </Label>
                      <Input 
                        id="lastName"
                        placeholder="Twoje nazwisko"
                        className="rounded-xl border-border text-sm sm:text-base touch-manipulation tap-highlight-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm font-medium">
                      Email *
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      className="rounded-xl border-border text-sm sm:text-base touch-manipulation tap-highlight-none"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">
                      Telefon
                    </Label>
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="+48 123 456 789"
                      className="rounded-xl border-border text-sm sm:text-base touch-manipulation tap-highlight-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs sm:text-sm font-medium">
                      Temat *
                    </Label>
                    <Select>
                      <SelectTrigger className="rounded-xl border-border text-sm sm:text-base touch-manipulation">
                        <SelectValue placeholder="Wybierz temat wiadomości" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Konsultacja inwestycyjna</SelectItem>
                        <SelectItem value="analysis">Analiza portfela</SelectItem>
                        <SelectItem value="education">Edukacja finansowa</SelectItem>
                        <SelectItem value="cooperation">Współpraca biznesowa</SelectItem>
                        <SelectItem value="media">Współpraca medialna</SelectItem>
                        <SelectItem value="other">Inne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs sm:text-sm font-medium">
                      Wiadomość *
                    </Label>
                    <Textarea 
                      id="message"
                      placeholder="Opisz szczegółowo, w czym mogę Ci pomóc..."
                      rows={6}
                      className="rounded-xl border-border resize-none text-sm sm:text-base touch-manipulation tap-highlight-none"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold touch-manipulation tap-highlight-none"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Wyślij wiadomość
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex-1 sm:flex-none border-border rounded-xl px-6 sm:px-8 py-3 text-sm sm:text-base touch-manipulation tap-highlight-none"
                    >
                      Wyczyść formularz
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Additional Content - Mobile Optimized */}
          <div className="space-y-6 sm:space-y-8">
            
            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-4">
                  Informacje kontaktowe
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-1">Email</h4>
                    <a 
                      href="mailto:kontakt@jakubblog.pl" 
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
                    >
                      kontakt@jakubblog.pl
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-1">Telefon</h4>
                    <a 
                      href="tel:+48123456789" 
                      className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
                    >
                      +48 123 456 789
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-1">Lokalizacja</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Warszawa, Polska
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-foreground mb-1">Godziny pracy</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Pon-Pt: 9:00 - 18:00<br />
                      Sob-Ndz: Na umówienie
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-4">
                  Obserwuj mnie
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <a 
                    href="#" 
                    className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors touch-manipulation tap-highlight-none"
                  >
                    <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium text-blue-600">Facebook</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors touch-manipulation tap-highlight-none"
                  >
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium text-sky-600">Twitter</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors touch-manipulation tap-highlight-none"
                  >
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium text-blue-600">LinkedIn</span>
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors touch-manipulation tap-highlight-none"
                  >
                    <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium text-red-600">YouTube</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Quick Services */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-4">
                  Moje usługi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground">Konsultacje inwestycyjne</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground">Analiza portfela</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground">Edukacja finansowa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground">Analizy spółek</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground">Strategie inwestycyjne</span>
                </div>
                
                <div className="pt-3 sm:pt-4">
                  <Link href="/wspolpraca">
                    <Button 
                      variant="outline" 
                      className="w-full border-border rounded-xl text-xs sm:text-sm touch-manipulation tap-highlight-none"
                    >
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Zobacz pełną ofertę
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Testimonials Section - Mobile Optimized */}
      <section className="bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Co mówią o mnie klienci
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Opinie zadowolonych inwestorów
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                name: "Anna Kowalska",
                role: "Inwestor indywidualny",
                content: "Dzięki poradom Jakuba zwiększyłam rentowność portfela o 25% w ciągu roku. Profesjonalne podejście i konkretne wskazówki.",
                rating: 5
              },
              {
                name: "Marcin Nowak",
                role: "Przedsiębiorca",
                content: "Analizy spółek są bardzo szczegółowe i pomocne. Jakub ma świetne oko do wykrywania potencjału wzrostowego.",
                rating: 5
              },
              {
                name: "Katarzyna Wiśniewska",
                role: "Inwestor początkujący",
                content: "Świetna edukacja finansowa dla początkujących. Wszystko wyjaśnione w prosty i zrozumiały sposób.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex space-x-1 mr-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Gotowy na rozmowę?
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Zacznijmy współpracę już dziś. Skontaktuj się ze mną, aby omówić Twoje cele inwestycyjne 
            i wspólnie wypracować strategię sukcesu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto touch-manipulation tap-highlight-none">
              <Calendar className="h-4 w-4 mr-2" />
              Umów konsultację
            </Button>
            <Link href="/wspolpraca">
              <Button variant="outline" size="lg" className="w-full sm:w-auto touch-manipulation tap-highlight-none">
                <BookOpen className="h-4 w-4 mr-2" />
                Zobacz ofertę
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
