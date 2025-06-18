import { supabaseAdmin } from '@/lib/supabase/supabase-admin'
import { getCache } from '@/lib/redis/cache'

export interface PortfolioDto {
  id: string
  description: string | null
  jsonData: Record<string, number>
  createdAt: string
}

export async function getActivePortfolio(): Promise<PortfolioDto | null> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ Server ] Fetching active portfolio...')
      console.log('[ Server ] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('[ Server ] Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
      console.log('[ Server ] Anon key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
    
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
      // Zwróć przykładowe dane w przypadku błędu dla celów testowych
      if (process.env.NODE_ENV === 'development') {
        console.log('[ Server ] Returning mock data for development')
        return {
          id: 'mock-id',
          description: 'Przykładowy portfel (mock data)',
          jsonData: {
            "AAPL": 0.25,
            "GOOGL": 0.15,
            "MSFT": 0.20,
            "TSLA": 0.10,
            "CASH": 0.30
          },
          createdAt: new Date().toISOString()
        }
      }
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
    // Zwróć przykładowe dane w przypadku błędu dla celów testowych
    if (process.env.NODE_ENV === 'development') {
      console.log('[ Server ] Returning mock data for development due to error')
      return {
        id: 'mock-id',
        description: 'Przykładowy portfel (mock data - error fallback)',
        jsonData: {
          "AAPL": 0.25,
          "GOOGL": 0.15,
          "MSFT": 0.20,
          "TSLA": 0.10,
          "CASH": 0.30
        },
        createdAt: new Date().toISOString()
      }
    }
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
  const offset = (page - 1) * limit
  const cache = getCache()
  const key = `analyses:page:${page}:limit:${limit}`

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
} 