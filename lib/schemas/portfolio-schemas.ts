import { z } from 'zod'

export const AnalysisSchema = z.object({
  title: z.string().min(3, 'Tytuł musi mieć co najmniej 3 znaki'),
  content: z.string().optional(),
  attachmentUrl: z.string().url('Nieprawidłowy format URL').optional().or(z.literal(''))
})

export const PortfolioSchema = z.object({
  description: z.string().optional(),
  jsonData: z.record(z.string(), z.number().min(0).max(1))
})

export type AnalysisFormData = z.infer<typeof AnalysisSchema>
export type PortfolioFormData = z.infer<typeof PortfolioSchema> 