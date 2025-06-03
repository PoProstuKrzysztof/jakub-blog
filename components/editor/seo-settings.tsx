"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Globe, Tag } from "lucide-react"

interface SEOSettingsProps {
  title: string
  onTitleChange: (title: string) => void
  metaDescription: string
  onMetaDescriptionChange: (description: string) => void
  slug: string
  onSlugChange: (slug: string) => void
  tags: string[]
  onTagsChange: (tags: string[]) => void
}

export function SEOSettings({
  title,
  onTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  slug,
  onSlugChange,
  tags,
  onTagsChange,
}: SEOSettingsProps) {
  const [newTag, setNewTag] = useState("")

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (newTitle: string) => {
    onTitleChange(newTitle)
    if (!slug || slug === generateSlug(title)) {
      onSlugChange(generateSlug(newTitle))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Card className="bg-white/95 rounded-2xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-[#332941] flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Optymalizacja SEO
        </CardTitle>
        <CardDescription>Zoptymalizuj swój post dla wyszukiwarek internetowych</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="meta-title" className="text-[#332941] font-medium">
            Tytuł SEO
          </Label>
          <Input
            id="meta-title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Wprowadź tytuł dla SEO"
            className="border-[#3B3486] rounded-xl focus:border-[#864AF9]"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Długość: {title.length} znaków</span>
            <span
              className={`${title.length > 60 ? "text-red-500" : title.length > 50 ? "text-yellow-500" : "text-green-500"}`}
            >
              {title.length > 60 ? "Za długi" : title.length > 50 ? "Dobry" : "Optymalny"}
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="meta-description" className="text-[#332941] font-medium">
            Meta opis
          </Label>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="Krótki opis posta, który pojawi się w wynikach wyszukiwania"
            className="border-[#3B3486] rounded-xl focus:border-[#864AF9] min-h-[80px]"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Długość: {metaDescription.length} znaków</span>
            <span
              className={`${metaDescription.length > 160 ? "text-red-500" : metaDescription.length > 140 ? "text-yellow-500" : "text-green-500"}`}
            >
              {metaDescription.length > 160 ? "Za długi" : metaDescription.length > 140 ? "Dobry" : "Optymalny"}
            </span>
          </div>
        </div>

        {/* URL Slug */}
        <div className="space-y-2">
          <Label htmlFor="url-slug" className="text-[#332941] font-medium flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            URL posta
          </Label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">jakub-inwestycje.com/post/</span>
            <Input
              id="url-slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="url-posta"
              className="border-[#3B3486] rounded-xl focus:border-[#864AF9]"
            />
          </div>
          <p className="text-sm text-gray-500">URL powinien być krótki, opisowy i zawierać słowa kluczowe</p>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-[#332941] font-medium flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Tagi
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Dodaj tag i naciśnij Enter"
              className="border-[#3B3486] rounded-xl focus:border-[#864AF9]"
            />
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#864AF9] text-white hover:bg-[#7c42e8] cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-500">Dodaj tagi związane z tematem posta. Kliknij tag aby go usunąć.</p>
        </div>

        {/* SEO Preview */}
        <div className="space-y-2">
          <Label className="text-[#332941] font-medium">Podgląd w Google</Label>
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">{title || "Tytuł posta"}</div>
            <div className="text-green-700 text-sm">jakub-inwestycje.com/post/{slug || "url-posta"}</div>
            <div className="text-gray-600 text-sm mt-1">{metaDescription || "Meta opis posta pojawi się tutaj..."}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
