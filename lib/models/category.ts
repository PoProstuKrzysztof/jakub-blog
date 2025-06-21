import { Tables, TablesInsert, TablesUpdate } from '../supabase/database.types'

// Podstawowe typy z bazy danych
export type Category = Tables<'categories'>
export type CategoryInsert = TablesInsert<'categories'>
export type CategoryUpdate = TablesUpdate<'categories'>

// Rozszerzone typy dla aplikacji
export interface CategoryWithParent extends Category {
  parent_category: Category | null
}

export interface CategoryWithChildren extends Category {
  children: Category[]
}

export interface CategoryWithPostCount extends Category {
  post_count: number
}

export interface CategoryFull extends CategoryWithParent {
  children: Category[]
  post_count: number
}

// Typy dla formularzy
export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  color?: string
  parent_id?: string
  sort_order?: number
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string
}

// Typy dla filtrowania i sortowania
export interface CategoryFilters {
  parent_id?: string | null
  search?: string
}

export interface CategorySortOptions {
  field: 'name' | 'created_at' | 'sort_order'
  direction: 'asc' | 'desc'
}

// Typy dla odpowiedzi API
export interface CategoriesResponse {
  data: CategoryFull[]
  count: number
  error?: string
}

export interface CategoryResponse {
  data: CategoryFull | null
  error?: string
} 