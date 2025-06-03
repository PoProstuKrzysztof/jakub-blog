"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Clock,
  FileText,
  MessageCircle,
  Search,
  Mail,
  Facebook,
  Youtube,
  Instagram,
  Rss,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

export default function CooperationPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [services, setServices] = useState([
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
      color: "#864AF9",
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
      color: "#3B3486",
      icon: "TrendingUp",
    },
  ])
  const [editingService, setEditingService] = useState(null)

  // Check admin status on component mount
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin")
    setIsAdmin(adminStatus === "true")
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Link href="/kontakt">
          <Button
            size="lg"
            className="bg-[#864AF9] hover:bg-[#7c42e8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Top Banner */}
      <div className="bg-[#864AF9] text-white text-center py-2 text-sm font-medium">
        PROFESJONALNA WIEDZA INWESTYCYJNA
      </div>

      {/* Header with Social Icons */}
      <header className="bg-[#332941] text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm"></div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Facebook className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Youtube className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Instagram className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
                <Rss className="h-4 w-4 hover:text-[#864AF9] cursor-pointer transition-colors" />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Szukaj..." className="pl-10 w-48 bg-white text-gray-900 border-0 rounded-md" />
              </div>
              <Link href="/admin/login">
                <Button
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 rounded-md"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Panel administratora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Logo Section */}
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JAKUB INWESTYCJE</h1>
          <p className="text-gray-600 text-lg">XD</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex justify-center items-center flex-1">
              <div className="flex space-x-2">
                <Link href="/" className="relative group">
                  <div className="text-gray-700 hover:text-[#864AF9] font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-[#864AF9]/10 hover:shadow-md transform hover:scale-105">
                    BLOG
                    <div className="absolute inset-0 bg-gradient-to-r from-[#864AF9]/20 to-[#3B3486]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </Link>
                <Link href="/wspolpraca" className="relative group">
                  <div className="bg-[#864AF9] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#7c42e8] hover:shadow-lg transform hover:scale-105">
                    WSPÓŁPRACA
                  </div>
                </Link>
                <Link href="/kontakt" className="relative group">
                  <div className="text-gray-700 hover:text-[#864AF9] font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-[#864AF9]/10 hover:shadow-md transform hover:scale-105">
                    KONTAKT
                    <div className="absolute inset-0 bg-gradient-to-r from-[#864AF9]/20 to-[#3B3486]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </div>
                </Link>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Link href="/admin">
                  <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm">
                    Panel twórcy
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                >
                  {isEditing ? "Zakończ edycję" : "Edytuj usługi"}
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("isAdmin")
                    setIsAdmin(false)
                    setIsEditing(false)
                  }}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm"
                >
                  Wyloguj
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#864AF9] to-[#3B3486] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Współpraca</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in-delay">
            Profesjonalne usługi doradcze i analityczne dostosowane do Twoich potrzeb inwestycyjnych. Skorzystaj z
            mojego doświadczenia, aby podejmować lepsze decyzje finansowe.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Główne oferty */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Moje usługi</h2>
            {isAdmin && isEditing && (
              <Button
                onClick={() => {
                  const newService = {
                    id: Date.now(),
                    title: "Nowa usługa",
                    description: "Opis nowej usługi",
                    price: "0 zł",
                    priceNote: "jednorazowo",
                    features: ["Funkcja 1", "Funkcja 2"],
                    color: "#864AF9",
                    icon: "Users",
                  }
                  setServices([...services, newService])
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
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
                {isAdmin && isEditing && (
                  <div className="absolute top-2 right-2 z-10 flex space-x-1">
                    <Button
                      size="sm"
                      onClick={() => setEditingService(service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 h-8 w-8"
                    >
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setServices(services.filter((s) => s.id !== service.id))}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 h-8 w-8"
                    >
                      🗑️
                    </Button>
                  </div>
                )}
                <CardContent className="p-8">
                  <div
                    className="flex items-center justify-center w-20 h-20 mb-6 rounded-2xl text-white mx-auto shadow-lg"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.icon === "Users" ? <Users className="h-10 w-10" /> : <TrendingUp className="h-10 w-10" />}
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold mb-1" style={{ color: service.color }}>
                      {service.price}
                    </div>
                    <div className="text-sm text-gray-500">{service.priceNote}</div>
                  </div>

                  <div className="flex justify-center">
                    <Link href="/kontakt">
                      <Button
                        className="text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{ backgroundColor: service.color }}
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
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-[#864AF9] text-white mx-auto">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Jak przebiega współpraca?</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#864AF9] text-white text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <span>Kontakt i omówienie potrzeb</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#864AF9] text-white text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <span>Przesłanie materiałów do analizy</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#864AF9] text-white text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <span>Przygotowanie szczegółowej analizy</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#864AF9] text-white text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
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
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-[#3B3486] text-white mx-auto">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Czas realizacji</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="font-semibold text-[#3B3486] mb-1">Analiza strategii</div>
                    <div>5-7 dni roboczych</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="font-semibold text-[#3B3486] mb-1">Przegląd spółek</div>
                    <div>3-5 dni roboczych</div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-4">
                    * W przypadku pilnych zleceń możliwa jest ekspresowa realizacja za dodatkową opłatą
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opinie klientów */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gray-600 text-white mx-auto">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Opinie klientów</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 italic">
                      "Profesjonalna analiza, która pomogła mi zoptymalizować portfel. Polecam!"
                    </div>
                    <div className="text-xs text-gray-500 mt-2">- Anna K.</div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 italic">
                      "Szczegółowy przegląd spółek z konkretnymi rekomendacjami. Bardzo wartościowe."
                    </div>
                    <div className="text-xs text-gray-500 mt-2">- Marcin W.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-[#864AF9] to-[#3B3486] border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Gotowy na współpracę?</h2>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Skontaktuj się ze mną, aby omówić szczegóły i rozpocząć współpracę. Odpowiem na wszystkie pytania i
                pomogę wybrać najlepszą opcję dla Ciebie.
              </p>
              <Link href="/kontakt">
                <Button className="bg-white text-[#864AF9] hover:bg-gray-100 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
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
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              <Button variant="outline" onClick={() => setEditingService(null)}>
                Anuluj
              </Button>
              <Button
                onClick={() => {
                  setServices(services.map((s) => (s.id === editingService.id ? editingService : s)))
                  setEditingService(null)
                }}
                className="bg-[#864AF9] hover:bg-[#7c42e8] text-white"
              >
                Zapisz
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Jakub Inwestycje</h4>
              <p className="text-gray-600">Platforma edukacyjna dedykowana profesjonalnej wiedzy inwestycyjnej.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Kontakt</h4>
              <p className="text-gray-600 mb-4">Masz pytania? Skontaktuj się ze mną poprzez formularz kontaktowy.</p>
              <Link href="/kontakt">
                <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl">
                  Formularz kontaktowy
                </Button>
              </Link>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-gray-600">
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
