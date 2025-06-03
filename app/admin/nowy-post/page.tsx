"use client"

import React from "react"
import { useState } from "react"
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

interface Attachment {
  id: string
  name: string
  type: "pdf" | "excel" | "image"
  size: string
}

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  // SEO Settings
  const [metaDescription, setMetaDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // Preview mode
  const [isPreview, setIsPreview] = useState(false)

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
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const saveDraft = async () => {
    setIsDraft(true)
    // Simulate saving draft
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsDraft(false)

    // Save to localStorage
    const draftData = {
      title,
      content,
      category,
      metaDescription,
      slug,
      tags,
      mainImage,
      attachments,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem("post-draft", JSON.stringify(draftData))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Clear draft
    localStorage.removeItem("post-draft")

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setTitle("")
      setContent("")
      setCategory("")
      setMetaDescription("")
      setSlug("")
      setTags([])
      setMainImage(null)
      setAttachments([])
    }, 3000)
  }

  // Load draft on component mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem("post-draft")
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft)
      setTitle(draftData.title || "")
      setContent(draftData.content || "")
      setCategory(draftData.category || "")
      setMetaDescription(draftData.metaDescription || "")
      setSlug(draftData.slug || "")
      setTags(draftData.tags || [])
      setMainImage(draftData.mainImage || null)
      setAttachments(draftData.attachments || [])
    }
  }, [])

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#413B61" }}>
        <header className="bg-[#332941] shadow-lg border-b border-[#3B3486]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-white">
                  Jakub Inwestycje
                </Link>
                <Badge className="bg-[#864AF9] text-white rounded-xl">Panel Twórcy</Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white/95 rounded-2xl shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="animate-fade-in">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#332941] mb-2">Post został opublikowany!</h3>
                <p className="text-gray-600 mb-6">Twój post został pomyślnie dodany do bloga.</p>
                <Link href="/">
                  <Button className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl">
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
    <div className="min-h-screen" style={{ backgroundColor: "#413B61" }}>
      {/* Header */}
      <header className="bg-[#332941] shadow-lg border-b border-[#3B3486] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-white">
                Jakub Inwestycje
              </Link>
              <Badge className="bg-[#864AF9] text-white rounded-xl">Panel Twórcy</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsPreview(!isPreview)}
                variant="outline"
                className="border-[#864AF9] text-[#864AF9] hover:bg-[#864AF9] hover:text-white transition-all duration-300 rounded-xl"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? "Edycja" : "Podgląd"}
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-300 hover:bg-gray-100 hover:text-gray-800 transition-all duration-300 rounded-xl"
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
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">
            {isPreview ? "Podgląd posta" : "Nowy post"}
          </h1>
          <p className="text-gray-300 animate-fade-in-delay">
            {isPreview ? "Zobacz jak będzie wyglądał Twój post" : "Utwórz nowy post z zaawansowanym edytorem"}
          </p>
        </div>

        {isPreview ? (
          // Preview Mode
          <div className="space-y-8">
            <Card className="bg-white/95 rounded-2xl shadow-2xl">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Badge className="bg-[#3B3486] text-white rounded-xl mb-4">{category || "Kategoria"}</Badge>
                  <h1 className="text-4xl font-bold text-[#332941] mb-4">{title || "Tytuł posta"}</h1>
                  <p className="text-gray-600">{metaDescription || "Meta opis posta"}</p>
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
                  <div className="mt-8 pt-8 border-t border-gray-200">
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
              <TabsList className="grid w-full grid-cols-4 bg-white/95 rounded-xl">
                <TabsTrigger value="content">Treść</TabsTrigger>
                <TabsTrigger value="media">Multimedia</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="settings">Ustawienia</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Basic Information */}
                <Card className="bg-white/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#332941]">Podstawowe informacje</CardTitle>
                    <CardDescription>Wprowadź tytuł, kategorię i treść swojego posta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-[#332941] font-medium">
                          Tytuł posta
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="np. Analiza fundamentalna spółki XYZ"
                          required
                          className="border-[#3B3486] rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-[#332941] font-medium">
                          Kategoria
                        </Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger className="border-[#3B3486] rounded-xl focus:border-[#864AF9]">
                            <SelectValue placeholder="Wybierz kategorię" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#3B3486] rounded-xl shadow-xl">
                            <SelectItem value="analizy">Analizy spółek</SelectItem>
                            <SelectItem value="edukacja">Edukacja</SelectItem>
                            <SelectItem value="rynek">Przegląd rynku</SelectItem>
                            <SelectItem value="crypto">Kryptowaluty</SelectItem>
                            <SelectItem value="narzedzia">Narzędzia</SelectItem>
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
                <Card className="bg-white/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#332941]">Główne zdjęcie</CardTitle>
                    <CardDescription>Wybierz obraz, który będzie reprezentował Twój post</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="main-image"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#3B3486] border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                          {mainImage ? (
                            <img
                              src={mainImage || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-[#864AF9]" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Kliknij aby wybrać</span> lub przeciągnij plik
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG lub WEBP (MAX. 5MB)</p>
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
                          className="w-full border-[#864AF9] text-[#864AF9] hover:bg-[#864AF9] hover:text-white transition-all duration-300 rounded-xl"
                        >
                          Usuń zdjęcie
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Attachments */}
                <Card className="bg-white/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#332941]">Załączniki</CardTitle>
                    <CardDescription>Dodaj pliki wspierające - raporty PDF, arkusze Excel, screenshoty</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="attachments"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#3B3486] border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 mb-2 text-[#864AF9]" />
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">Dodaj załączniki</span>
                            </p>
                            <p className="text-xs text-gray-500">PDF, Excel, obrazy</p>
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
                          <h4 className="font-medium text-[#332941]">Dodane załączniki:</h4>
                          <div className="space-y-2">
                            {attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                              >
                                <div className="flex items-center space-x-3">
                                  {getAttachmentIcon(attachment.type)}
                                  <div>
                                    <p className="text-sm font-medium text-[#332941]">{attachment.name}</p>
                                    <p className="text-xs text-gray-500">{attachment.size}</p>
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
                <Card className="bg-white/95 rounded-2xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#332941]">Ustawienia publikacji</CardTitle>
                    <CardDescription>Dodatkowe opcje dla Twojego posta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-[#332941]">Status publikacji</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="status" value="draft" className="text-[#864AF9]" />
                            <span>Szkic</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="status"
                              value="published"
                              className="text-[#864AF9]"
                              defaultChecked
                            />
                            <span>Opublikowany</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name="status" value="scheduled" className="text-[#864AF9]" />
                            <span>Zaplanowany</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-[#332941]">Opcje dodatkowe</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-[#864AF9]" />
                            <span>Przypnij post</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-[#864AF9]" />
                            <span>Wyłącz komentarze</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="text-[#864AF9]" defaultChecked />
                            <span>Wyślij powiadomienie</span>
                          </label>
                        </div>
                      </div>
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
                    className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-300 rounded-xl"
                  >
                    Anuluj
                  </Button>
                </Link>
                <Button
                  type="button"
                  onClick={saveDraft}
                  disabled={isDraft}
                  className="bg-[#3B3486] hover:bg-[#332941] text-white transition-all duration-300 rounded-xl"
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
                className="bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-70"
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
