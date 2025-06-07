import { SupabaseClient } from '@supabase/supabase-js'
import {
  Post,
  PostFull,
  PostInsert,
  PostUpdate,
  CreatePostData,
  UpdatePostData,
  PostFilters,
  PostSortOptions,
  PostPagination,
  PostsResponse,
  PostResponse,
  POST_STATUS
} from '../models/post'

export class PostService {
  private supabase: SupabaseClient

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient
  }

  private async getSupabaseClient() {
    return this.supabase instanceof Promise ? await this.supabase : this.supabase
  }

  /**
   * Pobiera wszystkie posty z filtrami, sortowaniem i paginacją
   */
  async getPosts(
    filters: PostFilters = {},
    sort: PostSortOptions = { field: 'created_at', direction: 'desc' },
    pagination: PostPagination = { page: 1, limit: 10, offset: 0 }
  ): Promise<PostsResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      let query = supabase
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
        `, { count: 'exact' })

      // Aplikowanie filtrów
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.author_id) {
        query = query.eq('author_id', filters.author_id)
      }

      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured)
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      // Sortowanie
      query = query.order(sort.field, { ascending: sort.direction === 'asc' })

      // Paginacja
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      const totalPages = Math.ceil((count || 0) / pagination.limit)

      return {
        data: data as PostFull[],
        count: count || 0,
        page: pagination.page,
        limit: pagination.limit,
        total_pages: totalPages
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  /**
   * Pobiera opublikowane posty z podstawowymi danymi (bez pełnych relacji) - szybsza wersja
   */
  async getPublishedPostsBasic(
    limit = 10,
    offset = 0
  ): Promise<PostsResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const query = supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image_url,
          published_at,
          created_at,
          view_count,
          is_featured,
          profiles:author_id (
            username,
            full_name
          ),
          post_categories (
            categories (
              name,
              slug,
              color
            )
          )
        `, { count: 'exact' })
        .eq('status', POST_STATUS.PUBLISHED)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return {
        data: data as PostFull[],
        count: count || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        total_pages: totalPages
      }
    } catch (error) {
      console.error('Error fetching basic published posts:', error)
      throw error
    }
  }

  /**
   * Pobiera opublikowane posty (dla strony publicznej)
   */
  async getPublishedPosts(
    limit = 10,
    offset = 0,
    filters: Partial<PostFilters> = {}
  ): Promise<PostsResponse> {
    return this.getPosts(
      { ...filters, status: POST_STATUS.PUBLISHED },
      { field: 'published_at', direction: 'desc' },
      { page: Math.floor(offset / limit) + 1, limit, offset }
    )
  }

  /**
   * Pobiera post po ID
   */
  async getPostById(id: string): Promise<PostResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
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
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return { data: data as PostFull }
    } catch (error) {
      console.error('Error fetching post by ID:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Pobiera post po slug
   */
  async getPostBySlug(slug: string): Promise<PostResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
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
        .eq('slug', slug)
        .single()

      if (error) {
        throw error
      }

      return { data: data as PostFull }
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Tworzy nowy post
   */
  async createPost(postData: CreatePostData, authorId: string): Promise<PostResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // Przygotowanie danych posta
      const postInsert: PostInsert = {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt,
        featured_image_url: postData.featured_image_url,
        meta_title: postData.meta_title,
        meta_description: postData.meta_description,
        status: postData.status || POST_STATUS.DRAFT,
        published_at: postData.published_at,
        is_featured: postData.is_featured || false,
        allow_comments: postData.allow_comments !== false,
        seo_data: postData.seo_data || {},
        author_id: authorId
      }

      // Tworzenie posta
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postInsert)
        .select()
        .single()

      if (postError) {
        throw postError
      }

      // Dodawanie kategorii
      if (postData.categories && postData.categories.length > 0) {
        const categoryInserts = postData.categories.map(categoryId => ({
          post_id: post.id,
          category_id: categoryId
        }))

        const { error: categoriesError } = await supabase
          .from('post_categories')
          .insert(categoryInserts)

        if (categoriesError) {
          console.error('Error adding categories:', categoriesError)
        }
      }

      // Dodawanie tagów
      if (postData.tags && postData.tags.length > 0) {
        const tagInserts = postData.tags.map(tagId => ({
          post_id: post.id,
          tag_id: tagId
        }))

        const { error: tagsError } = await supabase
          .from('post_tags')
          .insert(tagInserts)

        if (tagsError) {
          console.error('Error adding tags:', tagsError)
        }
      }

      // Dodawanie załączników
      if (postData.attachments && postData.attachments.length > 0) {
        const attachmentInserts = postData.attachments.map((attachmentId, index) => ({
          post_id: post.id,
          attachment_id: attachmentId,
          sort_order: index
        }))

        const { error: attachmentsError } = await supabase
          .from('post_attachments')
          .insert(attachmentInserts)

        if (attachmentsError) {
          console.error('Error adding attachments:', attachmentsError)
        }
      }

      // Pobieranie pełnych danych posta
      return this.getPostById(post.id)
    } catch (error) {
      console.error('Error creating post:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Aktualizuje post
   */
  async updatePost(postData: UpdatePostData): Promise<PostResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { id, categories, tags, attachments, ...updateData } = postData

      // Aktualizacja podstawowych danych posta
      const { error: postError } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)

      if (postError) {
        throw postError
      }

      // Aktualizacja kategorii
      if (categories !== undefined) {
        // Usunięcie starych kategorii
        await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', id)

        // Dodanie nowych kategorii
        if (categories.length > 0) {
          const categoryInserts = categories.map(categoryId => ({
            post_id: id,
            category_id: categoryId
          }))

          const { error: categoriesError } = await supabase
            .from('post_categories')
            .insert(categoryInserts)

          if (categoriesError) {
            console.error('Error updating categories:', categoriesError)
          }
        }
      }

      // Aktualizacja tagów
      if (tags !== undefined) {
        // Usunięcie starych tagów
        await supabase
          .from('post_tags')
          .delete()
          .eq('post_id', id)

        // Dodanie nowych tagów
        if (tags.length > 0) {
          const tagInserts = tags.map(tagId => ({
            post_id: id,
            tag_id: tagId
          }))

          const { error: tagsError } = await supabase
            .from('post_tags')
            .insert(tagInserts)

          if (tagsError) {
            console.error('Error updating tags:', tagsError)
          }
        }
      }

      // Aktualizacja załączników
      if (attachments !== undefined) {
        // Usunięcie starych załączników
        await supabase
          .from('post_attachments')
          .delete()
          .eq('post_id', id)

        // Dodanie nowych załączników
        if (attachments.length > 0) {
          const attachmentInserts = attachments.map((attachmentId, index) => ({
            post_id: id,
            attachment_id: attachmentId,
            sort_order: index
          }))

          const { error: attachmentsError } = await supabase
            .from('post_attachments')
            .insert(attachmentInserts)

          if (attachmentsError) {
            console.error('Error updating attachments:', attachmentsError)
          }
        }
      }

      // Pobieranie zaktualizowanych danych posta
      return this.getPostById(id)
    } catch (error) {
      console.error('Error updating post:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Usuwa post
   */
  async deletePost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await this.getSupabaseClient()
      // Usunięcie powiązanych danych (kaskadowo przez foreign keys)
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting post:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Zwiększa liczbę wyświetleń posta
   */
  async incrementPostViews(slug: string): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient()
      const { error } = await supabase.rpc('increment_post_views', {
        post_slug: slug
      })

      if (error) {
        console.error('Error incrementing post views:', error)
      }
    } catch (error) {
      console.error('Error incrementing post views:', error)
    }
  }

  /**
   * Pobiera posty według kategorii
   */
  async getPostsByCategory(
    categorySlug: string,
    limit = 10,
    offset = 0
  ): Promise<PostsResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error, count } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          post_categories!inner (
            categories!inner (
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
        `, { count: 'exact' })
        .eq('post_categories.categories.slug', categorySlug)
        .eq('status', POST_STATUS.PUBLISHED)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return {
        data: data as PostFull[],
        count: count || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        total_pages: totalPages
      }
    } catch (error) {
      console.error('Error fetching posts by category:', error)
      throw error
    }
  }

  /**
   * Pobiera posty według tagu
   */
  async getPostsByTag(
    tagSlug: string,
    limit = 10,
    offset = 0
  ): Promise<PostsResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error, count } = await supabase
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
          post_tags!inner (
            tags!inner (
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
        `, { count: 'exact' })
        .eq('post_tags.tags.slug', tagSlug)
        .eq('status', POST_STATUS.PUBLISHED)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      const totalPages = Math.ceil((count || 0) / limit)

      return {
        data: data as PostFull[],
        count: count || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        total_pages: totalPages
      }
    } catch (error) {
      console.error('Error fetching posts by tag:', error)
      throw error
    }
  }

  /**
   * Pobiera popularne posty
   */
  async getPopularPosts(limit = 5): Promise<PostFull[]> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
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
        .eq('status', POST_STATUS.PUBLISHED)
        .order('view_count', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data as PostFull[]
    } catch (error) {
      console.error('Error fetching popular posts:', error)
      return []
    }
  }

  /**
   * Pobiera najnowsze posty
   */
  async getLatestPosts(limit = 5): Promise<PostFull[]> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
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
        .eq('status', POST_STATUS.PUBLISHED)
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data as PostFull[]
    } catch (error) {
      console.error('Error fetching latest posts:', error)
      return []
    }
  }

  /**
   * Przełącza status przypięcia posta (is_featured)
   */
  async togglePostPin(postId: string): Promise<{ success: boolean; error?: string; isPinned?: boolean }> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // Najpierw pobierz aktualny status
      const { data: currentPost, error: fetchError } = await supabase
        .from('posts')
        .select('is_featured')
        .eq('id', postId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // Przełącz status
      const newFeaturedStatus = !currentPost.is_featured
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          is_featured: newFeaturedStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      if (updateError) {
        throw updateError
      }

      return { 
        success: true, 
        isPinned: newFeaturedStatus 
      }
    } catch (error) {
      console.error('Error toggling post pin:', error)
      return { 
        success: false, 
        error: (error as Error).message 
      }
    }
  }
}

// Factory function for creating PostService instances for client-side use
export function createClientPostService(): PostService {
  return new PostService(createClient())
} 