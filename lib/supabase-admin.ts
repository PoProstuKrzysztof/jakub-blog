import { createClient } from '@supabase/supabase-js'

/**
 * Klient z kluczem service-role – używać wyłącznie po stronie serwera (Edge/Route).
 */
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (process.env.NODE_ENV === 'development') {
  console.log('[ Supabase Admin ] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('[ Supabase Admin ] Using service key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('[ Supabase Admin ] Fallback to anon key:', !process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const supabaseAdmin = /* @__PURE__ */ createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceKey!,
  {
    auth: {
      persistSession: false
    }
  }
) 