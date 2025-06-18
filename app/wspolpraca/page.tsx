"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { SiteHeader } from "@/components/common/site-header"
import {
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Clock,
  FileText,
  MessageCircle,
  Calendar,
  ArrowRight,
  Shield,
  Target,
  Award,
  Lightbulb,
  BarChart3,
  BookOpen,
  AlertTriangle,
  PieChart,
  TrendingDown,
  DollarSign,
  Zap,
  Lock,
  Repeat,
  Eye,
  Calculator,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Layers,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"

interface Service {
  id: number
  title: string
  description: string
  price: string
  originalPrice?: string
  priceNote: string
  features: string[]
  color: string
  icon: string
  popular?: boolean
  type: 'jednorazowa' | 'subskrypcja'
  ctaText: string
  badge?: string
  featured?: boolean
}

// Service Item Component
function ServiceItem({ service }: { service: Service }) {
  return (
    <Card
      className={`border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden ${
        service.popular ? 'ring-4 ring-primary ring-opacity-50 scale-105' : ''
      } ${
        service.featured ? 'ring-8 ring-gradient-to-r ring-yellow-400 ring-opacity-70 shadow-yellow-200/50 shadow-2xl' : ''
      }`}
    >
      {service.badge && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
          <Badge className={`${service.featured ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse' : service.popular ? 'bg-primary text-primary-foreground' : 'bg-purple-600 text-white'} px-4 py-1 text-xs font-semibold rounded-b-lg text-center whitespace-nowrap shadow-lg`}>
            {service.badge}
          </Badge>
        </div>
      )}

      {service.featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg">
            ⭐ POLECANE
          </div>
        </div>
      )}

      <div className={`absolute inset-0 ${service.featured ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gradient-to-br from-primary/5 to-accent/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      {service.featured && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 to-orange-100/30 pointer-events-none"></div>
      )}
      
      <CardContent className="p-8 relative z-10 pt-12 flex flex-col h-full">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {service.icon === "Target" && <Target className="h-10 w-10 text-white" />}
            {service.icon === "BarChart3" && <BarChart3 className="h-10 w-10 text-white" />}
            {service.icon === "BookOpen" && <BookOpen className="h-10 w-10 text-white" />}
            {service.icon === "Layers" && <Layers className="h-10 w-10 text-white" />}
            {service.icon === "GraduationCap" && <GraduationCap className="h-10 w-10 text-white" />}
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {service.title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed text-sm">
            {service.description}
          </p>
        </div>

        <div className="space-y-3 mb-8 flex-grow">
          {service.features.map((feature, idx) => (
            <div key={idx} className="flex items-start text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-foreground mb-1">
              {service.price}
              {service.originalPrice && (
                <span className="text-lg text-gray-400 line-through ml-2">
                  {service.originalPrice}
                </span>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">{service.priceNote}</div>
            {service.type === 'subskrypcja' && (
              <div className="text-xs text-purple-600 font-medium">
                • Można anulować w każdej chwili
              </div>
            )}
          </div>

          <Link href="/kontakt" className="block">
            <Button
              className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white transition-all duration-500 rounded-xl px-8 py-4 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg`}
            >
              {service.popular && <Sparkles className="mr-2 h-4 w-4" />}
              {service.ctaText}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CooperationPage() {
  const [showSubscriptions, setShowSubscriptions] = useState(false)

  const jednorazoweServices: Service[] = [
    {
      id: 2,
      title: "Konsultacja Majątkowa-Edukacyjna",
      description:
        "Inwestowanie bywa wyzwaniem, zwłaszcza gdy zaczynasz przygodę z rynkami. Ta konsultacja pomoże Ci zrozumieć zasady gry i pewniej budować własny portfel. Nie obiecuję łatwych zysków – nauczę Cię, jak krok po kroku analizować własne podejście do ryzyka i samodzielnie zarządzać inwestycjami.",
      price: "899 zł",
      priceNote: "jednorazowo",
      type: "jednorazowa",
      ctaText: "Zarezerwuj konsultację",
      badge: "NAJLEPSZA WARTOŚĆ",
      features: [
        "Analiza profilu inwestycyjnego - poznaj swoje podejście do ryzyka",
        "Modelowe portfele dopasowane do Twojej strategii",
        "Konkretne przykłady funduszy ETF i papierów wartościowych",
        "Pakiet informacji 'krok po kroku' - jak założyć konto maklerskie",
        "Materiały edukacyjne: e-booki, prezentacje, poradniki wideo",
        "Instrukcje dotyczące prowizji i platform inwestycyjnych",
      ],
      color: "from-blue-600 to-blue-700",
      icon: "Target",
      popular: true,
      featured: true,
    },
    {
      id: 5,
      title: "Pakiet Biedny Student",
      description: 
        "Młody inwestor z ograniczonym budżetem, ale ogromnymi ambicjami? Ten pakiet to kompleksowy zestaw wszystkich kluczowych usług w jednym - za ułamek ceny. Pełne wsparcie merytoryczne i praktyczne narzędzia, które przygotują Cię do samodzielnego inwestowania.",
      price: "2500 zł",
      originalPrice: "3500 zł",
      priceNote: "jednorazowo - oszczędzasz 30%", 
      type: "jednorazowa",
      ctaText: "Rozpocznij przygodę",
      badge: "NAJLEPSZA OFERTA",
      features: [
        "Indywidualna konsultacja finansowa (wartość 899 zł) - analiza ryzyka i portfele modelowe",
        "Roczny dostęp do mojego portfela inwestycyjnego (wartość 1400 zł) - uczenie na prawdziwych przykładach",
        "Roczne wsparcie strategiczne (wartość 900 zł) - comiesięczny mentoring i opieka nad strategią",
        "Prenumerata raportów kwartalnych na rok (wartość 150 zł) - analizy i wnioski rynkowe",
        "Pakiet edukacyjny na start (wartość 100 zł) - solidne podstawy teoretyczne i praktyczne",
      ],
      color: "from-emerald-600 to-teal-600", 
      icon: "GraduationCap",
      popular: true,
      featured: true,
    },
    {
      id: 3,
      title: "Pakiet Startowy",
      description: 
        "Podstawowa wiedza inwestycyjna w przystępnej cenie. Idealne dla osób, które chcą zacząć, ale nie są gotowe na pełną konsultację. Zawiera najważniejsze informacje do samodzielnego startu.",
      price: "300 zł",
      priceNote: "jednorazowo", 
      type: "jednorazowa",
      ctaText: "Rozpocznij naukę",
      features: [
        "Podstawy inwestowania - e-book 50+ stron",
        "Poradnik wyboru pierwszych inwestycji",
        "Lista rekomendowanych brokerów i platform",
        "Kalkulator ryzyka inwestycyjnego",
        "Dostęp do webinarium grupowego (2h)",
      ],
      color: "from-green-600 to-green-700", 
      icon: "BookOpen",
    },
    {
      id: 4,
      title: "Dostęp do modeli",
      description: 
        "Gotowy zestaw autorskich modeli inwestycyjnych – stworzonych na bazie doświadczenia i przetestowanych w praktyce. Proste narzędzia, które pomogą Ci zrozumieć, jak może wyglądać przykładowy portfel inwestycyjny.",
      price: "300 zł",
      priceNote: "jednorazowo", 
      type: "jednorazowa",
      ctaText: "Zakup modele",
      features: [
        "Zestaw modeli portfeli - różne podejścia inwestycyjne (pasywny, defensywny, dynamiczny)",
        "Gotowe struktury alokacji aktywów - podział między akcje, obligacje, ETF-y",
        "Praktyczne szablony do organizacji własnego podejścia",
        "Materiały w formie plików do analizy we własnym tempie",
        "Uniwersalne modele edukacyjne jako punkt wyjścia do nauki",
      ],
      color: "from-orange-600 to-orange-700", 
      icon: "Layers",
    },
  ]

  const subskrypcyjneServices: Service[] = [
    {
      id: 1,
      title: "Wsparcie Inwestycyjne",
      description:
        "Dla tych, którzy chcą mieć pewność, że ich inwestycje są na właściwej ścieżce. Regularne monitorowanie, raporty kwartalne i wsparcie przy zmianach strategii. Idealne uzupełnienie po konsultacji głównej.",
      price: "297 zł",
      priceNote: "miesięcznie",
      type: "subskrypcja",
      ctaText: "Rozpocznij subskrypcję",
      badge: "NAJLEPSZA WARTOŚĆ",
      features: [
        "Monitorowanie portfela - śledzenie wyników Twoich inwestycji",
        "Raporty kwartalne z analizą osiągnięć i wykresami",
        "Wsparcie przy modyfikacjach portfela",
        "Pomoc podatkowa - rozliczenie zysków kapitałowych (PIT-38)",
        "Priorytetowy kontakt mailowy/telefoniczny",
        "Dostęp do ekskluzywnych materiałów edukacyjnych",
      ],
      color: "from-purple-600 to-purple-700",
      icon: "BarChart3",
      popular: true,
    },
  ]

  const currentServices = showSubscriptions ? subskrypcyjneServices : jednorazoweServices

  const problemPoints = [
    {
      icon: AlertTriangle,
      title: "Nie wiesz od czego zacząć?",
      description: "Tysiące artykułów, influencerów i 'ekspertów' - każdy mówi co innego. Trudno odróżnić prawdziwe rady od marketingu."
    },
    {
      icon: TrendingDown,
      title: "Straciłeś już pieniądze?",
      description: "Kupiłeś na szczycie, sprzedałeś w panice? Emocje to największy wróg inwestora. Czas na systematyczne podejście."
    },
    {
      icon: PieChart,
      title: "Brakuje Ci strategii?",
      description: "Kupujesz losowe akcje bez planu? Prawdziwe bogactwo buduje się przez dywersyfikację i długoterminowe myślenie."
    }
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Praktyczna wiedza",
      description: "Otrzymujesz komplet materiałów w przystępny sposób objaśniających skomplikowane zagadnienia."
    },
    {
      icon: Eye,
      title: "Ciągłe wsparcie",
      description: "Nie zostawiam Cię z wiedzą tylko na papierze. Regularne raporty i wsparcie w razie potrzeby."
    },
    {
      icon: Clock,
      title: "Oszczędność czasu",
      description: "Zamiast godzin poszukiwań, otrzymujesz skondensowaną porcję najważniejszych informacji."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="cooperation"
        showSearch={false}
        searchPlaceholder="Szukaj usług, informacji..."
      />

      {/* Hero Section - Problem Aware */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-10">
            <div className="space-y-8">
              <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2 rounded-full text-sm sm:text-base font-medium">
                ⚠️ 87% początkujących inwestorów traci pieniądze w pierwszym roku
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Przestań <span className="text-red-600">tracić pieniądze</span><br/>
                na inwestycjach
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                <strong>Inwestowanie nie musi być hazardem.</strong> Dzięki sprawdzonej metodologii i 8-letniemu doświadczeniu 
                nauczysz się budować portfel systematycznie, bez emocji i kosztownych błędów.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link href="/kontakt">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Zarezerwuj konsultację już dziś
                </Button>
              </Link>
              <Link href="#cennik">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-border hover:border-primary px-6 sm:px-8 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 hover:bg-primary/5 w-full sm:w-auto"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Zobacz cennik
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">150+</div>
                <div className="text-sm sm:text-base text-muted-foreground">Przeprowadzonych konsultacji</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">4.9/5</div>
                <div className="text-sm sm:text-base text-muted-foreground">Średnia ocena klientów</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">92%</div>
                <div className="text-sm sm:text-base text-muted-foreground">Klientów poleca znajomym</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Problem Section */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Czy to brzmi znajomo?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {problemPoints.map((problem, index) => (
              <Card key={index} className="border-l-4 border-l-red-500 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                      <problem.icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{problem.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{problem.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 max-w-4xl mx-auto">
              <p className="text-base sm:text-lg text-gray-800">
                <strong>Jeśli chociaż jeden punkt Cię dotyczy</strong>, to znaczy, że potrzebujesz systematycznego podejścia do inwestowania. 
                Nie kolejnych tipów czy "hot stocków" - ale solidnych fundamentów.
              </p>
            </div>
          </div>
        </section>

        {/* Solution/Benefits Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl mb-16 sm:mb-20">
          <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Jak mogę Ci pomóc?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              8 lat doświadczenia, setki błędów popełnionych za Ciebie i sprawdzona metodologia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 shadow-lg flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="cennik" className="py-16 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Wybierz pakiet dla siebie
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Każdy pakiet został zaprojektowany tak, aby dostarczyć maksymalną wartość na różnych etapach Twojej inwestycyjnej podróży
            </p>
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg font-medium transition-colors duration-300 ${!showSubscriptions ? 'text-primary' : 'text-muted-foreground'}`}>
                Płatności jednorazowe
              </span>
              <Switch
                checked={showSubscriptions}
                onCheckedChange={setShowSubscriptions}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className={`text-lg font-medium transition-colors duration-300 ${showSubscriptions ? 'text-primary' : 'text-muted-foreground'}`}>
                Subskrypcje
              </span>
            </div>
          </div>

                                {/* Services Grid with Animation */}
           <div className="relative min-h-[600px]">
             <div 
               className={`transition-all duration-700 ease-in-out ${
                 showSubscriptions ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
               }`}
               style={{ 
                 position: showSubscriptions ? 'absolute' : 'relative',
                 width: '100%',
                 pointerEvents: showSubscriptions ? 'none' : 'auto'
               }}
             >
               {/* Górny rząd - główne oferty (featured) */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                 {jednorazoweServices.filter(service => service.featured).map((service) => (
                   <ServiceItem key={service.id} service={service} />
                 ))}
               </div>
               
               {/* Dolny rząd - pozostałe oferty */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {jednorazoweServices.filter(service => !service.featured).map((service) => (
                   <ServiceItem key={service.id} service={service} />
                 ))}
               </div>
             </div>

                                      <div 
               className={`flex justify-center transition-all duration-700 ease-in-out ${
                 showSubscriptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
               }`}
               style={{ 
                 position: showSubscriptions ? 'relative' : 'absolute',
                 width: '100%',
                 top: showSubscriptions ? 0 : '0',
                 pointerEvents: showSubscriptions ? 'auto' : 'none'
               }}
             >
               <div className="w-full max-w-md">
                 {subskrypcyjneServices.map((service) => (
                   <ServiceItem key={service.id} service={service} />
                 ))}
               </div>
             </div>
          </div>
        </section>

        {/* Risk Reversal Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-3xl mb-16 sm:mb-20">
          <div className="text-center px-4 sm:px-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Gwarancja satysfakcji 100%</h2>
            <p className="text-lg sm:text-xl opacity-90 mb-4 sm:mb-6 max-w-3xl mx-auto">
              Jeśli po konsultacji nie będziesz zadowolony z otrzymanej wiedzy i materiałów, 
              zwrócę Ci <strong>100% wpłaconej kwoty</strong> w ciągu 7 dni. Bez pytań, bez problemów.
            </p>
            <div className="text-xs sm:text-sm opacity-80">
              * Gwarancja obowiązuje dla usługi głównej przez 7 dni od daty konsultacji
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl mb-16 sm:mb-20">
          <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Jak przebiega współpraca?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Prosty, przejrzysty proces współpracy zapewniający najwyższą jakość usług
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
            {[
              {
                step: "01",
                title: "Kontakt i omówienie potrzeb",
                description: "Krótka rozmowa o Twoich celach, doświadczeniu i oczekiwaniach",
                icon: MessageCircle,
                color: "text-blue-600"
              },
              {
                step: "02", 
                title: "Wypełnienie kwestionariusza",
                description: "Szczegółowy wywiad o Twoim podejściu do ryzyka i sytuacji finansowej",
                icon: FileText,
                color: "text-green-600"
              },
              {
                step: "03",
                title: "Przygotowanie analizy",
                description: "Personalizowane portfele i materiały dostosowane do Twojego profilu",
                icon: Target,
                color: "text-purple-600"
              },
              {
                step: "04",
                title: "Konsultacja i materiały",
                description: "60-90 min konsultacji + komplet materiałów edukacyjnych",
                icon: Star,
                color: "text-orange-600"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Najczęściej zadawane pytania
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Odpowiedzi na pytania, które otrzymuję najczęściej
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                question: "Czy to jest porada inwestycyjna?",
                answer: "Nie, wszystkie informacje mają charakter wyłącznie edukacyjno-informacyjny. Nie udzielam porad inwestycyjnych ani nie rekomenduje konkretnych zakupów. Uczę jak samodzielnie analizować i podejmować decyzje."
              },
              {
                question: "Czy gwarantujesz zysk z inwestycji?",
                answer: "Absolutnie nie. Inwestowanie zawsze wiąże się z ryzykiem straty. Nikt nie może zagwarantować zysku. Moim celem jest nauczyć Cię zasad i pomóc zrozumieć ryzyko, ale decyzje podejmujesz sam."
              },
              {
                question: "Czy konsultacja odbywa się online?",
                answer: "Tak, konsultacje prowadzę przez Zoom/Teams lub telefonicznie. To wygodne i oszczędza czas. Wszystkie materiały otrzymujesz w formie elektronicznej."
              },
              {
                question: "Co jeśli nie będę zadowolony?",
                answer: "Oferuję 100% gwarancję zwrotu w ciągu 7 dni od konsultacji. Jeśli uznajesz, że nie otrzymałeś wartości za swoje pieniądze, zwracam pełną kwotę."
              },
              {
                question: "Czy subskrypcja Premium jest obowiązkowa?",
                answer: "Nie, subskrypcja jest całkowicie opcjonalna i dostępna tylko po przeprowadzeniu konsultacji głównej. Możesz ją anulować w każdej chwili."
              },
              {
                question: "Jak długo trwa konsultacja?",
                answer: "Konsultacja główna trwa 60-90 minut. Dodatkowo otrzymujesz pakiet materiałów do samodzielnego przerobienia w swoim tempie."
              },
              {
                question: "Czy Pakiet Biedny Student to prawdziwa oszczędność?",
                answer: "Tak! Kupując wszystkie elementy osobno zapłaciłbyś ponad 3500 zł. W pakiecie płacisz tylko 2500 zł, oszczędzając niemal 30%. To kompleksowe wsparcie na cały rok w jednej atrakcyjnej cenie."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">{faq.question}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 sm:py-20 bg-gradient-to-r from-primary to-accent text-white rounded-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 px-4 sm:px-0">
            Gotowy przestać tracić pieniądze<br/>na błędach innych?
          </h2>
          <p className="text-lg sm:text-xl opacity-90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
            Każdy dzień bez systematycznego podejścia to potencjalnie kolejne straty. 
            Zacznij budować swoje bogactwo <strong>mądrze i metodycznie</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0">
            <Link href="/kontakt">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 px-6 sm:px-10 py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                <Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Zarezerwuj konsultację teraz
              </Button>
            </Link>
            <Link href="/kontakt">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 px-6 sm:px-10 py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                <MessageCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Zadaj pytanie
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 sm:mt-8 text-xs sm:text-sm opacity-80">
            <p>⏰ <strong>Tylko 4 konsultacje miesięcznie</strong> - aby zapewnić najwyższą jakość</p>
          </div>
        </section>

        {/* Legal Notice */}
        <section className="py-6 sm:py-8 border-t border-gray-200 mt-16 sm:mt-20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Ważne:</strong> Oferta oraz treści na stronie służą edukacji finansowej i nie stanowią porady inwestycyjnej, 
              oferty ani rekomendacji kupna czy sprzedaży instrumentów finansowych. Wszelkie decyzje inwestycyjne podejmujesz na własną odpowiedzialność.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
