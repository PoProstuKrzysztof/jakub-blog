import { NextRequest, NextResponse } from 'next/server'
import { AdminUserService } from '@/lib/services/admin-user-service'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Sprawdza czy użytkownik ma uprawnienia administratora
 */
async function checkAdminPermissions(): Promise<{ isAdmin: boolean; userId?: string }> {
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
 * POST /api/admin/users/grant-access - Przyznaje dostęp do portfela
 */
export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await checkAdminPermissions()
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień administratora' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, durationDays } = body

    if (!userId || typeof durationDays !== 'number') {
      return NextResponse.json(
        { error: 'Nieprawidłowe parametry' },
        { status: 400 }
      )
    }

    const adminUserService = new AdminUserService()
    await adminUserService.grantPortfolioAccess(userId, durationDays)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error granting portfolio access:', error)
    return NextResponse.json(
      { error: 'Błąd podczas przyznawania dostępu' },
      { status: 500 }
    )
  }
} 