"use client"

import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Heart,
  ExternalLink,
  ChevronUp,
  Users,
} from 'lucide-react'
import Image from 'next/image'

interface SiteFooterProps {
  /** Optional list of categories to render */
  categories?: string[]
  /** Optional handler for category clicks. If provided, categories will be rendered as buttons. */
  onCategoryClick?: (category: string) => void
}

/**
 * SiteFooter renders a shared footer across the entire application.
 *
 * If `categories` is provided the first four items will be rendered.
 * If `onCategoryClick` is supplied the list will use <button> elements instead of <Link>.
 */
export function SiteFooter({ categories, onCategoryClick }: SiteFooterProps) {
  const defaultCategories = ["Analiza spółek", "Kryptowaluty", "Edukacja", "Strategie"]
  const categoryList = (categories?.length ? categories : defaultCategories).slice(0, 4)

  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-br from-muted/50 via-background to-card/50 border-t border-border">
      {/* Main Footer Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Brand Section - Mobile Optimized */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">Jakub Wpisy</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Profesjonalne analizy finansowe i edukacja inwestycyjna. 
              Pomagam budować świadome portfele inwestycyjne oparte na fundamentalnej analizie spółek.
            </p>

            
            {/* Social Media - Mobile Optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground mr-1 sm:mr-2">Obserwuj:</span>
              <div className="flex gap-1 sm:gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation tap-highlight-none">
                  <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation tap-highlight-none">
                  <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation tap-highlight-none">
                  <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation tap-highlight-none">
                  <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation tap-highlight-none">
                  <Youtube className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">
              Wpisy
            </h4>
            <nav className="space-y-2 sm:space-y-3">
              <Link 
                href="/" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Strona główna
              </Link>
              <Link 
                href="/wpisy" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Wszystkie wpisy
              </Link>
              <Link 
                href="/wspolpraca" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Współpraca
              </Link>
              <Link 
                href="/kontakt" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Categories - Mobile Optimized */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">
              Kategorie
            </h4>
            <nav className="space-y-2 sm:space-y-3">
              <Link 
                href="/wpisy?category=analiza-spolek" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Analiza spółek
              </Link>
              <Link 
                href="/wpisy?category=kryptowaluty" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Kryptowaluty
              </Link>
              <Link 
                href="/wpisy?category=edukacja" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Edukacja finansowa
              </Link>
              <Link 
                href="/wpisy?category=strategie" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Strategie inwestycyjne
              </Link>
              <Link 
                href="/wpisy?category=trendy" 
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors touch-manipulation tap-highlight-none"
              >
                Trendy rynkowe
              </Link>
            </nav>
          </div>

          {/* Contact Info - Mobile Optimized */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">
              Kontakt
            </h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <a 
                  href="mailto:kontakt@jakubblog.pl" 
                  className="hover:text-primary transition-colors touch-manipulation tap-highlight-none"
                >
                  kontakt@jakubblog.pl
                </a>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <a 
                  href="tel:+48123456789" 
                  className="hover:text-primary transition-colors touch-manipulation tap-highlight-none"
                >
                  +48 123 456 789
                </a>
              </div>
              <div className="flex items-start text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>Warszawa, Polska</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span>Pn-Pt: 9:00-18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Mobile Optimized */}
      <div className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">150+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Publikacji</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">50k+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Czytelników</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">8</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Lat doświadczenia</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg border border-border">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Zadowolonych</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Mobile Optimized */}
      <div className="bg-card/80 border-t border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-red-500" />
                <span>© {currentYear} Jakub Wpisy. Wszystkie prawa zastrzeżone.</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <Link 
                  href="/polityka-prywatnosci" 
                  className="hover:text-primary transition-colors touch-manipulation tap-highlight-none"
                >
                  Polityka prywatności
                </Link>
                <Link 
                  href="/regulamin" 
                  className="hover:text-primary transition-colors touch-manipulation tap-highlight-none"
                >
                  Regulamin
                </Link>
                <Link 
                  href="/cookies" 
                  className="hover:text-primary transition-colors touch-manipulation tap-highlight-none"
                >
                  Cookies
                </Link>
              </div>
            </div>

            {/* Back to Top - Mobile Optimized */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={scrollToTop}
              className="touch-manipulation tap-highlight-none"
            >
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Na górę</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-4 right-4 sm:hidden z-50">
        <Button 
          size="sm"
          onClick={scrollToTop}
          className="rounded-full w-12 h-12 p-0 shadow-lg touch-manipulation tap-highlight-none"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </footer>
  )
} 