import { createClient } from '@supabase/supabase-js'

/**
 * Klient z kluczem service-role – używać wyłącznie po stronie serwera (Edge/Route).
 */
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
}

if (process.env.NODE_ENV === 'development') {
  console.log('[ Supabase Admin ] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('[ Supabase Admin ] Using service key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('[ Supabase Admin ] Service key length:', serviceKey?.length || 0)
}

export const supabaseAdmin = /* @__PURE__ */ createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
) 