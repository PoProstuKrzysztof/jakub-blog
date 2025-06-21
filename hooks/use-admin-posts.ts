"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/supabase'
import { PostFull } from '@/lib/models/post'

interface AdminStats {
  totalViews: number
  publishedPosts: number
  draftPosts: number
  averageViews: number
}

interface UseAdminPostsReturn {
  posts: PostFull[]
  stats: AdminStats | null
  loading: boolean
  error: string | null
  refreshPosts: () => Promise<void>
  deletePost: (id: string) => Promise<boolean>
  updatePost: (id: string, data: { title: string }) => Promise<boolean>
}

export function useAdminPosts(): UseAdminPostsReturn {
  const [posts, setPosts] = useState<PostFull[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Pobierz wszystkie posty (nie tylko opublikowane) dla admina
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          post_categories (
            categories (
              id,
              name,
              slug,
              color
            )
          ),
          post_tags (
            tags (
              id,
              name,
              slug,
              color
            )
          ),
          post_attachments (
            attachments (
              id,
              original_filename,
              public_url,
              mime_type,
              file_size
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (postsError) {
        throw postsError
      }

      const posts = postsData || []
      setPosts(posts)

      // Oblicz statystyki
      const publishedPosts = posts.filter(post => post.status === 'published').length
      const draftPosts = posts.filter(post => post.status === 'draft').length
      const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0)
      const averageViews = publishedPosts > 0 ? Math.round(totalViews / publishedPosts) : 0

      setStats({
        totalViews,
        publishedPosts,
        draftPosts,
        averageViews
      })

    } catch (err) {
      console.error('Error fetching posts:', err)
      setError(err instanceof Error ? err.message : 'Błąd podczas pobierania postów')
    } finally {
      setLoading(false)
    }
  }

  const refreshPosts = async () => {
    await fetchPosts()
  }

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      // Odśwież listę postów po usunięciu
      await refreshPosts()
      return true
    } catch (err) {
      console.error('Error deleting post:', err)
      setError(err instanceof Error ? err.message : 'Błąd podczas usuwania posta')
      return false
    }
  }

  const updatePost = async (id: string, data: { title: string }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: data.title,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      // Odśwież listę postów po aktualizacji
      await refreshPosts()
      return true
    } catch (err) {
      console.error('Error updating post:', err)
      setError(err instanceof Error ? err.message : 'Błąd podczas aktualizacji posta')
      return false
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return {
    posts,
    stats,
    loading,
    error,
    refreshPosts,
    deletePost,
    updatePost
  }
} 