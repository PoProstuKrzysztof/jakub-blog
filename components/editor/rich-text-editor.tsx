"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import { Toolbar } from "./toolbar"
import { MediaUpload } from "./media-upload"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Zacznij pisać..." }: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#864AF9] hover:text-[#7c42e8] underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)

      // Update word and character count
      const stats = editor.storage.characterCount
      setWordCount(stats.words())
      setCharCount(stats.characters())
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6",
      },
    },
  })

  // Auto-save functionality
  useEffect(() => {
    if (!editor) return

    const interval = setInterval(() => {
      const content = editor.getHTML()
      localStorage.setItem("draft-content", content)
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(interval)
  }, [editor])

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("draft-content")
    if (savedDraft && !content && editor) {
      editor.commands.setContent(savedDraft)
    }
  }, [editor, content])

  if (!editor) {
    return (
      <Card className="bg-white/95 rounded-2xl shadow-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      <Card className="bg-white/95 rounded-2xl shadow-2xl h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Toolbar */}
          <Toolbar
            editor={editor}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />

          {/* Editor Content */}
          <div className="flex-1 overflow-auto">
            <EditorContent editor={editor} className="h-full" />
          </div>

          {/* Media Upload */}
          <MediaUpload editor={editor} />

          {/* Status Bar */}
          <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex space-x-4">
                <span>{wordCount} słów</span>
                <span>{charCount} znaków</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Automatyczny zapis włączony</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
