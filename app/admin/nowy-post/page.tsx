"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, FileText, ImageIcon, File, ArrowLeft, CheckCircle, Eye, Save } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { SEOSettings } from "@/components/editor/seo-settings"
import { createClientPostService } from "@/lib/services/post-service"
import { CategoryService } from "@/lib/services/category-service"
import { TagService } from "@/lib/services/tag-service"
import { CategoryFull } from "@/lib/models/category"
import { TagWithPostCount } from "@/lib/models/tag"
import { POST_STATUS } from "@/lib/models/post"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface Attachment {
  id: string
  name: string
  type: "pdf" | "excel" | "image"
  size: string
}

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('published')
  const [isFeatured, setIsFeatured] = useState(false)
  const [allowComments, setAllowComments] = useState(true)

  // SEO Settings
  const [metaDescription, setMetaDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // Preview mode
  const [isPreview, setIsPreview] = useState(false)

  // Data from services
  const [categories, setCategories] = useState<CategoryFull[]>([])
  const [availableTags, setAvailableTags] = useState<TagWithPostCount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Services
  const postService = createClientPostService()
  const categoryService = new CategoryService()
  const tagService = new TagService()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()

  // Load categories and tags on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Load categories
        const categoriesResult = await categoryService.getCategories()
        if (categoriesResult.data) {
          setCategories(categoriesResult.data)
        }

        // Load tags
        const tagsResult = await tagService.getTags()
        if (tagsResult.data) {
          setAvailableTags(tagsResult.data)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "Błąd",
          description: "Nie udało się załadować kategorii i tagów",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(generatedSlug)
    }
  }, [title, slug])

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("post-draft")
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        setTitle(draftData.title || "")
        setContent(draftData.content || "")
        setExcerpt(draftData.excerpt || "")
        setCategory(draftData.category || "")
        setSelectedTags(draftData.selectedTags || [])
        setMetaDescription(draftData.metaDescription || "")
        setSlug(draftData.slug || "")
        setTags(draftData.tags || [])
        setMainImage(draftData.mainImage || null)
        setAttachments(draftData.attachments || [])
        setStatus(draftData.status || 'published')
        setIsFeatured(draftData.isFeatured || false)
        setAllowComments(draftData.allowComments !== false)
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMainImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.name.endsWith(".pdf")
            ? "pdf"
            : file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
              ? "excel"
              : "image",
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        }
        setAttachments((prev) => [...prev, newAttachment])
      })
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "excel":
        return <File className="h-4 w-4 text-green-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-500" />
      default:
        return <File className="h-4 w-4 text-muted-foreground" />
    }
  }

  const saveDraft = async () => {
    setIsDraft(true)
    
    try {
      // Save to localStorage
      const draftData = {
        title,
        content,
        excerpt,
        category,
        selectedTags,
        metaDescription,
        slug,
        tags,
        mainImage,
        attachments,
        status,
        isFeatured,
        allowComments,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem("post-draft", JSON.stringify(draftData))
      
      toast({
        title: "Szkic zapisany",
        description: "Twój post został zapisany jako szkic",
      })
    } catch (error) {
      console.error('Error saving draft:', error)
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać szkicu",
        variant: "destructive"
      })
    } finally {
      setIsDraft(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast({
        title: "Błąd",
        description: "Tytuł posta jest wymagany",
        variant: "destructive"
      })
      return
    }

    if (!slug.trim()) {
      toast({
        title: "Błąd", 
        description: "Slug posta jest wymagany",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare post data
      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        content: content || '',
        excerpt: excerpt || '',
        featured_image_url: mainImage || undefined,
        meta_title: title.trim(),
        meta_description: metaDescription || '',
        status: status as 'draft' | 'published' | 'scheduled',
        published_at: status === 'published' ? new Date().toISOString() : undefined,
        is_featured: isFeatured,
        allow_comments: allowComments,
        categories: category ? [category] : [],
        tags: selectedTags,
        // TODO: Handle attachments upload to Supabase Storage
        attachments: []
      }

      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Błąd uwierzytelniania",
          description: "Musisz być zalogowany, aby utworzyć post",
          variant: "destructive"
        })
        return
      }
      
      const result = await postService.createPost(postData, user.id)
      
      if (result.error) {
        throw new Error(result.error)
      }

      setIsSubmitted(true)
      
      // Clear draft
      localStorage.removeItem("post-draft")
      
      toast({
        title: "Sukces!",
        description: "Post został pomyślnie opublikowany",
      })

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setTitle("")
        setContent("")
        setExcerpt("")
        setCategory("")
        setSelectedTags([])
        setMetaDescription("")
        setSlug("")
        setTags([])
        setMainImage(null)
        setAttachments([])
        setStatus('published')
        setIsFeatured(false)
        setAllowComments(true)
      }, 3000)
      
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się utworzyć posta",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary-foreground text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Ładowanie...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary-foreground text-center">
          <h2 className="text-2xl font-bold mb-4">Wymagane uwierzytelnienie</h2>
          <p className="mb-6">Musisz być zalogowany, aby utworzyć nowy post.</p>
          <Link href="/admin/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Przejdź do logowania
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-accent shadow-lg border-b border-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-primary-foreground">
                  Jakub Inwestycje
                </Link>
                <Badge className="bg-primary text-primary-foreground rounded-xl">Panel Twórcy</Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="animate-fade-in">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Post został opublikowany!</h3>
                <p className="text-muted-foreground mb-6">Twój post został pomyślnie dodany do bloga.</p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl">
                    Powrót do strony głównej
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-accent shadow-lg border-b border-accent sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary-foreground">
                Jakub Inwestycje
              </Link>
              <Badge className="bg-primary text-primary-foreground rounded-xl">Panel Twórcy</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsPreview(!isPreview)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? "Edycja" : "Podgląd"}
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Powrót
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2 animate-fade-in">
            {isPreview ? "Podgląd posta" : "Nowy post"}
          </h1>
          <p className="text-muted-foreground animate-fade-in-delay">
            {isPreview ? "Zobacz jak będzie wyglądał Twój post" : "Utwórz nowy post z zaawansowanym edytorem"}
          </p>
        </div>

        {isPreview ? (
          // Preview Mode
          <div className="space-y-8">
            <Card className="bg-card/95 rounded-2xl shadow-2xl">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Badge className="bg-accent text-primary-foreground rounded-xl mb-4">{category || "Kategoria"}</Badge>
                  <h1 className="text-4xl font-bold text-foreground mb-4">{title || "Tytuł posta"}</h1>
                  <p className="text-muted-foreground">{metaDescription || "Meta opis posta"}</p>
                </div>

                {mainImage && (
                  <div className="mb-8">
                    <img
                      src={mainImage || "/placeholder.svg"}
                      alt="Główne zdjęcie"
                      className="w-full h-96 object-cover rounded-xl"
                    />
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || "<p>Treść posta pojawi się tutaj...</p>" }}
                />

                {tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Tagi:</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-card/95 rounded-xl">
                <TabsTrigger value="content">Treść</TabsTrigger>
                <TabsTrigger value="media">Multimedia</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="settings">Ustawienia</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Basic Information */}
                <Card className="bg-card/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">Podstawowe informacje</CardTitle>
                    <CardDescription>Wprowadź tytuł, kategorię i treść swojego posta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-foreground font-medium">
                          Tytuł posta
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="np. Analiza fundamentalna spółki XYZ"
                          required
                          className="border-accent rounded-xl focus:border-primary transition-colors duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-foreground font-medium">
                          Kategoria
                        </Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger className="border-accent rounded-xl focus:border-primary">
                            <SelectValue placeholder="Wybierz kategorię" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-accent rounded-xl shadow-xl">
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rich Text Editor */}
                <RichTextEditor content={content} onChange={setContent} placeholder="Zacznij pisać swój post..." />
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                {/* Main Image */}
                <Card className="bg-card/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">Główne zdjęcie</CardTitle>
                    <CardDescription>Wybierz obraz, który będzie reprezentował Twój post</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="main-image"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-accent border-dashed rounded-2xl cursor-pointer bg-background hover:bg-muted transition-colors duration-300"
                        >
                          {mainImage ? (
                            <img
                              src={mainImage || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-primary" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Kliknij aby wybrać</span> lub przeciągnij plik
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG lub WEBP (MAX. 5MB)</p>
                            </div>
                          )}
                          <input
                            id="main-image"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      {mainImage && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setMainImage(null)}
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl"
                        >
                          Usuń zdjęcie
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Attachments */}
                <Card className="bg-card/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">Załączniki</CardTitle>
                    <CardDescription>Dodaj pliki wspierające - raporty PDF, arkusze Excel, screenshoty</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="attachments"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-accent border-dashed rounded-2xl cursor-pointer bg-background hover:bg-muted transition-colors duration-300"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 mb-2 text-primary" />
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Dodaj załączniki</span>
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, Excel, obrazy</p>
                          </div>
                          <input
                            id="attachments"
                            type="file"
                            className="hidden"
                            multiple
                            accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
                            onChange={handleAttachmentUpload}
                          />
                        </label>
                      </div>

                      {attachments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Dodane załączniki:</h4>
                          <div className="space-y-2">
                            {attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-3 bg-background rounded-xl hover:bg-muted transition-colors duration-300"
                              >
                                <div className="flex items-center space-x-3">
                                  {getAttachmentIcon(attachment.type)}
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttachment(attachment.id)}
                                  className="hover:bg-red-100 hover:text-red-600 transition-colors duration-300 rounded-lg"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <SEOSettings
                  title={title}
                  onTitleChange={setTitle}
                  metaDescription={metaDescription}
                  onMetaDescriptionChange={setMetaDescription}
                  slug={slug}
                  onSlugChange={setSlug}
                  tags={tags}
                  onTagsChange={setTags}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-card/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">Ustawienia publikacji</CardTitle>
                    <CardDescription>Dodatkowe opcje dla Twojego posta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Status publikacji</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="status" 
                              value="draft" 
                              checked={status === 'draft'}
                              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                              className="text-primary" 
                            />
                            <span>Szkic</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="status"
                              value="published"
                              checked={status === 'published'}
                              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                              className="text-primary"
                            />
                            <span>Opublikowany</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name="status" 
                              value="scheduled" 
                              checked={status === 'scheduled'}
                              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                              className="text-primary" 
                            />
                            <span>Zaplanowany</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Opcje dodatkowe</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={isFeatured}
                              onChange={(e) => setIsFeatured(e.target.checked)}
                              className="text-primary" 
                            />
                            <span>Przypnij post</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={!allowComments}
                              onChange={(e) => setAllowComments(!e.target.checked)}
                              className="text-primary" 
                            />
                            <span>Wyłącz komentarze</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Tags Selection */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Tagi</h4>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Wybierz tagi dla swojego posta</Label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-accent rounded-xl">
                          {availableTags.map((tag) => (
                            <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTags([...selectedTags, tag.id])
                                  } else {
                                    setSelectedTags(selectedTags.filter(id => id !== tag.id))
                                  }
                                }}
                                className="text-primary"
                              />
                              <Badge variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            </label>
                          ))}
                        </div>
                        {selectedTags.length > 0 && (
                          <div className="mt-2">
                            <Label className="text-sm text-muted-foreground">Wybrane tagi:</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedTags.map((tagId) => {
                                const tag = availableTags.find(t => t.id === tagId)
                                return tag ? (
                                  <Badge key={tagId} className="bg-primary text-primary-foreground">
                                    {tag.name}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <Label htmlFor="excerpt" className="text-foreground font-medium">
                        Krótki opis (excerpt)
                      </Label>
                      <textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Krótki opis posta, który będzie wyświetlany na liście postów..."
                        rows={3}
                        className="w-full border border-accent rounded-xl p-3 focus:border-primary transition-colors duration-300 resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-border text-muted-foreground hover:bg-muted transition-all duration-300 rounded-xl"
                  >
                    Anuluj
                  </Button>
                </Link>
                <Button
                  type="button"
                  onClick={saveDraft}
                  disabled={isDraft}
                  className="bg-accent hover:bg-accent text-primary-foreground transition-all duration-300 rounded-xl"
                >
                  {isDraft ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Zapisywanie...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Zapisz szkic
                    </>
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publikowanie...
                  </div>
                ) : (
                  "Opublikuj post"
                )}
              </Button>
            </div>
          </form>
        )}
      </main>

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
