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
    color: "#864AF9",
  },
  {
    title: "Opublikowane posty",
    value: "24",
    change: "+3",
    icon: FileText,
    color: "#3B3486",
  },
  {
    title: "Szkice",
    value: "5",
    change: "+2",
    icon: Edit,
    color: "#332941",
  },
  {
    title: "Średnie wyświetlenia",
    value: "518",
    change: "+8%",
    icon: TrendingUp,
    color: "#864AF9",
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
    <div className="min-h-screen" style={{ backgroundColor: "#413B61" }}>
      {/* Header */}
      <header className="bg-[#332941] shadow-lg border-b border-[#3B3486]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                Jakub Inwestycje
              </Link>
              <Badge className="bg-[#864AF9] text-white rounded-xl">Panel Twórcy</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/analytics">
                <Button className="bg-[#3B3486] hover:bg-[#332941] text-white transition-all duration-300 rounded-xl">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#864AF9] text-[#864AF9] hover:bg-[#864AF9] hover:text-white transition-all duration-300 rounded-xl"
                >
                  Podgląd bloga
                </Button>
              </Link>
              <Link href="/admin/nowy-post">
                <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Nowy post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">Panel Twórcy</h1>
          <p className="text-gray-300 animate-fade-in-delay">Zarządzaj swoimi postami i treścią</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-white/95 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#332941]">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Posts Management */}
        <Card className="bg-white/95 rounded-2xl shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-[#332941]">Zarządzanie postami</CardTitle>
                <CardDescription>Przeglądaj, edytuj i zarządzaj swoimi postami</CardDescription>
              </div>
              <Link href="/admin/nowy-post">
                <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj post
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Szukaj postów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#3B3486] rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                />
              </div>
            </div>

            {/* Posts Table */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                    <Image src={post.mainImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#332941] truncate">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{post.category}</span>
                      {getStatusBadge(post.status)}
                      <span className="text-sm text-gray-500">
                        {post.attachments} załącznik{post.attachments !== 1 ? "i" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
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
                        className="hover:bg-[#864AF9] hover:text-white transition-all duration-300 rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-[#3B3486] rounded-xl shadow-xl">
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
                <p className="text-gray-500">Nie znaleziono postów spełniających kryteria wyszukiwania.</p>
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
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
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
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={saveEdit} className="bg-[#864AF9] hover:bg-[#7c42e8]">
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
