import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()
    
    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Nie jesteś zalogowany' },
        { status: 401 }
      )
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
        return NextResponse.json(
          { success: false, error: 'Brak uprawnień administratora' },
          { status: 403 }
        )
      }
      
      if (error.message.includes('post_not_found')) {
        return NextResponse.json(
          { success: false, error: 'Nie znaleziono posta' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: 'Błąd podczas aktualizacji posta' },
        { status: 500 }
      )
    }

    // Revalidate in the background
    revalidatePath('/')
    revalidatePath('/wpisy')
    
    return NextResponse.json({ 
      success: true, 
      isPinned: data.is_featured 
    })
  } catch (error) {
    console.error('Error toggling post pin:', error)
    return NextResponse.json(
      { success: false, error: 'Wystąpił nieoczekiwany błąd' },
      { status: 500 }
    )
  }
} 