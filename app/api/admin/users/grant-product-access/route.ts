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
 * POST /api/admin/users/grant-product-access - Przyznaje dostęp do konkretnego produktu
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
    const { userId, productId, durationDays } = body

    if (!userId || !productId || !durationDays) {
      return NextResponse.json(
        { error: 'Wymagane pola: userId, productId, durationDays' },
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

    // Oblicz datę wygaśnięcia
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + parseInt(durationDays))

    // Utwórz zamówienie przyznające dostęp
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        product_id: productId,
        status: 'paid',
        price_cents: 0, // Darmowe przyznanie przez administratora
        currency: product.currency,
        expires_at: expiryDate.toISOString()
      })

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Błąd podczas przyznawania dostępu do produktu' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: `Przyznano dostęp do produktu "${product.name}" na ${durationDays} dni`
    })
  } catch (error) {
    console.error('Error granting product access:', error)
    return NextResponse.json(
      { error: 'Błąd podczas przyznawania dostępu do produktu' },
      { status: 500 }
    )
  }
} 