import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeClient } from '@/lib/services/stripe'
import { supabaseAdmin } from '@/lib/supabase/supabase-admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const stripe = getStripeClient()

  // Stripe wymaga surowego body do weryfikacji sygnatury
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !endpointSecret) {
    return NextResponse.json({ error: 'Brak konfiguracji Stripe' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Błędna sygnatura' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const productId = session.metadata?.product_id
    const productSlug = session.metadata?.product_slug
    const email = session.customer_details?.email

    if (!productId || !email) {
      console.error('Missing productId or email in webhook:', { productId, email })
      return NextResponse.json({ received: true })
    }

    try {
      // Pobierz lub stwórz użytkownika
      let userId: string | undefined

      // Sprawdź czy użytkownik już istnieje
      const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email)

      if (userError && !userError.message?.includes('User not found')) {
        console.error('Error checking existing user:', userError)
        return NextResponse.json({ received: true })
      }

      if (existingUser?.user) {
        userId = existingUser.user.id
        console.log('Found existing user:', userId)
      } else {
        // Utwórz nowego użytkownika
        const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true
        })

        if (createError || !newUserData?.user) {
          console.error('Error creating user:', createError)
          return NextResponse.json({ received: true })
        }

        userId = newUserData.user.id
        console.log('Created new user:', userId)

        // Opcjonalnie: wyślij magic link do zalogowania
        try {
          const { error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/portfel-autora`
            }
          })
          
          if (magicLinkError) {
            console.error('Error generating magic link:', magicLinkError)
          } else {
            console.log('Magic link generated for:', email)
          }
        } catch (linkError) {
          console.error('Magic link generation failed:', linkError)
        }
      }

      // Zapisz zamówienie
      const { error: insertError } = await supabaseAdmin.from('orders').insert({
        user_id: userId,
        product_id: productId,
        status: 'paid',
        price_cents: session.amount_total || 0,
        currency: session.currency || 'pln'
      })

      if (insertError) {
        console.error('Error inserting order:', insertError)
      } else {
        console.log('Order saved successfully for user:', userId)
      }

    } catch (error) {
      console.error('Webhook processing error:', error)
    }
  }

  return NextResponse.json({ received: true })
} 