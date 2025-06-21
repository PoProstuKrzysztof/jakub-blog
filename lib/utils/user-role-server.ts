import { createClient } from '@/lib/supabase/supabase-server'

/**
 * Server-side funkcja do sprawdzania roli użytkownika
 */
export async function getUserRoleServer(userId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        console.log('Profile not found for user (server):', userId, '. Trigger should create it automatically.')
        return null
      }
      console.error('Error fetching user role (server):', error)
      return null
    }

    if (!profile) {
      console.error('No profile found for user (server):', userId)
      return null
    }

    return profile.role
  } catch (error) {
    console.error('Error in getUserRoleServer:', error)
    return null
  }
}

/**
 * Sprawdza czy użytkownik ma rolę administratora/autora (server-side)
 */
export function isAdminRole(role: string | null): boolean {
  return role === 'admin' || role === 'author'
}

/**
 * Zwraca odpowiedni panel dla użytkownika na podstawie roli (server-side)
 */
export function getUserPanelPath(role: string | null): string {
  if (isAdminRole(role)) {
    return '/admin'
  }
  return '/panel'
} 