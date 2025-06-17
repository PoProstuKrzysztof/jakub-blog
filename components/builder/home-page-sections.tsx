"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  MessageCircle,
  Shield,
  BarChart3,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  FileText,
  Award,
} from "lucide-react";
import Link from "next/link";

// Hero Section Component dla Builder.io
interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  badge?: string;
  showStats?: boolean;
}

function HeroSection({
  title = "Osiągnij finansową niezależność DZIĘKI NAM",
  subtitle = "Wykorzystaj moje 8-letnie doświadczenie w analizie rynków finansowych. Otrzymuj profesjonalne analizy spółek, strategie inwestycyjne i edukację finansową – wszystko w jednym miejscu.",
  primaryCtaText = "Poznaj moje analizy",
  primaryCtaUrl = "#blog",
  secondaryCtaText = "Współpraca",
  secondaryCtaUrl = "/wspolpraca",
  badge = "🚀 Profesjonalne analizy finansowe",
  showStats = true,
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <Badge className="bg-primary/10 border-primary/20 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium">
                {badge}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <Link href={primaryCtaUrl}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl text-base sm:text-lg lg:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <BookOpen className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  {primaryCtaText}
                </Button>
              </Link>
              <Link href={secondaryCtaUrl}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-border hover:border-primary px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl text-base sm:text-lg lg:text-xl font-semibold transition-all duration-300 hover:bg-primary/5 w-full sm:w-auto"
                >
                  <MessageCircle className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            {showStats && (
              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start space-y-4 xs:space-y-0 xs:space-x-8 pt-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    100+
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    Zadowolonych klientów
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    15.2%
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    Średnia stopa zwrotu
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    5+
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    lat doświadczenia
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hero Visual */}
          <div className="relative order-first lg:order-last">
            <div className="relative bg-card rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-border">
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground">
                    Portfolio
                  </h3>
                  <Badge className="bg-green-100 text-green-800 rounded-lg text-xs sm:text-sm">
                    +15.2%
                  </Badge>
                </div>

                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-center p-2 sm:p-2.5 lg:p-3 bg-background rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">
                      PKN Orlen
                    </span>
                    <span className="text-green-600 font-semibold text-xs sm:text-sm">
                      +18.5%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-2.5 lg:p-3 bg-background rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">
                      CD Projekt
                    </span>
                    <span className="text-green-600 font-semibold text-xs sm:text-sm">
                      +12.3%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-2.5 lg:p-3 bg-background rounded-lg">
                    <span className="text-xs sm:text-sm font-medium">
                      Allegro
                    </span>
                    <span className="text-green-600 font-semibold text-xs sm:text-sm">
                      +8.7%
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-3 lg:pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Łączny zysk
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600">
                      +€ 12,450
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 lg:-top-4 lg:-left-4 bg-primary text-primary-foreground px-2 py-1 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium shadow-lg">
              ✨ Najlepsze analizy
            </div>
            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 lg:-bottom-4 lg:-right-4 bg-accent text-primary-foreground px-2 py-1 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium shadow-lg">
              📊 Real-time updates
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section Component dla Builder.io
interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
}

function FeaturesSection({
  title = "Dlaczego kilkudziesięciu inwestorów mi zaufało?",
  subtitle = "Profesjonalne podejście do inwestowania oparte na wieloletnim doświadczeniu i sprawdzonych metodach analizy",
}: FeaturesSectionProps) {
  const features = [
    {
      title: "Bezpieczne inwestowanie",
      description:
        "Konserwatywne podejście z naciskiem na zarządzanie ryzykiem i długoterminowy wzrost",
      Icon: Shield,
      color: "text-blue-600",
    },
    {
      title: "Szczegółowa analiza",
      description:
        "Analizy portfela inwestycyjnego oparte na rzetelnych danych finansowych i modelach wyceny",
      Icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Celne rekomendacje",
      description:
        "Średnia stopa zwrotu 15.2% z moich rekomendacji potwierdza skuteczność metod",
      Icon: Target,
      color: "text-purple-600",
    },
    {
      title: "Społeczność",
      description:
        "Aktywna społeczność inwestorów dzieląca się wiedzą i doświadczeniem na Messengerze",
      Icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.Icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${feature.color}`}
                  />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Section Component dla Builder.io
interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
}

function ServicesSection({
  title = "Rozwijaj się ze mną finansowo",
  subtitle = "Od analiz twojego portfela po indywidualne konsultacje – wszystko czego potrzebujesz do inteligentnego inwestowania",
}: ServicesSectionProps) {
  const services = [
    {
      title: "Analizy portfela inwestycyjnego",
      description:
        "Szczegółowa analiza twojego portfela inwestycyjnego wraz z rekomendacjami ścieżki inwestycyjnej",
      Icon: FileText,
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
      title: "Konsultacje indywidualne",
      description:
        "Spersonalizowane doradztwo inwestycyjne dostosowane do Twojego profilu ryzyka i celów",
      Icon: MessageCircle,
      features: [
        "Analiza portfela",
        "Strategia inwestycyjna",
        "Sesja 1-na-1",
        "Plan działania",
      ],
      href: "/wspolpraca",
      cta: "Umów konsultację",
    },
    {
      title: "Edukacja finansowa",
      description:
        "Kursy, poradniki i webinaria pomagające zrozumieć rynki i podejmować lepsze decyzje",
      Icon: Award,
      features: [
        "Poradniki praktyczne",
        "Case studies",
        "Webinaria live",
        "Społeczność",
      ],
      href: "/kontakt",
      cta: "Zapisz się",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col flex-grow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <service.Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 text-center leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-xs sm:text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Link href={service.href} className="block mt-auto">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold group-hover:shadow-lg transition-all duration-300 text-xs sm:text-sm lg:text-base py-2 sm:py-2.5 lg:py-3">
                    {service.cta}
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Component dla Builder.io
interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
}

function TestimonialsSection({
  title = "Co mówią o mnie inwestorzy?",
  subtitle = "Opinie od osób, które zaufały moim analizom i konsultacjom",
}: TestimonialsSectionProps) {
  const testimonials = [
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
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-card/80 backdrop-blur-sm"
            >
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-foreground text-xs sm:text-sm lg:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component dla Builder.io
interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

function CTASection({
  title = "Gotowy na rozpoczęcie swojej inwestycyjnej podróży?",
  subtitle = "Dołącz do tysięcy inwestorów, którzy już korzystają z moich analiz i osiągają lepsze wyniki finansowe",
  primaryCtaText = "Rozpocznij lekturę",
  primaryCtaUrl = "#blog",
  secondaryCtaText = "Umów konsultację",
  secondaryCtaUrl = "/wspolpraca",
}: CTASectionProps) {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          {title}
        </h2>
        <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 text-primary-foreground/90 max-w-3xl mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 lg:mb-16">
          <Link href={primaryCtaUrl}>
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90 font-semibold px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
            >
              <BookOpen className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              {primaryCtaText}
            </Button>
          </Link>
          <Link href={secondaryCtaUrl}>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
            >
              <MessageCircle className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              {secondaryCtaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Eksport komponentów z konfiguracjami dla Builder.io
export const HeroSectionInfo = {
  name: "HeroSection",
  component: HeroSection as FC,
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue:
        "Osiągnij finansową niezależność dzięki inteligentnym inwestycjom",
      friendlyName: "Tytuł główny",
    },
    {
      name: "subtitle",
      type: "longText",
      defaultValue:
        "Wykorzystaj moje 8-letnie doświadczenie w analizie rynków finansowych. Otrzymuj profesjonalne analizy spółek, strategie inwestycyjne i edukację finansową – wszystko w jednym miejscu.",
      friendlyName: "Podtytuł",
    },
    {
      name: "primaryCtaText",
      type: "text",
      defaultValue: "Poznaj moje analizy",
      friendlyName: "Tekst głównego przycisku",
    },
    {
      name: "primaryCtaUrl",
      type: "url",
      defaultValue: "#blog",
      friendlyName: "Link głównego przycisku",
    },
    {
      name: "secondaryCtaText",
      type: "text",
      defaultValue: "Współpraca",
      friendlyName: "Tekst drugiego przycisku",
    },
    {
      name: "secondaryCtaUrl",
      type: "url",
      defaultValue: "/wspolpraca",
      friendlyName: "Link drugiego przycisku",
    },
    {
      name: "badge",
      type: "text",
      defaultValue: "🚀 Profesjonalne analizy finansowe",
      friendlyName: "Tekst znaczka",
    },
    {
      name: "showStats",
      type: "boolean",
      defaultValue: true,
      friendlyName: "Pokaż statystyki",
    },
  ],
};

export const FeaturesSectionInfo = {
  name: "FeaturesSection",
  component: FeaturesSection as FC,
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue: "Dlaczego kilkudziesięciu inwestorów mi zaufało?",
      friendlyName: "Tytuł sekcji",
    },
    {
      name: "subtitle",
      type: "longText",
      defaultValue:
        "Profesjonalne podejście do inwestowania oparte na wieloletnim doświadczeniu i sprawdzonych metodach analizy",
      friendlyName: "Podtytuł sekcji",
    },
  ],
};

export const ServicesSectionInfo = {
  name: "ServicesSection",
  component: ServicesSection as FC,
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue: "Rozwijaj się ze mną finansowo",
      friendlyName: "Tytuł sekcji",
    },
    {
      name: "subtitle",
      type: "longText",
      defaultValue:
        "Od analiz twojego portfela po indywidualne konsultacje – wszystko czego potrzebujesz do inteligentnego inwestowania",
      friendlyName: "Podtytuł sekcji",
    },
  ],
};

export const TestimonialsSectionInfo = {
  name: "TestimonialsSection",
  component: TestimonialsSection as FC,
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue: "Co mówią o mnie inwestorzy?",
      friendlyName: "Tytuł sekcji",
    },
    {
      name: "subtitle",
      type: "text",
      defaultValue:
        "Opinie od osób, które zaufały moim analizom i konsultacjom",
      friendlyName: "Podtytuł sekcji",
    },
  ],
};

export const CTASectionInfo = {
  name: "CTASection",
  component: CTASection as FC,
  inputs: [
    {
      name: "title",
      type: "text",
      defaultValue: "Gotowy na rozpoczęcie swojej inwestycyjnej podróży?",
      friendlyName: "Tytuł sekcji",
    },
    {
      name: "subtitle",
      type: "longText",
      defaultValue:
        "Dołącz do tysięcy inwestorów, którzy już korzystają z moich analiz i osiągają lepsze wyniki finansowe",
      friendlyName: "Podtytuł sekcji",
    },
    {
      name: "primaryCtaText",
      type: "text",
      defaultValue: "Rozpocznij lekturę",
      friendlyName: "Tekst głównego przycisku",
    },
    {
      name: "primaryCtaUrl",
      type: "url",
      defaultValue: "#blog",
      friendlyName: "Link głównego przycisku",
    },
    {
      name: "secondaryCtaText",
      type: "text",
      defaultValue: "Umów konsultację",
      friendlyName: "Tekst drugiego przycisku",
    },
    {
      name: "secondaryCtaUrl",
      type: "url",
      defaultValue: "/wspolpraca",
      friendlyName: "Link drugiego przycisku",
    },
  ],
};
