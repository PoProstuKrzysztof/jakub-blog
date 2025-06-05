"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MoreHorizontal,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for admin dashboard
const posts = [
  {
    id: 1,
    title: "Analiza fundamentalna spółki PKN Orlen - Q3 2024",
    status: "published",
    publishedAt: "2024-12-01",
    views: 1250,
    category: "Analiza spółek",
    attachments: 2,
    mainImage: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    title: "Trendy na rynku kryptowalut - Grudzień 2024",
    status: "published",
    publishedAt: "2024-11-28",
    views: 890,
    category: "Kryptowaluty",
    attachments: 2,
    mainImage: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 3,
    title: "Jak czytać sprawozdania finansowe - Poradnik",
    status: "draft",
    publishedAt: null,
    views: 0,
    category: "Edukacja",
    attachments: 3,
    mainImage: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 4,
    title: "Sektor bankowy - perspektywy na 2025",
    status: "published",
    publishedAt: "2024-11-20",
    views: 756,
    category: "Analiza spółek",
    attachments: 1,
    mainImage: "/placeholder.svg?height=100&width=150",
  },
]

const stats = [
  {
    title: "Łączne wyświetlenia",
    value: "12,450",
    change: "+12%",
    icon: Eye,
    color: "#33D2A4",
  },
  {
    title: "Opublikowane posty",
    value: "24",
    change: "+3",
    icon: FileText,
    color: "#2C3E50",
  },
  {
    title: "Szkice",
    value: "5",
    change: "+2",
    icon: Edit,
    color: "#BDC3C7",
  },
  {
    title: "Średnie wyświetlenia",
    value: "518",
    change: "+8%",
    icon: TrendingUp,
    color: "#33D2A4",
  },
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editCategory, setEditCategory] = useState("")

  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 rounded-xl">Opublikowany</Badge>
      case "draft":
        return (
          <Badge variant="secondary" className="rounded-xl">
            Szkic
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="rounded-xl">
            Nieznany
          </Badge>
        )
    }
  }

  const handleDeletePost = (post: any) => {
    setSelectedPost(post)
    setDeleteModalOpen(true)
  }

  const handleEditPost = (post: any) => {
    setSelectedPost(post)
    setEditTitle(post.title)
    setEditCategory(post.category)
    setEditModalOpen(true)
  }

  const confirmDelete = async () => {
    // Simulate delete
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleteModalOpen(false)
    setSelectedPost(null)
    // Here you would actually delete the post
  }

  const saveEdit = async () => {
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEditModalOpen(false)
    setSelectedPost(null)
    // Here you would actually save the changes
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-foreground">
                Jakub Inwestycje
              </Link>
              <Badge className="bg-primary text-primary-foreground rounded-xl">Panel Twórcy</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2 animate-fade-in">Panel Twórcy</h1>
          <p className="text-muted-foreground animate-fade-in-delay">Zarządzaj swoimi postami i treścią</p>
        </div>
        {/* Posts Management */}
        <Card className="bg-card/95 rounded-2xl shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-foreground">Zarządzanie postami</CardTitle>
                <CardDescription>Przeglądaj, edytuj i zarządzaj swoimi postami</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin/analytics">
                  <Button 
                    variant="outline"
                    className="group relative overflow-hidden border-2 border-border bg-transparent text-foreground hover:text-white hover:border-primary transition-all duration-300 rounded-xl px-6 py-2.5 font-medium shadow-sm hover:shadow-lg transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <div className="relative flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                      Analytics
                    </div>
                  </Button>
                </Link>
                <Link href="/admin/nowy-post">
                  <Button 
                    variant="outline"
                    className="group relative overflow-hidden border-2 border-border bg-transparent text-foreground hover:text-white hover:border-primary transition-all duration-300 rounded-xl px-6 py-2.5 font-medium shadow-sm hover:shadow-lg transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <div className="relative flex items-center">
                      <Plus className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                      Nowy post
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Szukaj postów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-accent rounded-xl focus:border-primary transition-colors duration-300"
                />
              </div>
            </div>

            {/* Posts Table */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center space-x-4 p-4 bg-background rounded-xl hover:bg-muted transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <Image src={post.mainImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-muted-foreground">{post.category}</span>
                      {getStatusBadge(post.status)}
                      <span className="text-sm text-muted-foreground">
                        {post.attachments} załącznik{post.attachments !== 1 ? "i" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.views}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("pl-PL") : "Nie opublikowany"}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group relative overflow-hidden hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 rounded-xl border-2 border-transparent hover:border-purple-300 hover:shadow-lg transform hover:scale-105"
                      >
                        <MoreHorizontal className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-accent rounded-xl shadow-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/post/${post.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Podgląd
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditPost(post)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Szybka edycja
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/edytuj/${post.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Pełna edycja
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDeletePost(post)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nie znaleziono postów spełniających kryteria wyszukiwania.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Usuń post</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć post "{selectedPost?.title}"? Ta akcja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-xl border-2 hover:bg-gray-50 transition-all duration-300"
            >
              Anuluj
            </Button>
            <Button 
              onClick={confirmDelete} 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Usuń post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Szybka edycja posta</DialogTitle>
            <DialogDescription>Edytuj podstawowe informacje o poście</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Tytuł
              </Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Kategoria
              </Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analiza spółek">Analiza spółek</SelectItem>
                  <SelectItem value="Kryptowaluty">Kryptowaluty</SelectItem>
                  <SelectItem value="Edukacja">Edukacja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditModalOpen(false)}
              className="rounded-xl border-2 hover:bg-gray-50 transition-all duration-300"
            >
              Anuluj
            </Button>
            <Button 
              onClick={saveEdit} 
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
