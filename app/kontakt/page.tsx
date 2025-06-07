"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  MessageCircle,
  Search,
  LogOut,
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

  // Check admin status on component mount
  useEffect(() => {
    // Admin status is now handled by useAuth hook
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
      <SiteHeader 
        currentPage="contact"
        showSearch={true}
        searchPlaceholder="Szukaj informacji kontaktowych..."
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-16">
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
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 rounded-2xl px-8 py-3 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                    >
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
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                Formularz kontaktowy
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
