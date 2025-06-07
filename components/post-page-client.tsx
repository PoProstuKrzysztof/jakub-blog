"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { CalendarDays, Eye, Download, FileText, ArrowLeft, User, Share2, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PostFull } from "@/lib/models/post"
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface PostPageClientProps {
  post: PostFull
  user: SupabaseUser | null
}

export function PostPageClient({ post, user }: PostPageClientProps) {
  const [copied, setCopied] = useState(false)

  const sharePost = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Brak daty'
    return new Date(dateString).toLocaleDateString("pl-PL")
  }

  const getMainCategory = () => {
    return post.post_categories?.[0]?.categories?.name || 'Bez kategorii'
  }

  const getAuthorName = () => {
    return post.profiles?.full_name || post.profiles?.username || 'Nieznany autor'
  }

  const getAuthorInitials = () => {
    const name = getAuthorName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Simple content renderer for HTML content
  const renderContent = (content: string) => {
    return (
      <div 
        className="prose prose-lg prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        currentPage="post"
        adminMode={true}
        showShareButton={true}
        onShare={sharePost}
        shareButtonCopied={copied}
        user={user}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.is_featured && (
              <Badge className="bg-primary text-primary-foreground rounded-xl shadow-lg animate-pulse">
                Przypięty
              </Badge>
            )}
            <Badge className="bg-accent text-accent-foreground rounded-xl shadow-lg">
              {getMainCategory().toUpperCase()}
            </Badge>
            <Badge className="bg-secondary text-secondary-foreground rounded-xl shadow-lg">
              {post.status === 'published' ? 'Opublikowany' : 'Szkic'}
            </Badge>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center text-muted-foreground gap-6 mb-8 animate-fade-in-delay">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              {formatDate(post.published_at || post.created_at)}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {post.view_count || 0} wyświetleń
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {getAuthorName()}
            </div>
          </div>

          {/* Main Image */}
          <div className="relative h-96 lg:h-[500px] mb-8 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.02] animate-fade-in-delay">
            <Image 
              src={post.featured_image_url || "/images/default-post.svg"} 
              alt={post.title} 
              fill 
              className="object-cover" 
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - Now takes 3/4 of the width */}
          <div className="lg:col-span-3">
            <Card className="bg-card rounded-2xl shadow-2xl">
              <CardContent className="p-8 lg:p-12">
                {/* Excerpt */}
                {post.excerpt && (
                  <div className="mb-8 p-4 bg-muted rounded-lg border-l-4 border-primary">
                    <p className="text-lg text-muted-foreground italic">{post.excerpt}</p>
                  </div>
                )}
                
                {/* Content */}
                <div className="prose prose-lg prose-gray max-w-none">
                  {post.content ? renderContent(post.content) : (
                    <p className="text-muted-foreground">Brak treści do wyświetlenia.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Now takes 1/4 of the width */}
          <div className="lg:col-span-1 space-y-6">
            {/* Attachments */}
            {post.post_attachments && post.post_attachments.length > 0 && (
              <Card className="bg-card rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Materiały do pobrania</h3>
                  <div className="space-y-3">
                    {post.post_attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted rounded-xl hover:bg-muted/80 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-start space-x-3">
                          <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground break-words leading-tight">
                              {attachment.attachments?.original_filename || 'Plik'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {attachment.attachments?.file_size ? 
                                `${(attachment.attachments.file_size / 1024 / 1024).toFixed(1)} MB` : 
                                'Nieznany rozmiar'
                              }
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-shrink-0 p-1 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-lg"
                            onClick={() => {
                              if (attachment.attachments?.public_url) {
                                window.open(attachment.attachments.public_url, '_blank')
                              }
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Author Info */}
            <Card className="bg-card rounded-2xl shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">O autorze</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold shadow-lg">
                    {getAuthorInitials()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{getAuthorName()}</p>
                    <p className="text-sm text-muted-foreground">Autor bloga</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Specjalista w dziedzinie analizy finansowej i inwestycji.
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            {post.post_tags && post.post_tags.length > 0 && (
              <Card className="bg-card rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Tagi</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.post_tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {tag.tags?.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
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