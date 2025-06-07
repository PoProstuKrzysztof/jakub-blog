"use client"

import type React from "react"

import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Upload, Video } from "lucide-react"
import { useState, useRef } from "react"

interface MediaUploadProps {
  editor: Editor
}

export function MediaUpload({ editor }: MediaUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageAlign, setImageAlign] = useState("center")
  const [videoUrl, setVideoUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        insertImage(url)
      }
      reader.readAsDataURL(file)
    }
  }

  const insertImage = (url: string) => {
    if (url) {
      const alignClass =
        imageAlign === "left" ? "float-left mr-4" : imageAlign === "right" ? "float-right ml-4" : "mx-auto block"

      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: imageAlt || "Obraz",
          title: alignClass,
        })
        .run()

      setImageUrl("")
      setImageAlt("")
      setImageAlign("center")
      setIsOpen(false)
    }
  }

  const insertVideo = () => {
    if (videoUrl) {
      let embedCode = ""

      // YouTube
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const videoId = videoUrl.includes("youtu.be")
          ? videoUrl.split("/").pop()?.split("?")[0]
          : videoUrl.split("v=")[1]?.split("&")[0]

        if (videoId) {
          embedCode = `<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                    frameborder="0" 
                    allowfullscreen>
            </iframe>
          </div>`
        }
      }
      // Vimeo
      else if (videoUrl.includes("vimeo.com")) {
        const videoId = videoUrl.split("/").pop()
        if (videoId) {
          embedCode = `<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #000;">
            <iframe src="https://player.vimeo.com/video/${videoId}" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                    frameborder="0" 
                    allowfullscreen>
            </iframe>
          </div>`
        }
      }

      if (embedCode) {
        editor.chain().focus().insertContent(embedCode).run()
        setVideoUrl("")
        setIsOpen(false)
      }
    }
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="m-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <ImageIcon className="h-4 w-4 mr-2" />
            Dodaj multimedia
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dodaj multimedia</DialogTitle>
            <DialogDescription>Wybierz typ multimediów, które chcesz dodać do posta</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="image">Obraz</TabsTrigger>
              <TabsTrigger value="video">Wideo</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4">
              <div className="space-y-4">
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
                  <Label htmlFor="image-alt">Tekst alternatywny (Alt)</Label>
                  <Input
                    id="image-alt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Opis obrazu dla czytników ekranu"
                  />
                </div>

                <div>
                  <Label htmlFor="image-align">Wyrównanie</Label>
                  <Select value={imageAlign} onValueChange={setImageAlign}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Do lewej</SelectItem>
                      <SelectItem value="center">Wyśrodkowany</SelectItem>
                      <SelectItem value="right">Do prawej</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => insertImage(imageUrl)}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!imageUrl}
                >
                  Wstaw obraz
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-url">URL wideo</Label>
                  <Input
                    id="video-url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... lub https://vimeo.com/..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">Obsługiwane platformy: YouTube, Vimeo</p>
                </div>

                <Button onClick={insertVideo} className="w-full bg-primary hover:bg-primary/90" disabled={!videoUrl}>
                  <Video className="h-4 w-4 mr-2" />
                  Wstaw wideo
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Przeciągnij i upuść obraz lub kliknij aby wybrać</p>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    Wybierz plik
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">Obsługiwane formaty: JPG, PNG, GIF, WEBP (max 5MB)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
