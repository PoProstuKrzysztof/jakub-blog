import { Database, Tables, TablesInsert, TablesUpdate } from '../supabase/database.types'

// Podstawowe typy z bazy danych
export type Post = Tables<'posts'>
export type PostInsert = TablesInsert<'posts'>
export type PostUpdate = TablesUpdate<'posts'>

// Rozszerzone typy dla aplikacji
export interface PostWithAuthor extends Post {
  profiles: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
}

export interface PostWithCategories extends Post {
  post_categories: {
    categories: {
      id: string
      name: string
      slug: string
      color: string | null
    }
  }[]
}

export interface PostWithTags extends Post {
  post_tags: {
    tags: {
      id: string
      name: string
      slug: string
      color: string | null
    }
  }[]
}

export interface PostWithAttachments extends Post {
  post_attachments: {
    attachments: {
      id: string
      original_filename: string
      public_url: string | null
      mime_type: string
      file_size: number
    }
  }[]
}

export interface PostFull extends PostWithAuthor {
  post_categories: {
    categories: {
      id: string
      name: string
      slug: string
      color: string | null
    }
  }[]
  post_tags: {
    tags: {
      id: string
      name: string
      slug: string
      color: string | null
    }
  }[]
  post_attachments: {
    attachments: {
      id: string
      original_filename: string
      public_url: string | null
      mime_type: string
      file_size: number
    }
  }[]
}

// Typy dla formularzy
export interface CreatePostData {
  title: string
  slug: string
  content?: string
  excerpt?: string
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  published_at?: string
  is_featured?: boolean
  allow_comments?: boolean
  seo_data?: Record<string, any>
  categories?: string[]
  tags?: string[]
  attachments?: string[]
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

// Typy dla filtrowania i sortowania
export interface PostFilters {
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  category?: string
  tag?: string
  author_id?: string
  is_featured?: boolean
  search?: string
  date_from?: string
  date_to?: string
}

export interface PostSortOptions {
  field: 'created_at' | 'updated_at' | 'published_at' | 'title' | 'view_count'
  direction: 'asc' | 'desc'
}

export interface PostPagination {
  page: number
  limit: number
  offset: number
}

// Typy dla odpowiedzi API
export interface PostsResponse {
  data: PostFull[]
  count: number
  page: number
  limit: number
  total_pages: number
}

export interface PostResponse {
  data: PostFull | null
  error?: string
}

// Enums dla statusów
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  SCHEDULED: 'scheduled',
  ARCHIVED: 'archived'
} as const

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS]

// Enums dla typów załączników
export const ATTACHMENT_TYPE = {
  FEATURED: 'featured',
  GALLERY: 'gallery',
  DOCUMENT: 'document',
  EMBED: 'embed'
} as const

export type AttachmentType = typeof ATTACHMENT_TYPE[keyof typeof ATTACHMENT_TYPE] 