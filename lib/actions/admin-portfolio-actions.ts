'use server'

import { createClient } from '@/lib/supabase/supabase-server'
import { getCache } from '@/lib/redis/cache'
import { revalidatePath } from 'next/cache'
import { AnalysisSchema, PortfolioSchema } from '@/lib/schemas/portfolio-schemas'

// --- Helpers --------------------------------------------------------------

async function invalidatePortfolioCache() {
  try {
    const cache = getCache()
    await cache.invalidateByTags(['portfolio'])
    revalidatePath('/portfel-autora')
  } catch (error) {
    console.error('Error invalidating portfolio cache:', error)
    // Always try to revalidate path even if cache invalidation fails
    revalidatePath('/portfel-autora')
  }
}

async function invalidateAnalysesCache() {
  try {
    const cache = getCache()
    await cache.invalidateByTags(['analyses'])
    revalidatePath('/portfel-autora')
  } catch (error) {
    console.error('Error invalidating analyses cache:', error)
    // Always try to revalidate path even if cache invalidation fails
    revalidatePath('/portfel-autora')
  }
}

/**
 * Sprawdza czy użytkownik ma uprawnienia administratora
 */
async function checkAdminPermissions(): Promise<{ user: any; supabase: any }> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Musisz być zalogowany')
  }

  // Sprawdź czy użytkownik ma rolę administratora
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new Error('Nie znaleziono profilu użytkownika')
  }

  if (!['admin', 'author'].includes(profile.role)) {
    throw new Error('Brak uprawnień administratora')
  }

  return { user, supabase }
}

// --- Actions --------------------------------------------------------------

export async function createAnalysis(prevState: any, formData: FormData) {
  try {
    const { user, supabase } = await checkAdminPermissions()
    
    const parsed = AnalysisSchema.parse({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      attachmentUrl: formData.get('attachmentUrl') as string | undefined
    })

    const { error } = await supabase.from('author_analyses').insert({
      title: parsed.title,
      content: parsed.content,
      attachment_url: parsed.attachmentUrl,
      is_published: true,
      author_id: user.id
    })

    if (error) throw error

    await invalidateAnalysesCache()

    return { success: true }
  } catch (err: any) {
    return { error: err.message ?? 'Błąd podczas publikacji analizy' }
  }
}

export async function publishPortfolio(prevState: any, formData: FormData) {
  try {
    const { user, supabase } = await checkAdminPermissions()
    
    const jsonRaw = formData.get('jsonData') as string
    const description = (formData.get('description') as string) || null
    const jsonParsed = JSON.parse(jsonRaw)

    const parsed = PortfolioSchema.parse({ description, jsonData: jsonParsed })

    // Deactivate existing active rows
    await supabase
      .from('author_portfolio')
      .update({ is_active: false })
      .eq('is_active', true)

    const { error } = await supabase.from('author_portfolio').insert({
      description: parsed.description,
      json_data: parsed.jsonData,
      is_active: true,
      author_id: user.id
    })

    if (error) throw error

    await invalidatePortfolioCache()

    return { success: true }
  } catch (err: any) {
    return { error: err.message ?? 'Błąd podczas publikacji portfela' }
  }
}

// --- Server Action wrappers (FormData only) -------------------------------

export async function createAnalysisAction(formData: FormData) {
  await createAnalysis(null, formData)
}

export async function publishPortfolioAction(formData: FormData) {
  await publishPortfolio(null, formData)
} 