import { SupabaseClient } from '@supabase/supabase-js'
import {
  Category,
  CategoryInsert,
  CategoryUpdate,
  CategoryFull,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryFilters,
  CategorySortOptions,
  CategoriesResponse,
  CategoryResponse,
  CategoryWithPostCount
} from '../models/category'

export class CategoryService {
  private supabase: SupabaseClient

  constructor(supabaseClient?: SupabaseClient) {
    if (supabaseClient) {
      this.supabase = supabaseClient
    } else {
      // For client-side usage, import createClient dynamically
      const { createClient } = require('../supabase/supabase')
      this.supabase = createClient()
    }
  }

  private async getSupabaseClient() {
    return this.supabase instanceof Promise ? await this.supabase : this.supabase
  }

  /**
   * Pobiera wszystkie kategorie
   */
  async getCategories(
    filters: CategoryFilters = {},
    sort: CategorySortOptions = { field: 'name', direction: 'asc' }
  ): Promise<CategoriesResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      let query = supabase
        .from('categories')
        .select(`
          *,
          parent_category:parent_id (
            id,
            name,
            slug
          )
        `, { count: 'exact' })

      // Aplikowanie filtrów
      if (filters.parent_id !== undefined) {
        if (filters.parent_id === null) {
          query = query.is('parent_id', null)
        } else {
          query = query.eq('parent_id', filters.parent_id)
        }
      }

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
        data: data as CategoryFull[],
        count: count || 0
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { data: [], count: 0, error: (error as Error).message }
    }
  }

  /**
   * Pobiera kategorię po ID
   */
  async getCategoryById(id: string): Promise<CategoryResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          parent_category:parent_id (
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return { data: data as CategoryFull }
    } catch (error) {
      console.error('Error fetching category by ID:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Pobiera kategorię po slug
   */
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          parent_category:parent_id (
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .single()

      if (error) {
        throw error
      }

      return { data: data as CategoryFull }
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Tworzy nową kategorię
   */
  async createCategory(categoryData: CreateCategoryData): Promise<CategoryResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      
      const categoryInsert: CategoryInsert = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        color: categoryData.color,
        parent_id: categoryData.parent_id,
        sort_order: categoryData.sort_order || 0
      }

      const { data, error } = await supabase
        .from('categories')
        .insert(categoryInsert)
        .select()
        .single()

      if (error) {
        throw error
      }

      return this.getCategoryById(data.id)
    } catch (error) {
      console.error('Error creating category:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Aktualizuje kategorię
   */
  async updateCategory(categoryData: UpdateCategoryData): Promise<CategoryResponse> {
    try {
      const supabase = await this.getSupabaseClient()
      const { id, ...updateData } = categoryData

      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)

      if (error) {
        throw error
      }

      return this.getCategoryById(id)
    } catch (error) {
      console.error('Error updating category:', error)
      return { data: null, error: (error as Error).message }
    }
  }

  /**
   * Usuwa kategorię
   */
  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await this.getSupabaseClient()
      
      // Sprawdź czy kategoria ma podkategorie
      const { data: children } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', id)

      if (children && children.length > 0) {
        return { success: false, error: 'Nie można usunąć kategorii, która ma podkategorie' }
      }

      // Sprawdź czy kategoria ma posty
      const { data: posts } = await supabase
        .from('post_categories')
        .select('post_id')
        .eq('category_id', id)

      if (posts && posts.length > 0) {
        return { success: false, error: 'Nie można usunąć kategorii, która ma przypisane posty' }
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting category:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  /**
   * Pobiera kategorie główne (bez rodzica)
   */
  async getRootCategories(): Promise<CategoryFull[]> {
    try {
      const result = await this.getCategories({ parent_id: null })
      return result.data || []
    } catch (error) {
      console.error('Error fetching root categories:', error)
      return []
    }
  }

  /**
   * Pobiera podkategorie dla danej kategorii
   */
  async getSubcategories(parentId: string): Promise<CategoryFull[]> {
    try {
      const result = await this.getCategories({ parent_id: parentId })
      return result.data || []
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      return []
    }
  }
} 