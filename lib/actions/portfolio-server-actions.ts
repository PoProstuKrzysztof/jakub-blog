'use server'

import { getActivePortfolio, type PortfolioDto } from '@/lib/actions/portfolio-actions'

export async function fetchActivePortfolio(): Promise<PortfolioDto | null> {
  return getActivePortfolio()
} 