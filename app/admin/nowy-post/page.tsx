"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Plus, X, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CategoryService } from '@/lib/services/category-service'
import { TagService } from '@/lib/services/tag-service'
import { PostService } from '@/lib/services/post-service'
import { createClient } from '@/lib/supabase'
import { Category } from '@/lib/models/category'
import { Tag } from '@/lib/models/tag'
import { RichTextEditorDynamic } from '@/components/editor/rich-text-editor-dynamic'
import Image from 'next/image'
import Link from 'next/link'

interface PostFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
  categories: string[]
  tags: string[]
  is_featured: boolean
}

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // Services
  const [categoryService] = useState(() => new CategoryService())
  const [tagService] = useState(() => new TagService())
  const [postService] = useState(() => new PostService(createClient()))

  // Form state
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    categories: [],
    tags: [],
    is_featured: false
  })

  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [newTag, setNewTag] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [slugError, setSlugError] = useState('')
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)

  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('')

  // Load categories and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          categoryService.getCategories(),
          tagService.getTags()
        ])

        if (categoriesResponse.data) {
          setCategories(categoriesResponse.data)
        }

        if (tagsResponse.data) {
          setTags(tagsResponse.data)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: 'Błąd',
          description: 'Nie udało się załadować kategorii i tagów',
          variant: 'destructive'
        })
      }
    }

    loadData()
  }, [categoryService, tagService, toast])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, formData.slug])

  // Debounced slug checking
  useEffect(() => {
    if (!formData.slug) {
      setSlugError('')
      return
    }

    const timeoutId = setTimeout(() => {
      checkSlugUniqueness(formData.slug)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.slug])

  const checkSlugUniqueness = async (slug: string) => {
    if (!slug.trim()) {
      setSlugError('')
      return
    }

    setIsCheckingSlug(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .limit(1)

      if (error) {
        console.error('Error checking slug:', error)
        setSlugError('Nie udało się sprawdzić unikalności slug')
        return
      }

      if (data && data.length > 0) {
        setSlugError('Ten slug już istnieje. Proszę wybrać inny.')
      } else {
        setSlugError('')
      }
    } catch (error) {
      console.error('Error checking slug:', error)
      setSlugError('Nie udało się sprawdzić unikalności slug')
    } finally {
      setIsCheckingSlug(false)
    }
  }

  const handleInputChange = (field: keyof PostFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFeaturedImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const response = await categoryService.createCategory({
        name: newCategory.trim(),
        slug: newCategory.toLowerCase().replace(/\s+/g, '-')
      })

      if (response.data) {
        setCategories(prev => [...prev, response.data!])
        setFormData(prev => ({
          ...prev,
          categories: [...prev.categories, response.data!.id]
        }))
        setNewCategory('')
        toast({
          title: 'Sukces',
          description: 'Kategoria została dodana'
        })
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać kategorii',
        variant: 'destructive'
      })
    }
  }

  const addTag = async () => {
    if (!newTag.trim()) return

    try {
      const response = await tagService.createTag({
        name: newTag.trim(),
        slug: newTag.toLowerCase().replace(/\s+/g, '-')
      })

      if (response.data) {
        setTags(prev => [...prev, response.data!])
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, response.data!.id]
        }))
        setNewTag('')
        toast({
          title: 'Sukces',
          description: 'Tag został dodany'
        })
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać tagu',
        variant: 'destructive'
      })
    }
  }

  const removeCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(id => id !== categoryId)
    }))
  }

  const removeTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(id => id !== tagId)
    }))
  }

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!formData.title.trim()) {
      toast({
        title: 'Błąd',
        description: 'Tytuł jest wymagany',
        variant: 'destructive'
      })
      return
    }

    if (slugError) {
      toast({
        title: 'Błąd',
        description: 'Proszę poprawić błędy przed zapisaniem posta',
        variant: 'destructive'
      })
      return
    }

    setIsSaving(true)

    try {
      // Get current user
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Nie udało się pobrać danych użytkownika')
      }

      // Upload featured image if exists
      let featuredImageUrl = formData.featured_image_url
      if (featuredImage) {
        try {
          // Generate unique filename
          const fileExt = featuredImage.name.split('.').pop()?.toLowerCase() || 'jpg'
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `posts/${fileName}`

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, featuredImage, {
              contentType: featuredImage.type,
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            throw new Error(`Błąd uploadu obrazu: ${uploadError.message}`)
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath)

          featuredImageUrl = publicUrl
        } catch (uploadError) {
          console.error('Error uploading featured image:', uploadError)
          toast({
            title: 'Ostrzeżenie',
            description: 'Nie udało się przesłać obrazu głównego. Post zostanie zapisany bez obrazu.',
            variant: 'destructive'
          })
          // Continue without featured image
          featuredImageUrl = undefined
        }
      }

      const postData = {
        title: formData.title,
        slug: formData.slug?.trim() || '', // PostService wygeneruje unikalny slug jeśli pusty
        excerpt: formData.excerpt,
        content: formData.content,
        status,
        featured_image_url: featuredImageUrl,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        is_featured: formData.is_featured,
        categories: formData.categories,
        tags: formData.tags
      }

      const response = await postService.createPost(postData, user.id)

      if (response.data) {
        toast({
          title: 'Sukces',
          description: `Post został ${status === 'published' ? 'opublikowany' : 'zapisany jako szkic'}`
        })
        router.push('/admin')
      } else {
        throw new Error(response.error || 'Nie udało się zapisać posta')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      const errorMessage = error instanceof Error ? error.message : 'Nie udało się zapisać posta'
      toast({
        title: 'Błąd',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nowy Post</h1>
          <p className="text-muted-foreground">
            Utwórz nowy post na blogu
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Zapisz szkic
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={isSaving}
          >
            <FileText className="mr-2 h-4 w-4" />
            Opublikuj
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Treść</TabsTrigger>
              <TabsTrigger value="settings">Ustawienia</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Podstawowe informacje</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tytuł *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Wprowadź tytuł posta"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="slug-posta"
                      className={slugError ? 'border-red-500' : ''}
                    />
                    {isCheckingSlug && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Sprawdzanie unikalności...
                      </p>
                    )}
                    {slugError && (
                      <p className="text-sm text-red-500 mt-1">
                        {slugError}
                      </p>
                    )}
                    {!slugError && !isCheckingSlug && formData.slug && (
                      <p className="text-sm text-green-600 mt-1">
                        Slug jest dostępny
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Krótki opis posta..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Treść posta</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Użyj zaawansowanego edytora do tworzenia bogatej treści z obrazami, filmami i wykresami
                  </p>
                </CardHeader>
                <CardContent>
                  <RichTextEditorDynamic
                    content={formData.content}
                    onChange={handleContentChange}
                    placeholder="Napisz treść posta..."
                    className="min-h-[500px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Obraz wyróżniający</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="featured-image">Wybierz obraz</Label>
                    <Input
                      id="featured-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                  {featuredImagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={featuredImagePreview}
                        alt="Podgląd obrazu wyróżniającego"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Opcje posta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Post wyróżniony</Label>
                    <Switch
                      id="featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Szkic</SelectItem>
                        <SelectItem value="published">Opublikowany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Optymalizacja SEO</CardTitle>
                  <CardDescription>
                    Ustawienia meta tagów dla wyszukiwarek
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="meta-title">Meta tytuł</Label>
                    <Input
                      id="meta-title"
                      value={formData.meta_title || ''}
                      onChange={(e) => handleInputChange('meta_title', e.target.value)}
                      placeholder="Tytuł dla wyszukiwarek"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meta-description">Meta opis</Label>
                    <Textarea
                      id="meta-description"
                      value={formData.meta_description || ''}
                      onChange={(e) => handleInputChange('meta_description', e.target.value)}
                      placeholder="Opis dla wyszukiwarek..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Kategorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nowa kategoria"
                />
                <Button size="sm" onClick={addCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('categories', [...formData.categories, category.id])
                          } else {
                            removeCategory(category.id)
                          }
                        }}
                      />
                      <span>{category.name}</span>
                    </Label>
                  </div>
                ))}
              </div>

              {formData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((categoryId) => {
                    const category = categories.find(c => c.id === categoryId)
                    return category ? (
                      <Badge key={categoryId} variant="secondary">
                        {category.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0"
                          onClick={() => removeCategory(categoryId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tagi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nowy tag"
                />
                <Button size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('tags', [...formData.tags, tag.id])
                          } else {
                            removeTag(tag.id)
                          }
                        }}
                      />
                      <span>{tag.name}</span>
                    </Label>
                  </div>
                ))}
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId)
                    return tag ? (
                      <Badge key={tagId} variant="outline">
                        {tag.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0"
                          onClick={() => removeTag(tagId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.content && (
            <Card>
              <CardHeader>
                <CardTitle>Podgląd</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold">{formData.title || 'Tytuł posta'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.excerpt || 'Excerpt posta...'}
                  </p>
                  {featuredImagePreview && (
                    <div className="relative w-full h-32 rounded overflow-hidden">
                      <Image
                        src={featuredImagePreview}
                        alt="Podgląd"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Czas czytania: ~{calculateReadingTime(formData.content)} min
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex space-x-4">
          <Link href="/admin">
            <Button variant="outline" className="rounded-xl">
              Anuluj
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
