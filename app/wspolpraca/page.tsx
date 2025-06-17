"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/common/site-header"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  Active,
  Over,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
  GripVertical,
  Check,
  X,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

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
}

// Inline Editor Component
function InlineEditor({ 
  value, 
  onSave, 
  onCancel, 
  multiline = false,
  placeholder = "Wprowadź tekst..."
}: {
  value: string
  onSave: (value: string) => void
  onCancel: () => void
  multiline?: boolean
  placeholder?: string
}) {
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (editValue.trim()) {
      onSave(editValue.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="flex items-center gap-2 w-full">
      {multiline ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-h-[60px]"
          autoFocus
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
          autoFocus
        />
      )}
      <Button
        size="sm"
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 text-white p-2 h-8 w-8"
        type="button"
      >
        <Check className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        onClick={onCancel}
        variant="outline"
        className="p-2 h-8 w-8"
        type="button"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

// Sortable Service Item Component
function SortableServiceItem({ service, onEdit, onDelete, user }: {
  service: Service
  onEdit: (id: number, field: string, value: string) => void
  onDelete: (id: number) => void
  user: any
}) {
  const [editingField, setEditingField] = useState<string | null>(null)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  }

  // Dla 3 usług: umieść popular w środku
  const isPopular = service.popular
  const orderClass = isPopular ? 'md:order-2' : ''

  // Obsługa przycisków z poprawną propagacją zdarzeń
  const handleEditField = useCallback((field: string) => {
    setEditingField(field)
  }, [])

  const handleSaveField = useCallback((field: string, value: string) => {
    onEdit(service.id, field, value)
    setEditingField(null)
  }, [service.id, onEdit])

  const handleCancelEdit = useCallback(() => {
    setEditingField(null)
  }, [])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(service.id)
  }, [service.id, onDelete])

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden ${
        service.popular ? 'ring-4 ring-primary ring-opacity-50 scale-105' : ''
      } ${isDragging ? 'shadow-2xl ring-2 ring-primary/50' : ''}`}
    >
      {service.badge && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
          <Badge className={`${service.popular ? 'bg-primary text-primary-foreground' : 'bg-purple-600 text-white'} px-4 py-1 text-xs font-semibold rounded-b-lg`}>
            {service.badge}
          </Badge>
        </div>
      )}

      {user && (
        <div className="absolute top-2 right-2 z-30 flex space-x-1">
          {/* Drag Handle - używamy setActivatorNodeRef */}
          <Button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            size="sm"
            variant="ghost"
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1 h-8 w-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-grab active:cursor-grabbing"
            type="button"
            data-dnd-handle="true"
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          
          {/* Delete Button - bez listeners, osobny event handler */}
          <Button
            size="sm"
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-1 h-8 w-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="p-8 relative z-10 pt-12 flex flex-col h-full">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {service.icon === "Target" && <Target className="h-10 w-10 text-white" />}
            {service.icon === "BarChart3" && <BarChart3 className="h-10 w-10 text-white" />}
            {service.icon === "BookOpen" && <BookOpen className="h-10 w-10 text-white" />}
          </div>
          
          {/* Editable Title */}
          {user && editingField === 'title' ? (
            <InlineEditor
              value={service.title}
              onSave={(value) => handleSaveField('title', value)}
              onCancel={handleCancelEdit}
              placeholder="Tytuł usługi"
            />
          ) : (
            <h3 
              className={`text-2xl font-bold text-foreground mb-4 ${user ? 'cursor-pointer hover:bg-gray-100 rounded p-2 transition-colors' : ''}`}
              onClick={user ? () => handleEditField('title') : undefined}
            >
              {service.title}
              {user && <Edit className="inline-block ml-2 h-4 w-4 opacity-50" />}
            </h3>
          )}
          
          {/* Editable Description */}
          {user && editingField === 'description' ? (
            <InlineEditor
              value={service.description}
              onSave={(value) => handleSaveField('description', value)}
              onCancel={handleCancelEdit}
              placeholder="Opis usługi"
              multiline
            />
          ) : (
            <p 
              className={`text-muted-foreground leading-relaxed text-sm ${user ? 'cursor-pointer hover:bg-gray-100 rounded p-2 transition-colors' : ''}`}
              onClick={user ? () => handleEditField('description') : undefined}
            >
              {service.description}
              {user && <Edit className="inline-block ml-2 h-3 w-3 opacity-50" />}
            </p>
          )}
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
            {/* Editable Price */}
            {user && editingField === 'price' ? (
              <InlineEditor
                value={service.price}
                onSave={(value) => handleSaveField('price', value)}
                onCancel={handleCancelEdit}
                placeholder="Cena"
              />
            ) : (
              <div 
                className={`text-4xl font-bold text-foreground mb-1 ${user ? 'cursor-pointer hover:bg-gray-100 rounded p-2 transition-colors' : ''}`}
                onClick={user ? () => handleEditField('price') : undefined}
              >
                {service.price}
                {service.originalPrice && (
                  <span className="text-lg text-gray-400 line-through ml-2">
                    {service.originalPrice}
                  </span>
                )}
                {user && <Edit className="inline-block ml-2 h-4 w-4 opacity-50" />}
              </div>
            )}
            
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
  const { user } = useAuth()
  const [activeId, setActiveId] = useState<number | null>(null)
  const [services, setServices] = useState<Service[]>([
    
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
    },{
      id: 2,
      title: "Konsultacja Majątkowa-Edukacyjna",
      description:
        "Inwestowanie bywa wyzwaniem, zwłaszcza gdy zaczynasz przygodę z rynkami. Ta konsultacja pomoże Ci zrozumieć zasady gry i pewniej budować własny portfel. Nie obiecuję łatwych zysków – nauczę Cię, jak krok po kroku analizować własne podejście do ryzyka i samodzielnie zarządzać inwestycjami.",
      price: "899 zł",
      originalPrice: "1,497 zł",
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
  ])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleEditService = useCallback((serviceId: number, field: string, value: string) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, [field]: value }
          : service
      )
    )
  }, [])

  const handleDeleteService = useCallback((serviceId: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę usługę?')) {
      setServices(prevServices => prevServices.filter(service => service.id !== serviceId))
    }
  }, [])

  const handleAddService = useCallback(() => {
    const newService: Service = {
      id: Date.now(),
      title: "Nowa usługa",
      description: "Opis nowej usługi",
      price: "0 zł",
      priceNote: "jednorazowo",
      type: "jednorazowa",
      ctaText: "Zamów usługę",
      features: ["Funkcja 1", "Funkcja 2"],
      color: "from-gray-500 to-gray-600",
      icon: "Target",
    }
    setServices(prevServices => [...prevServices, newService])
  }, [])

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    setActiveId(active.id as number)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }

  const activeService = services.find(service => service.id === activeId)

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

        {/* Pricing Section with Drag & Drop */}
        <section id="cennik" className="py-16 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Wybierz pakiet dla siebie
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Każdy pakiet został zaprojektowany tak, aby dostarczyć maksymalną wartość na różnych etapach Twojej inwestycyjnej podróży
            </p>
            {user && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto">
                <p className="text-xs sm:text-sm text-blue-800">
                  🔧 <strong>Tryb edycji:</strong> Przeciągnij za uchwyt <GripVertical className="inline h-4 w-4" /> aby zmienić kolejność. 
                  Kliknij na tekst aby edytować inline.
                </p>
              </div>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {/* Grid layout dla ofert obok siebie */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {services.map((service) => (
                  <SortableServiceItem
                    key={service.id}
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                    user={user}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeService ? (
                <div className="opacity-95 rotate-1 scale-105 max-w-4xl">
                  <SortableServiceItem
                    service={activeService}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    user={user}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {user && (
            <div className="text-center">
              <Button
                onClick={handleAddService}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 rounded-xl px-8 py-3 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj usługę
              </Button>
            </div>
          )}
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
              zwrócę Ci <strong>100% wpłaconej kwoty</strong> w ciągu 14 dni. Bez pytań, bez problemów.
            </p>
            <div className="text-xs sm:text-sm opacity-80">
              * Gwarancja obowiązuje dla usługi głównej przez 14 dni od daty konsultacji
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
                answer: "Oferuję 100% gwarancję zwrotu w ciągu 14 dni od konsultacji. Jeśli uznajesz, że nie otrzymałeś wartości za swoje pieniądze, zwracam pełną kwotę."
              },
              {
                question: "Czy subskrypcja Premium jest obowiązkowa?",
                answer: "Nie, subskrypcja jest całkowicie opcjonalna i dostępna tylko po przeprowadzeniu konsultacji głównej. Możesz ją anulować w każdej chwili."
              },
              {
                question: "Jak długo trwa konsultacja?",
                answer: "Konsultacja główna trwa 60-90 minut. Dodatkowo otrzymujesz pakiet materiałów do samodzielnego przerobienia w swoim tempie."
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
