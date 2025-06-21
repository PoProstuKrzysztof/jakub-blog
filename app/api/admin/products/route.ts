import { NextRequest, NextResponse } from 'next/server'
import { AdminUserService } from '@/lib/services/admin-user-service'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/supabase-admin'

/**
 * Sprawdza czy użytkownik ma uprawnienia administratora
 */
async function checkAdminPermissions(request: NextRequest): Promise<{ isAdmin: boolean; userId?: string }> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // Ignore errors in middleware
            }
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return { isAdmin: false }
    }

    const adminUserService = new AdminUserService()
    const isAdmin = await adminUserService.checkAdminPermissions(user.id)
    
    return { isAdmin, userId: user.id }
  } catch (error) {
    console.error('Error checking admin permissions:', error)
    return { isAdmin: false }
  }
}

/**
 * GET /api/admin/products - Pobiera listę wszystkich produktów
 */
export async function GET(request: NextRequest) {
  try {
    const { isAdmin } = await checkAdminPermissions(request)
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień administratora' },
        { status: 403 }
      )
    }

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Błąd podczas pobierania produktów' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Błąd podczas pobierania produktów' },
      { status: 500 }
    )
  }
} 