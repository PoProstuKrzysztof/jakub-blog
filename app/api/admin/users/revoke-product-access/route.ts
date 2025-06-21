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
 * POST /api/admin/users/revoke-product-access - Odbiera dostęp do konkretnego produktu
 */
export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await checkAdminPermissions(request)
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień administratora' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, productId } = body

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'Wymagane pola: userId, productId' },
        { status: 400 }
      )
    }

    // Sprawdź czy produkt istnieje
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Nie znaleziono produktu' },
        { status: 404 }
      )
    }

    // Sprawdź czy użytkownik istnieje
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Nie znaleziono użytkownika' },
        { status: 404 }
      )
    }

    // Znajdź aktywne zamówienia dla tego produktu i użytkownika
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'paid')
      .or('expires_at.is.null,expires_at.gte.now()')

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      return NextResponse.json(
        { error: 'Błąd podczas wyszukiwania zamówień' },
        { status: 500 }
      )
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'Użytkownik nie ma aktywnego dostępu do tego produktu' },
        { status: 404 }
      )
    }

    // Anuluj wszystkie aktywne zamówienia dla tego produktu
    const orderIds = orders.map(order => order.id)
    const { error: cancelError } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'cancelled',
        expires_at: new Date().toISOString() // Ustaw datę wygaśnięcia na teraz
      })
      .in('id', orderIds)

    if (cancelError) {
      console.error('Error cancelling orders:', cancelError)
      return NextResponse.json(
        { error: 'Błąd podczas odbierania dostępu do produktu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: `Odebrano dostęp do produktu "${product.name}"`
    })
  } catch (error) {
    console.error('Error revoking product access:', error)
    return NextResponse.json(
      { error: 'Błąd podczas odbierania dostępu do produktu' },
      { status: 500 }
    )
  }
} 