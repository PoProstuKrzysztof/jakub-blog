"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Skeleton loading component dla edytora
function EditorSkeleton() {
  return (
    <div className="border rounded-lg">
      {/* Toolbar skeleton */}
      <div className="border-b p-2 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
      
      {/* Editor content skeleton */}
      <div className="p-4 min-h-[400px] space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  )
}

// Uproszczony dynamiczny import dla Next.js 15
const RichTextEditorCore = dynamic(
  () => import('./rich-text-editor').then(mod => ({ default: mod.RichTextEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
)

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditorDynamic(props: RichTextEditorProps) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <RichTextEditorCore {...props} />
    </Suspense>
  )
} 