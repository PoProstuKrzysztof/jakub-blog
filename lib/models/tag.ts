import { Tables, TablesInsert, TablesUpdate } from '../database.types'

// Podstawowe typy z bazy danych
export type Tag = Tables<'tags'>
export type TagInsert = TablesInsert<'tags'>
export type TagUpdate = TablesUpdate<'tags'>

// Rozszerzone typy dla aplikacji
export interface TagWithPostCount extends Tag {
  post_count: number
}

// Typy dla formularzy
export interface CreateTagData {
  name: string
  slug: string
  description?: string
  color?: string
}

export interface UpdateTagData extends Partial<CreateTagData> {
  id: string
}

// Typy dla filtrowania i sortowania
export interface TagFilters {
  search?: string
}

export interface TagSortOptions {
  field: 'name' | 'created_at'
  direction: 'asc' | 'desc'
}

// Typy dla odpowiedzi API
export interface TagsResponse {
  data: TagWithPostCount[]
  count: number
  error?: string
}

export interface TagResponse {
  data: TagWithPostCount | null
  error?: string
} 