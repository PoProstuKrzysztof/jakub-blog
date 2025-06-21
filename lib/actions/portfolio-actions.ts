'use server'

import { supabaseAdmin } from '@/lib/supabase/supabase-admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getCache } from '@/lib/redis/cache'

export interface PortfolioDto {
  id: string
  description: string | null
  jsonData: Record<string, number>
  createdAt: string
}

async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

export async function getActivePortfolio(): Promise<PortfolioDto | null> {
  try {
    // Utwórz klienta Supabase dla serwera z uwzględnieniem sesji użytkownika
    const supabase = await createServerSupabaseClient()
    
    // Sprawdź czy użytkownik jest zalogowany
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('[ Server ] No authenticated user found')
      return null
    }

    // Sprawdź czy użytkownik ma dostęp do portfela poprzez zakup produktu lub jest adminem/autorem
    const { data: hasAccess, error: accessError } = await supabase.rpc('has_product', { 
      p_slug: 'portfolio-access' 
    })

    if (accessError) {
      console.error('[ Server ] Error checking portfolio access:', accessError)
      return null
    }

    // Jeśli nie ma dostępu przez zakup, sprawdź czy to admin/autor
    if (!hasAccess) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('[ Server ] Error fetching user profile:', profileError)
        return null
      }

      const isAuthorized = profile?.role === 'admin' || profile?.role === 'author'
      
      if (!isAuthorized) {
        console.log('[ Server ] User does not have access to portfolio')
        return null
      }
    }

    console.log('[ Server ] User authorized, fetching portfolio data...')
    
    // Sprawdzenie czy mamy poprawną konfigurację Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('[ Server ] Missing NEXT_PUBLIC_SUPABASE_URL')
      return null
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[ Server ] Missing both SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY')
      return null
    }
    
    const { data, error } = await supabaseAdmin
      .from('author_portfolio')
      .select('id, description, json_data, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[ Server ] getActivePortfolio database error:', error)
      return null
    }

    if (!data) {
      console.log('[ Server ] No active portfolio found')
      return null
    }

    console.log('[ Server ] Portfolio data found:', { 
      id: data.id, 
      hasJsonData: !!data.json_data,
      jsonDataType: typeof data.json_data 
    })

    // Sprawdzenie czy json_data jest prawidłowe
    if (!data.json_data || typeof data.json_data !== 'object') {
      console.error('[ Server ] Invalid json_data in portfolio:', data.json_data)
      return null
    }

    return {
      id: data.id,
      description: data.description,
      jsonData: data.json_data as Record<string, number>,
      createdAt: data.created_at as string
    }
  } catch (error) {
    console.error('[ Server ] getActivePortfolio error:', error)
    return null
  }
}

export interface AnalysisDto {
  id: string
  title: string
  content: string | null
  attachmentUrl: string | null
  createdAt: string
}

export async function listAnalyses(page = 1, limit = 10): Promise<AnalysisDto[]> {
  try {
    // Sprawdź autoryzację użytkownika
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('[ Server ] No authenticated user found for analyses')
      return []
    }

    // Sprawdź czy użytkownik ma dostęp
    const { data: hasAccess, error: accessError } = await supabase.rpc('has_product', { 
      p_slug: 'portfolio-access' 
    })

    if (accessError) {
      console.error('[ Server ] Error checking analyses access:', accessError)
      return []
    }

    // Jeśli nie ma dostępu przez zakup, sprawdź czy to admin/autor
    if (!hasAccess) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('[ Server ] Error fetching user profile for analyses:', profileError)
        return []
      }

      const isAuthorized = profile?.role === 'admin' || profile?.role === 'author'
      
      if (!isAuthorized) {
        console.log('[ Server ] User does not have access to analyses')
        return []
      }
    }

    const offset = (page - 1) * limit
    const cache = getCache()
    const key = `analyses:page:${page}:limit:${limit}:user:${user.id}`

    return cache.getOrSet(key, async () => {
      const { data, error } = await supabaseAdmin
        .from('author_analyses')
        .select('id, title, content, attachment_url, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('listAnalyses error', error)
        return []
      }

      return (data ?? []).map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        attachmentUrl: a.attachment_url,
        createdAt: a.created_at as string
      }))
    }, { ttl: 60, tags: ['analyses'] })
  } catch (error) {
    console.error('[ Server ] listAnalyses error:', error)
    return []
  }
} 