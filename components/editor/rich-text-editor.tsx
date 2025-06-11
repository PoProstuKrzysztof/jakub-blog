"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { Youtube } from "@tiptap/extension-youtube"
import { Link } from "@tiptap/extension-link"
import { TextAlign } from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { Superscript } from "@tiptap/extension-superscript"
import { Subscript } from "@tiptap/extension-subscript"
import { Highlight } from "@tiptap/extension-highlight"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { TaskList } from "@tiptap/extension-task-list"
import { TaskItem } from "@tiptap/extension-task-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Palette,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  CheckSquare,
  BarChart3,
  PieChart,
  LineChart,
  Upload
} from "lucide-react"
import { useState, useCallback, useRef } from "react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Zacznij pisać...", className }: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false)
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  const [chartData, setChartData] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: "rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4",
      },
    },
  })

  const addLink = useCallback(() => {
    if (!editor) return

    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
    }

    setLinkUrl('')
    setLinkText('')
    setIsLinkDialogOpen(false)
  }, [editor, linkUrl, linkText])

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return

    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run()
    setImageUrl('')
    setImageAlt('')
    setIsImageDialogOpen(false)
  }, [editor, imageUrl, imageAlt])

  const addYoutube = useCallback(() => {
    if (!editor || !youtubeUrl) return

    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()
    setYoutubeUrl('')
    setIsYoutubeDialogOpen(false)
  }, [editor, youtubeUrl])

  const addChart = useCallback(() => {
    if (!editor || !chartData) return

    try {
      const data = JSON.parse(chartData)
      const chartId = `chart-${Date.now()}`
      
      // Wstawiamy placeholder dla wykresu
      editor.chain().focus().insertContent(`
        <div class="chart-container" data-chart-type="${chartType}" data-chart-data="${encodeURIComponent(chartData)}" data-chart-id="${chartId}">
          <div class="chart-placeholder bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p class="text-gray-600">Wykres ${chartType.toUpperCase()}</p>
            <p class="text-sm text-gray-500">Kliknij aby edytować</p>
          </div>
        </div>
      `).run()

      setChartData('')
      setIsChartDialogOpen(false)
    } catch (error) {
      console.error('Invalid chart data:', error)
    }
  }, [editor, chartType, chartData])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    try {
      // Import Supabase client
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()

      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `editor/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          contentType: file.type,
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

      // Insert image into editor
      editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run()
      
      // Reset file input
      if (event.target) {
        event.target.value = ''
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      // Fallback to base64 if upload fails
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        editor.chain().focus().setImage({ src: result, alt: file.name }).run()
      }
      reader.readAsDataURL(file)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
      type="button"
    >
      {children}
    </Button>
  )

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-2 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {/* Formatowanie tekstu */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Pogrubienie (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Kursywa (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Podkreślenie (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Przekreślenie"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Kod"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Indeks górny/dolny */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              isActive={editor.isActive('superscript')}
              title="Indeks górny"
            >
              <SuperscriptIcon className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              isActive={editor.isActive('subscript')}
              title="Indeks dolny"
            >
              <SubscriptIcon className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Nagłówki */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Nagłówek 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Nagłówek 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Nagłówek 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Wyrównanie */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Wyrównaj do lewej"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Wyśrodkuj"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Wyrównaj do prawej"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              title="Wyjustuj"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Listy */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Lista punktowana"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Lista numerowana"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive('taskList')}
              title="Lista zadań"
            >
              <CheckSquare className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Cytaty i tabele */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Cytat"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              title="Wstaw tabelę"
            >
              <TableIcon className="h-4 w-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Media */}
          <div className="flex gap-1">
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Dodaj link" className="h-8 w-8 p-0">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dodaj link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-text">Tekst linku (opcjonalnie)</Label>
                    <Input
                      id="link-text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Tekst do wyświetlenia"
                    />
                  </div>
                  <Button onClick={addLink} className="w-full">
                    Dodaj link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Dodaj obraz" className="h-8 w-8 p-0">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dodaj obraz</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="url">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label htmlFor="image-url">URL obrazu</Label>
                      <Input
                        id="image-url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-alt">Tekst alternatywny</Label>
                      <Input
                        id="image-alt"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Opis obrazu"
                      />
                    </div>
                    <Button onClick={addImage} className="w-full">
                      Dodaj obraz
                    </Button>
                  </TabsContent>
                  <TabsContent value="upload" className="space-y-4">
                    <div>
                      <Label htmlFor="image-file">Wybierz plik</Label>
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Dodaj wideo YouTube" className="h-8 w-8 p-0">
                  <YoutubeIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dodaj wideo YouTube</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="youtube-url">URL YouTube</Label>
                    <Input
                      id="youtube-url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <Button onClick={addYoutube} className="w-full">
                    Dodaj wideo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isChartDialogOpen} onOpenChange={setIsChartDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" title="Dodaj wykres" className="h-8 w-8 p-0">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Dodaj wykres</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chart-type">Typ wykresu</Label>
                    <Select value={chartType} onValueChange={(value: 'bar' | 'line' | 'pie') => setChartType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Słupkowy</SelectItem>
                        <SelectItem value="line">Liniowy</SelectItem>
                        <SelectItem value="pie">Kołowy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="chart-data">Dane wykresu (JSON)</Label>
                    <textarea
                      id="chart-data"
                      value={chartData}
                      onChange={(e) => setChartData(e.target.value)}
                      placeholder={`{
  "labels": ["Styczeń", "Luty", "Marzec"],
  "datasets": [{
    "label": "Sprzedaż",
    "data": [12, 19, 3],
    "backgroundColor": ["#FFCB74", "#2F2F2F", "#F6F6F6"]
  }]
}`}
                      className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                    />
                  </div>
                  <Button onClick={addChart} className="w-full">
                    Dodaj wykres
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Cofnij/Ponów */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Cofnij (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Ponów (Ctrl+Y)"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] max-h-[600px] overflow-y-auto"
      />
    </div>
  )
}
