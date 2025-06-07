"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
  Search,
  Edit,
  Plus,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
}

export default function CooperationPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Indywidualna analiza strategii",
      description:
        "Spersonalizowana analiza Twojej strategii inwestycyjnej z uwzględnieniem celów, horyzontu czasowego i tolerancji ryzyka. Otrzymasz szczegółowy raport z rekomendacjami dostosowanymi do Twojej sytuacji.",
      price: "499 zł",
      priceNote: "jednorazowo",
      features: [
        "Analiza obecnego portfela inwestycyjnego",
        "Rekomendacje dostosowane do profilu ryzyka",
        "Plan dywersyfikacji i optymalizacji",
        "Konsultacja online (60 min)",
      ],
      color: "#33D2A4",
      icon: "Users",
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
      ],
      color: "#2C3E50",
      icon: "TrendingUp",
    },
  ])
  const [editingService, setEditingService] = useState<Service | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="cooperation"
        showSearch={true}
        searchPlaceholder="Szukaj usług, informacji..."
        showEditButton={true}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Współpraca</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-fade-in-delay">
            Profesjonalne usługi doradcze i analityczne dostosowane do Twoich potrzeb inwestycyjnych. Skorzystaj z
            mojego doświadczenia, aby podejmować lepsze decyzje finansowe.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Główne oferty */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Moje usługi</h2>
            {user && isEditing && (
              <Button
                onClick={() => {
                  const newService: Service = {
                    id: Date.now(),
                    title: "Nowa usługa",
                    description: "Opis nowej usługi",
                    price: "0 zł",
                    priceNote: "jednorazowo",
                    features: ["Funkcja 1", "Funkcja 2"],
                    color: "#33D2A4",
                    icon: "Users",
                  }
                  setServices([...services, newService])
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 rounded-2xl px-6 py-2.5 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1 transition-transform duration-300 group-hover:rotate-180" />
                Dodaj usługę
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="overflow-hidden group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] relative"
              >
                {user && isEditing && (
                  <div className="absolute top-2 right-2 z-10 flex space-x-1">
                    <Button
                      size="sm"
                      onClick={() => setEditingService(service)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground p-1 h-8 w-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                    >
                      <Edit className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setServices(services.filter((s) => s.id !== service.id))}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-1 h-8 w-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                    >
                      <Trash2 className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
                    </Button>
                  </div>
                )}
                <CardContent className="p-8">
                  <div
                    className="flex items-center justify-center w-20 h-20 mb-6 rounded-2xl text-primary-foreground mx-auto shadow-lg"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.icon === "Users" ? <Users className="h-10 w-10" /> : <TrendingUp className="h-10 w-10" />}
                  </div>
                  <h3 className="text-2xl font-bold text-center text-foreground mb-4">{service.title}</h3>
                  <p className="text-muted-foreground text-center mb-6 leading-relaxed">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold mb-1" style={{ color: service.color }}>
                      {service.price}
                    </div>
                    <div className="text-sm text-muted-foreground">{service.priceNote}</div>
                  </div>

                  <div className="flex justify-center">
                    <Link href="/kontakt">
                      <Button
                        className="text-primary-foreground transition-all duration-500 rounded-2xl px-8 py-2.5 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105"
                        style={{ 
                          background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                        }}
                      >
                        {index === 0 ? "Zamów analizę" : "Zamów przegląd"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Dodatkowe informacje */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Proces współpracy */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary text-primary-foreground mx-auto">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-center text-foreground mb-4">Jak przebiega współpraca?</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <span>Kontakt i omówienie potrzeb</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <span>Przesłanie materiałów do analizy</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <span>Przygotowanie szczegółowej analizy</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      4
                    </div>
                    <span>Prezentacja wyników i rekomendacji</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Czas realizacji */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-accent text-primary-foreground mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-center text-foreground mb-4">Czas realizacji</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="font-semibold text-accent mb-1">Analiza strategii</div>
                    <div>5-7 dni roboczych</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="font-semibold text-accent mb-1">Przegląd spółek</div>
                    <div>3-5 dni roboczych</div>
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-4">
                    * W przypadku pilnych zleceń możliwa jest ekspresowa realizacja za dodatkową opłatą
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opinie klientów */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-accent text-primary-foreground mx-auto">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-center text-foreground mb-4">Opinie klientów</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      "Profesjonalna analiza, która pomogła mi zoptymalizować portfel. Polecam!"
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">- Anna K.</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      "Szczegółowy przegląd spółek z konkretnymi rekomendacjami. Bardzo wartościowe."
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">- Marcin W.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary to-accent border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">Gotowy na współpracę?</h2>
              <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Skontaktuj się ze mną, aby omówić szczegóły i rozpocząć współpracę. Odpowiem na wszystkie pytania i
                pomogę wybrać najlepszą opcję dla Ciebie.
              </p>
              <Link href="/kontakt">
                <Button className="bg-card text-primary hover:bg-card/90 transition-all duration-500 rounded-2xl px-8 py-3 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105">
                  Skontaktuj się ze mną
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edytuj usługę</h3>
            <div className="space-y-4">
              <div>
                <Label>Tytuł</Label>
                <Input
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Opis</Label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cena</Label>
                  <Input
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Uwaga do ceny</Label>
                  <Input
                    value={editingService.priceNote}
                    onChange={(e) => setEditingService({ ...editingService, priceNote: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Funkcje (jedna na linię)</Label>
                <Textarea
                  value={editingService.features.join("\n")}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      features: e.target.value.split("\n").filter((f) => f.trim()),
                    })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label>Kolor</Label>
                <Input
                  type="color"
                  value={editingService.color}
                  onChange={(e) => setEditingService({ ...editingService, color: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                onClick={() => setEditingService(null)}
                variant="outline"
              >
                Anuluj
              </Button>
              <Button
                onClick={() => {
                  setServices(services.map((s) => (s.id === editingService.id ? editingService : s)))
                  setEditingService(null)
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Zapisz
              </Button>
            </div>
          </div>
        </div>
      )}

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
              <Link href="/kontakt">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  Formularz kontaktowy
                </Button>
              </Link>
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
