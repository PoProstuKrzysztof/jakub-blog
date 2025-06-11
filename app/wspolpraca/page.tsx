"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import {
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Clock,
  FileText,
  Trash2,
  MessageCircle,
  Edit,
  Plus,
  Calendar,
  ArrowRight,
  Shield,
  Target,
  Award,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

interface Service {
  id: number
  title: string
  description: string
  price: string
  priceNote: string
  features: string[]
  color: string
  icon: string
  popular?: boolean
}

export default function CooperationPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Indywidualna analiza portfela",
      description:
        "Spersonalizowana analiza Twojej strategii inwestycyjnej z uwzględnieniem celów, horyzontu czasowego i tolerancji ryzyka. Otrzymasz szczegółowy raport z rekomendacjami dostosowanymi do Twojej sytuacji.",
      price: "499 zł",
      priceNote: "jednorazowo",
      features: [
        "Analiza obecnego portfela inwestycyjnego",
        "Rekomendacje dostosowane do profilu ryzyka",
        "Plan dywersyfikacji i optymalizacji",
        "Konsultacja online (60 min)",
        "PDF raport z rekomendacjami",
      ],
      color: "from-blue-500 to-blue-600",
      icon: "Users",
      popular: true,
    },
    {
      id: 2,
      title: "Przegląd spółek",
      description:
        "Kompleksowy przegląd wybranych spółek z analizą fundamentalną, techniczną oraz rekomendacjami inwestycyjnymi. Idealne dla inwestorów szukających konkretnych okazji rynkowych.",
      price: "299 zł",
      priceNote: "za spółkę",
      features: [
        "Analiza fundamentalna spółki",
        "Ocena techniczna i poziomy wsparcia/oporu",
        "Wycena i potencjał wzrostu",
        "Szczegółowy raport PDF",
        "Prognoza na 12-24 miesięcy",
      ],
      color: "from-green-500 to-green-600",
      icon: "TrendingUp",
    },
    {
      id: 3,
      title: "Pakiet edukacyjny",
      description:
        "Kompleksowy program edukacyjny obejmujący podstawy i zaawansowane strategie inwestowania. Idealne dla osób rozpoczynających przygodę z rynkiem kapitałowym.",
      price: "899 zł",
      priceNote: "pakiet",
      features: [
        "8 modułów edukacyjnych",
        "Case studies i praktyczne przykłady",
        "Dostęp do społeczności inwestorów",
        "Miesięczne webinaria Q&A",
        "Certyfikat ukończenia",
      ],
      color: "from-purple-500 to-purple-600",
      icon: "Award",
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="cooperation"
        showSearch={false}
        searchPlaceholder="Szukaj usług, informacji..."
        showEditButton={user ? true : false}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium">
                🚀 Profesjonalne usługi inwestycyjne
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Rozwijaj się ze mną <span className="text-primary">finansowo</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Profesjonalne usługi doradcze i analityczne dostosowane do Twoich potrzeb inwestycyjnych. 
                Skorzystaj z mojego 8-letniego doświadczenia, aby podejmować lepsze decyzje finansowe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Umów konsultację
              </Button>
              <Link href="/kontakt">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-border hover:border-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-primary/5"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Skontaktuj się
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">15.2%</div>
                <div className="text-sm text-muted-foreground">Średnia stopa zwrotu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">Zadowolonych klientów</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">4.9/5</div>
                <div className="text-sm text-muted-foreground">Ocena usług</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Services Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Wybierz usługę dla siebie
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Od analiz spółek po indywidualne konsultacje – wszystko czego potrzebujesz do inteligentnego inwestowania
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className={`border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden ${
                  service.popular ? 'ring-2 ring-primary ring-opacity-50' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                      ⭐ Najpopularniejsza
                    </Badge>
                  </div>
                )}

                {user && isEditing && (
                  <div className="absolute top-2 right-2 z-10 flex space-x-1">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground p-1 h-8 w-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setServices(services.filter((s) => s.id !== service.id))}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-1 h-8 w-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon === "Users" && <Users className="h-10 w-10 text-white" />}
                      {service.icon === "TrendingUp" && <TrendingUp className="h-10 w-10 text-white" />}
                      {service.icon === "Award" && <Award className="h-10 w-10 text-white" />}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {service.price}
                    </div>
                    <div className="text-sm text-muted-foreground">{service.priceNote}</div>
                  </div>

                  <Link href="/kontakt" className="block">
                    <Button
                      className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white transition-all duration-500 rounded-xl px-8 py-3 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105`}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {index === 0 ? "Zamów analizę" : index === 1 ? "Zamów przegląd" : "Rozpocznij naukę"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {user && isEditing && (
            <div className="text-center">
              <Button
                onClick={() => {
                  const newService: Service = {
                    id: Date.now(),
                    title: "Nowa usługa",
                    description: "Opis nowej usługi",
                    price: "0 zł",
                    priceNote: "jednorazowo",
                    features: ["Funkcja 1", "Funkcja 2"],
                    color: "from-gray-500 to-gray-600",
                    icon: "Users",
                  }
                  setServices([...services, newService])
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 rounded-xl px-8 py-3 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj usługę
              </Button>
            </div>
          )}
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Jak przebiega współpraca?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Prosty, przejrzysty proces współpracy zapewniający najwyższą jakość usług
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Kontakt i omówienie potrzeb",
                description: "Krótka rozmowa o Twoich celach i oczekiwaniach",
                icon: MessageCircle,
                color: "text-blue-600"
              },
              {
                step: "02", 
                title: "Przesłanie materiałów",
                description: "Otrzymuję niezbędne informacje do analizy",
                icon: FileText,
                color: "text-green-600"
              },
              {
                step: "03",
                title: "Analiza i przygotowanie",
                description: "Szczegółowa analiza i przygotowanie raportu",
                icon: Target,
                color: "text-purple-600"
              },
              {
                step: "04",
                title: "Prezentacja wyników",
                description: "Omówienie wyników i rekomendacji",
                icon: Star,
                color: "text-orange-600"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Często zadawane pytania
            </h2>
            <p className="text-xl text-muted-foreground">
              Odpowiedzi na najczęściej zadawane pytania dotyczące moich usług
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "Jak długo trwa przygotowanie analizy?",
                answer: "Analiza strategii portfela trwa 5-7 dni roboczych, przegląd spółki 3-5 dni roboczych."
              },
              {
                question: "Czy oferujesz gwarancję zwrotu?",
                answer: "Tak, jeśli nie będziesz zadowolony z jakości usługi, zwracam 100% kwoty w ciągu 14 dni."
              },
              {
                question: "Czy mogę umówić konsultację telefoniczną?",
                answer: "Oczywiście! Oferuję konsultacje zarówno online (Zoom/Teams) jak i telefoniczne."
              },
              {
                question: "Czy analizy są aktualizowane?",
                answer: "Tak, klienci otrzymują bezpłatne aktualizacje analiz przez 3 miesiące od daty zakupu."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-accent text-white rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">
            Gotowy na następny krok w inwestowaniu?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Skontaktuj się ze mną już dziś i rozpocznij profesjonalną przygodę z rynkiem kapitałowym
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kontakt">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Skontaktuj się
              </Button>
            </Link>
                            <Link href="/wpisy">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                <Lightbulb className="mr-2 h-5 w-5" />
                Zobacz analizy
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
