"use server"

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function togglePostPin(postId: string) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'Nie jesteś zalogowany' 
      }
    }

    // Połącz sprawdzenie uprawnień i pobranie posta w jednym zapytaniu
    const [profileResult, postResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single(),
      supabase
        .from('posts')
        .select('is_featured')
        .eq('id', postId)
        .single()
    ])

    if (profileResult.error || !profileResult.data || profileResult.data.role !== 'admin') {
      return { 
        success: false, 
        error: 'Brak uprawnień administratora' 
      }
    }

    if (postResult.error) {
      return { 
        success: false, 
        error: 'Nie znaleziono posta' 
      }
    }

    // Toggle featured status
    const newFeaturedStatus = !postResult.data.is_featured
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        is_featured: newFeaturedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)

    if (updateError) {
      return { 
        success: false, 
        error: 'Błąd podczas aktualizacji posta' 
      }
    }

    // Revalidate w tle - nie czekamy na to
    revalidatePath('/')
    
    return { 
      success: true, 
      isPinned: newFeaturedStatus 
    }
  } catch (error) {
    console.error('Error toggling post pin:', error)
    return { 
      success: false, 
      error: 'Wystąpił nieoczekiwany błąd' 
    }
  }
} 