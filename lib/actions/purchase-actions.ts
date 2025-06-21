import { z } from 'zod'
import { getStripeClient } from '@/lib/services/stripe'
import { supabaseAdmin } from '@/lib/supabase/supabase-admin'

const CreateCheckoutSessionSchema = z.object({
  productSlug: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  customerEmail: z.string().email().optional()
})

export async function createCheckoutSession(input: z.infer<typeof CreateCheckoutSessionSchema>) {
  const { productSlug, successUrl, cancelUrl, customerEmail } = CreateCheckoutSessionSchema.parse(input)

  // Pobierz dane produktu
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', productSlug)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    throw new Error('Produkt nie istnieje lub jest nieaktywny')
  }

  const stripe = getStripeClient()

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    metadata: {
      product_id: product.id,
      product_slug: product.slug
    },
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description ?? undefined
          },
          unit_amount: product.price_cents
        },
        quantity: 1
      }
    ],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl
  })

  return { url: checkoutSession.url }
} 