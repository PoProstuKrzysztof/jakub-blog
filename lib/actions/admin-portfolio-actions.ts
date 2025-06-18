'use server'

import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/supabase-admin'
import { getCache } from '@/lib/redis/cache'
import { revalidatePath } from 'next/cache'

// --- Schematy -------------------------------------------------------------

export const AnalysisSchema = z.object({
  title: z.string().min(3),
  content: z.string().optional(),
  attachmentUrl: z.string().url().optional()
})

export const PortfolioSchema = z.object({
  description: z.string().optional(),
  jsonData: z.record(z.number())
})

// --- Helpers --------------------------------------------------------------

async function invalidatePortfolioCache() {
  const cache = getCache()
  await cache.invalidateByTags(['portfolio'])
  revalidatePath('/portfel-autora')
}

async function invalidateAnalysesCache() {
  const cache = getCache()
  await cache.invalidateByTags(['analyses'])
  revalidatePath('/portfel-autora')
}

// --- Actions --------------------------------------------------------------

export async function createAnalysis(prevState: any, formData: FormData) {
  try {
    const parsed = AnalysisSchema.parse({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      attachmentUrl: formData.get('attachmentUrl') as string | undefined
    })

    const { error } = await supabaseAdmin.from('author_analyses').insert({
      title: parsed.title,
      content: parsed.content,
      attachment_url: parsed.attachmentUrl,
      is_published: true,
      author_id: null
    })

    if (error) throw error

    await invalidateAnalysesCache()

    return { success: true }
  } catch (err: any) {
    return { error: err.message ?? 'Błąd' }
  }
}

export async function publishPortfolio(prevState: any, formData: FormData) {
  try {
    const jsonRaw = formData.get('jsonData') as string
    const description = (formData.get('description') as string) || null
    const jsonParsed = JSON.parse(jsonRaw)

    const parsed = PortfolioSchema.parse({ description, jsonData: jsonParsed })

    // Deactivate existing active rows
    await supabaseAdmin
      .from('author_portfolio')
      .update({ is_active: false })
      .eq('is_active', true)

    const { error } = await supabaseAdmin.from('author_portfolio').insert({
      description: parsed.description,
      json_data: parsed.jsonData,
      is_active: true,
      author_id: null
    })

    if (error) throw error

    await invalidatePortfolioCache()

    return { success: true }
  } catch (err: any) {
    return { error: err.message ?? 'Błąd' }
  }
}

// --- Server Action wrappers (FormData only) -------------------------------

export async function createAnalysisAction(formData: FormData) {
  await createAnalysis(null, formData)
}

export async function publishPortfolioAction(formData: FormData) {
  await publishPortfolio(null, formData)
} 