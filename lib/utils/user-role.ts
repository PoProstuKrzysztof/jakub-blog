import { createClient } from '@/lib/supabase/supabase'
import type { User } from '@supabase/supabase-js'

/**
 * Sprawdza rolę użytkownika z bazy danych
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const supabase = createClient()
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        // Spróbuj utworzyć domyślny profil
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'admin', // Domyślna rola admin
            is_active: true
          })
          .select('role')
          .single()

        if (insertError) {
          // Może profil już istnieje, spróbuj ponownie pobrać
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()
          
          if (retryError) {
            return null
          }
          
          return retryProfile?.role || null
        }

        return newProfile?.role || null
      }
      
      return null
    }

    if (!profile) {
      return null
    }

    return profile.role
  } catch (error) {
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
  const isAdmin = isAdminRole(role)
  
  if (isAdmin) {
    return '/admin'
  }
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