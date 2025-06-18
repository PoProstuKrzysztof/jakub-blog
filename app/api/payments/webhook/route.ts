import { NextRequest, NextResponse } from 'next/server'
// Tymczasowo wyłączone - instalowanie Stripe ma problemy na Windows
// import Stripe from 'stripe'
import { getStripeClient } from '@/lib/services/stripe'
import { supabaseAdmin } from '@/lib/supabase/supabase-admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Tymczasowo wyłączone - brak pakietu Stripe
  return NextResponse.json({ 
    error: 'Stripe webhook nie jest aktualnie skonfigurowany' 
  }, { status: 501 })

  /*
  const stripe = getStripeClient()

  // Stripe wymaga surowego body do weryfikacji sygnatury
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !endpointSecret) {
    return NextResponse.json({ error: 'Brak konfiguracji Stripe' }, { status: 500 })
  }

  let event: any // Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Błędna sygnatura' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any // Stripe.Checkout.Session
    const productId = session.metadata?.product_id
    const productSlug = session.metadata?.product_slug
    const email = session.customer_details?.email

    if (!productId || !email) {
      return NextResponse.json({ received: true })
    }

    // Pobierz lub stwórz użytkownika
    let userId: string | undefined
    // getUserByEmail nie jest jeszcze poprawnie typowany w pakiecie @supabase/supabase-js,
    // dlatego korzystamy z rzutowania na any.
    const { data: existingUser, error: userError } = await (supabaseAdmin.auth.admin as any).getUserByEmail(email)

    if (userError) {
      console.error(userError)
    }

    if (existingUser) {
      userId = existingUser.id
    } else {
      const { data: newUserData, error: createError } = await (supabaseAdmin.auth.admin as any).createUser({
        email,
        email_confirm: true
      })
      const newUser = newUserData?.user
      if (createError || !newUser) {
        console.error(createError)
        return NextResponse.json({ received: true })
      }
      userId = newUser.id
      // TODO: wysłać magic link (opcjonalnie)
    }

    // Zapisz zamówienie
    const { error: insertError } = await supabaseAdmin.from('orders').insert({
      user_id: userId,
      product_id: productId,
      status: 'paid',
      price_cents: session.amount_total,
      currency: session.currency
    })

    if (insertError) console.error(insertError)
  }

  return NextResponse.json({ received: true })
  */
} 