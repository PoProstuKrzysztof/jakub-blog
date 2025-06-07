"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import {
  User,
  GraduationCap,
  Briefcase,
  Target,
  TrendingUp,
  Award,
  Mail,
  Linkedin,
  Twitter,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Rss,
  MessageCircle,
  Users,
  BarChart3,
  FileText,
  Shield,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { AuthorImage } from "@/components/author-image"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthorContent {
  id: string
  section_type: string
  title: string
  content: string
  section_order: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

interface AuthorPageClientProps {
  initialContent: AuthorContent[]
  user: SupabaseUser | null
}

interface EditingSection {
  id: string
  title: string
  content: string
}

export function AuthorPageClient({ initialContent, user }: AuthorPageClientProps) {
  const { user: authUser } = useAuth()
  const [content, setContent] = useState<AuthorContent[]>(initialContent)
  const [editingSection, setEditingSection] = useState<EditingSection | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  // Domyślne sekcje jeśli brak danych w bazie
  const defaultSections = [
    {
      id: 'hero',
      section_type: 'hero',
      title: 'Jakub - Twój Przewodnik w Świecie Inwestycji',
      content: 'Witaj! Jestem Jakub, pasjonatem inwestycji z wieloletnim doświadczeniem na rynkach finansowych. Moją misją jest dzielenie się wiedzą i pomaganie innym w osiąganiu finansowej niezależności.',
      section_order: 1,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'experience',
      section_type: 'experience',
      title: 'Doświadczenie',
      content: 'Ponad 8 lat doświadczenia w analizie rynków finansowych. Specjalizuję się w analizie fundamentalnej spółek, inwestycjach długoterminowych oraz strategiach dywersyfikacji portfela.',
      section_order: 2,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'education',
      section_type: 'education',
      title: 'Wykształcenie',
      content: 'Magister Ekonomii na Uniwersytecie Warszawskim, specjalizacja: Finanse i Bankowość. Certyfikat CFA Level II. Ukończone kursy z analizy technicznej i zarządzania ryzykiem.',
      section_order: 3,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'philosophy',
      section_type: 'philosophy',
      title: 'Filozofia Inwestycyjna',
      content: 'Wierzę w długoterminowe inwestowanie oparte na solidnej analizie fundamentalnej. Kluczem do sukcesu jest dyscyplina, cierpliwość i systematyczne podejście do budowania portfela.',
      section_order: 4,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'achievements',
      section_type: 'achievements',
      title: 'Osiągnięcia',
      content: 'Autor ponad 200 analiz spółek. Średnia roczna stopa zwrotu z rekomendacji: 15.2%. Współpraca z największymi domami maklerskimi w Polsce. Regularny gość w programach finansowych.',
      section_order: 5,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const sections = content.length > 0 ? content : defaultSections

  const handleEditSection = (section: AuthorContent) => {
    if (!authUser) {
      toast.error('Musisz być zalogowany, aby edytować treść')
      return
    }
    
    setEditingSection({
      id: section.id,
      title: section.title,
      content: section.content,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveSection = async () => {
    if (!editingSection || !authUser) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('author_content')
        .upsert({
          id: editingSection.id,
          section_type: editingSection.id,
          title: editingSection.title,
          content: editingSection.content,
          section_order: sections.find(s => s.id === editingSection.id)?.section_order || 1,
          is_visible: true,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        toast.error('Błąd podczas zapisywania: ' + error.message)
        return
      }

      // Aktualizuj lokalny stan
      setContent(prev => 
        prev.map(section => 
          section.id === editingSection.id 
            ? { ...section, title: editingSection.title, content: editingSection.content }
            : section
        )
      )

      toast.success('Sekcja została zaktualizowana!')
      setIsEditDialogOpen(false)
      setEditingSection(null)
    } catch (error) {
      toast.error('Wystąpił nieoczekiwany błąd')
      console.error('Error saving section:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSectionIcon = (sectionType: string) => {
    switch (sectionType) {
      case 'hero': return <User className="h-6 w-6" />
      case 'experience': return <Briefcase className="h-6 w-6" />
      case 'education': return <GraduationCap className="h-6 w-6" />
      case 'philosophy': return <Target className="h-6 w-6" />
      case 'achievements': return <Award className="h-6 w-6" />
      default: return <BookOpen className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="home"
        user={user}
      />

      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                {authUser && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -top-2 -right-2 z-10"
                    onClick={() => handleEditSection(sections.find(s => s.section_type === 'hero')!)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Badge className="mb-4 bg-primary text-primary-foreground">
                  O AUTORZE
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {sections.find(s => s.section_type === 'hero')?.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {sections.find(s => s.section_type === 'hero')?.content}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/kontakt">
                    <Button className="bg-primary hover:bg-primary/90">
                      Skontaktuj się
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/blog">
                    <Button variant="outline">
                      Przejdź do bloga
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
                <AuthorImage 
                  className="h-96 w-full"
                  alt="Jakub - Autor bloga"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">8+ lat doświadczenia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Dlaczego warto mi zaufać?
            </h2>
            <p className="text-lg text-muted-foreground">
              Profesjonalne podejście do inwestowania oparte na wieloletnim doświadczeniu
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Bezpieczeństwo</h3>
              <p className="text-muted-foreground">
                Konserwatywne podejście do inwestowania z naciskiem na zarządzanie ryzykiem
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Analiza</h3>
              <p className="text-muted-foreground">
                Szczegółowe analizy fundamentalne oparte na rzetelnych danych finansowych
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Społeczność</h3>
              <p className="text-muted-foreground">
                Aktywna społeczność inwestorów dzieląca się wiedzą i doświadczeniem
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-16">
          {sections.filter(s => s.section_type !== 'hero').map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="relative">
                  {authUser && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-4 right-4"
                      onClick={() => handleEditSection(section)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {getSectionIcon(section.section_type)}
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {section.content}
                  </p>
                  
                  {/* Special content for achievements section */}
                  {section.section_type === 'achievements' && (
                    <div className="mt-8 grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">200+</div>
                        <div className="text-sm text-muted-foreground">Analiz spółek</div>
                      </div>
                      <div className="text-center p-4 bg-accent/5 rounded-lg">
                        <div className="text-3xl font-bold text-accent mb-2">15.2%</div>
                        <div className="text-sm text-muted-foreground">Średnia stopa zwrotu</div>
                      </div>
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-3xl font-bold text-primary mb-2">8+</div>
                        <div className="text-sm text-muted-foreground">lat doświadczenia</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Co oferuję?
            </h2>
            <p className="text-lg text-muted-foreground">
              Kompleksowe wsparcie w Twojej inwestycyjnej podróży
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/" className="group">
              <Card className="border-border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Analiza Spółek</h3>
                  <p className="text-muted-foreground mb-4">
                    Szczegółowe analizy fundamentalne polskich i zagranicznych spółek
                  </p>
                  <div className="flex items-center justify-center text-primary font-medium">
                    Czytaj blog <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/wspolpraca" className="group">
              <Card className="border-border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Konsultacje</h3>
                  <p className="text-muted-foreground mb-4">
                    Indywidualne konsultacje inwestycyjne i budowanie portfela
                  </p>
                  <div className="flex items-center justify-center text-primary font-medium">
                    Dowiedz się więcej <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/kontakt" className="group">
              <Card className="border-border shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Rss className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Newsletter</h3>
                  <p className="text-muted-foreground mb-4">
                    Cotygodniowe podsumowania rynków i najważniejsze informacje
                  </p>
                  <div className="flex items-center justify-center text-primary font-medium">
                    Zapisz się <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Skontaktuj się ze mną
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Masz pytania o inwestowanie? Chcesz nawiązać współpracę? 
                Skontaktuj się ze mną przez formularz kontaktowy lub media społecznościowe.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">jakub@jakubinwestycje.pl</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">+48 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Warszawa, Polska</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" asChild>
                  <a href="https://linkedin.com/in/jakub" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href="https://twitter.com/jakub" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-6">Szybki kontakt</h3>
              <div className="space-y-4">
                <Link href="/kontakt">
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="h-4 w-4 mr-3" />
                    Formularz kontaktowy
                  </Button>
                </Link>
                <Link href="/wspolpraca">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Współpraca biznesowa
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="https://t.me/kryptodegeneraci" target="_blank" rel="noopener noreferrer">
                    <Users className="h-4 w-4 mr-3" />
                    Dołącz do Telegram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Gotowy na rozpoczęcie swojej inwestycyjnej podróży?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Dołącz do tysięcy czytelników, którzy już korzystają z moich analiz i poradników
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/blog">
              <Button 
                size="lg" 
                variant="secondary"
                className="min-w-[200px]"
              >
                Przejdź do bloga
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/kontakt">
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary min-w-[200px]"
              >
                Skontaktuj się
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edytuj sekcję</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tytuł</Label>
                <Input
                  id="title"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="content">Treść</Label>
                <Textarea
                  id="content"
                  value={editingSection.content}
                  onChange={(e) => setEditingSection(prev => 
                    prev ? { ...prev, content: e.target.value } : null
                  )}
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Anuluj
                </Button>
                <Button 
                  onClick={handleSaveSection}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Zapisywanie...' : 'Zapisz'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 