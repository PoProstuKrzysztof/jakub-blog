import { SupabaseClient } from '@supabase/supabase-js'
import {
  Tag,
  TagInsert,
  TagUpdate,
  TagWithPostCount,
  CreateTagData,
  UpdateTagData,
  TagFilters,
  TagSortOptions,
  TagsResponse,
  TagResponse
} from '../models/tag'

export class TagService {
  private supabase: SupabaseClient

  constructor(supabaseClient?: SupabaseClient) {
    if (supabaseClient) {
      this.supabase = supabaseClient
    } else {
      // For client-side usage, import createClient dynamically
      const { createClient } = require('../supabase')
      this.supabase = createClient()
    }
  }

  private async getSupabaseClient() {
    return this.supabase instanceof Promise ? await this.supabase : this.supabase
  }

  /**
   * Pobiera wszystkie tagi
   */
  async getTags(
    filters: TagFilters = {},
    sort: TagSortOptions = { field: 'name', direction: 'asc' }
  ): Promise<TagsResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      let query = supabase
        .from('tags')
        .select('*', { count: 'exact' })

      // Aplikowanie filtrów
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Sortowanie
      query = query.order(sort.field, { ascending: sort.direction === 'asc' })

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      return {
        data: data as TagWithPostCount[],
        count: count || 0
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
      return { data: [], count: 0, error: (error as Error).message }
    }
  }

  /**
   * Pobiera tag po ID
   */
  async getTagById(id: string): Promise<TagResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return { data: data as TagWithPostCount }
    } catch (error) {
      console.error('Error fetching tag by ID:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Pobiera tag po slug
   */
  async getTagBySlug(slug: string): Promise<TagResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        throw error
      }

      return { data: data as TagWithPostCount }
    } catch (error) {
      console.error('Error fetching tag by slug:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Tworzy nowy tag
   */
  async createTag(tagData: CreateTagData): Promise<TagResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const tagInsert: TagInsert = {
        name: tagData.name,
        slug: tagData.slug,
        description: tagData.description,
        color: tagData.color
      }

      const { data, error } = await supabase
        .from('tags')
        .insert(tagInsert)
        .select()
        .single()

      if (error) {
        throw error
      }

      return this.getTagById(data.id)
    } catch (error) {
      console.error('Error creating tag:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Aktualizuje tag
   */
  async updateTag(tagData: UpdateTagData): Promise<TagResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { id, ...updateData } = tagData

      const { error } = await supabase
        .from('tags')
        .update(updateData)
        .eq('id', id)

      if (error) {
        throw error
      }

      return this.getTagById(id)
    } catch (error) {
      console.error('Error updating tag:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Usuwa tag
   */
  async deleteTag(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // Sprawdź czy tag ma przypisane posty
      const { data: posts } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', id)

      if (posts && posts.length > 0) {
        return { success: false, error: 'Nie można usunąć tagu, który ma przypisane posty' }
      }

      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting tag:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Pobiera popularne tagi
   */
  async getPopularTags(limit = 10): Promise<TagWithPostCount[]> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('tags')
        .select(`
          *,
          post_count:post_tags(count)
        `)
        .order('post_count', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return data as TagWithPostCount[]
    } catch (error) {
      console.error('Error fetching popular tags:', error)
      return []
    }
  }

  /**
   * Wyszukuje tagi po nazwie
   */
  async searchTags(query: string, limit = 10): Promise<TagWithPostCount[]> {
    try {
      const result = await this.getTags(
        { search: query },
        { field: 'name', direction: 'asc' }
      )
      
      return result.data?.slice(0, limit) || []
    } catch (error) {
      console.error('Error searching tags:', error)
      return []
    }
  }
} 