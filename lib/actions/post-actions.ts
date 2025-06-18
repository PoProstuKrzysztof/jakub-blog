"use server"

import { createClient } from '@/lib/supabase/supabase-server'
import { revalidatePath } from 'next/cache'

export async function togglePostPin(postId: string) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'Nie jesteś zalogowany' 
      }
    }

    // Call database function that handles admin verification and update
    const { data, error } = await supabase.rpc('toggle_post_featured', {
      post_id: postId,
      user_id: user.id
    })

    if (error) {
      console.error('Database function error:', error)
      
      // Handle specific error cases
      if (error.message.includes('insufficient_privileges')) {
        return { 
          success: false, 
          error: 'Brak uprawnień administratora' 
        }
      }
      
      if (error.message.includes('post_not_found')) {
        return { 
          success: false, 
          error: 'Nie znaleziono posta' 
        }
      }
      
      return { 
        success: false, 
        error: 'Błąd podczas aktualizacji posta' 
      }
    }

    // Revalidate in the background
    revalidatePath('/')
    revalidatePath('/wpisy')
    
    return { 
      success: true, 
      isPinned: data.is_featured 
    }
  } catch (error) {
    console.error('Error toggling post pin:', error)
    return { 
      success: false, 
      error: 'Wystąpił nieoczekiwany błąd' 
    }
  }
} 