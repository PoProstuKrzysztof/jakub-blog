import { createClient } from '@/lib/supabase/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Sprawdza rolę użytkownika z bazy danych
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    console.log('🔍 getUserRole - Starting for userId:', userId)
    const supabase = createClient()
    
    // Najpierw sprawdzamy czy użytkownik jest uwierzytelniony
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('🔍 getUserRole - User not authenticated:', authError)
      return null
    }
    
    console.log('🔍 getUserRole - Authenticated user:', user.id)
    
    // Sprawdzamy czy podane userId odpowiada aktualnie zalogowanemu użytkownikowi
    if (user.id !== userId) {
      console.error('🔍 getUserRole - User ID mismatch: requested', userId, 'but authenticated as', user.id)
      return null
    }

    console.log('🔍 getUserRole - Fetching profile from database...')
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      // Jeśli profil nie istnieje, nie tworzymy go automatycznie
      // Pozwalamy triggerowi handle_new_user() zająć się tym
      if (error.code === 'PGRST116') { // No rows returned
        console.log('🔍 getUserRole - Profile not found for user:', userId, '. Trigger should create it automatically.')
        return null
      }
      
      console.error('🔍 getUserRole - Error fetching user role:', error)
      return null
    }

    if (!profile) {
      console.error('🔍 getUserRole - No profile found for user:', userId)
      return null
    }

    console.log('🔍 getUserRole - Found profile with role:', profile.role)
    return profile.role
  } catch (error) {
    console.error('🔍 getUserRole - Error in getUserRole:', error)
    return null
  }
}

/**
 * Sprawdza czy użytkownik jest administratorem
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'admin' || role === 'author'
}

/**
 * Typy ról użytkowników
 */
export type UserRole = 'admin' | 'author' | 'user' | null

/**
 * Sprawdza czy użytkownik ma rolę administratora/autora
 */
export function isAdminRole(role: string | null): boolean {
  return role === 'admin' || role === 'author'
}

/**
 * Zwraca odpowiedni panel dla użytkownika na podstawie roli
 */
export function getUserPanelPath(role: string | null): string {
  console.log('🎯 getUserPanelPath - Input role:', role)
  const isAdmin = isAdminRole(role)
  console.log('🎯 getUserPanelPath - Is admin role:', isAdmin)
  
  if (isAdmin) {
    console.log('🎯 getUserPanelPath - Returning /admin')
    return '/admin'
  }
  console.log('🎯 getUserPanelPath - Returning /panel')
  return '/panel'
}

/**
 * Zwraca nazwę panelu dla użytkownika na podstawie roli
 */
export function getUserPanelLabel(role: string | null): string {
  if (isAdminRole(role)) {
    return 'Panel twórcy'
  }
  return 'Panel użytkownika'
} 