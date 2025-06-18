import { describe, it, expect } from 'vitest'
import { z } from 'zod'

import { AnalysisSchema, PortfolioSchema } from '@/lib/actions/admin-portfolio-actions'

describe('Zod schemas', () => {
  it('valid analysis', () => {
    expect(() => {
      AnalysisSchema.parse({ title: 'Test', content: 'abc', attachmentUrl: 'https://example.com/file.pdf' })
    }).not.toThrow()
  })

  it('invalid analysis url', () => {
    expect(() => {
      AnalysisSchema.parse({ title: 'X', attachmentUrl: 'notaurl' })
    }).toThrow()
  })

  it('valid portfolio', () => {
    const jsonData = { AAPL: 0.2, MSFT: 0.3 }
    expect(() => PortfolioSchema.parse({ jsonData })).not.toThrow()
  })
}) 