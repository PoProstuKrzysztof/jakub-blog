import { getActivePortfolio, listAnalyses } from '@/lib/actions/portfolio-actions'
import { PortfolioChart } from '@/components/portfolio/portfolio-chart'
import { AnalysesFeed } from '@/components/portfolio/analyses-feed'

export const revalidate = 60

export default async function AuthorPortfolioPage() {
  const portfolio = await getActivePortfolio()
  const analyses = await listAnalyses(1, 20)

  if (!portfolio) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <h1 className="text-2xl font-semibold">Portfel autora</h1>
        <p className="mt-4 text-muted-foreground">Brak opublikowanego portfela</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Portfel autora</h1>
        {portfolio.description && <p className="text-muted-foreground">{portfolio.description}</p>}
        <PortfolioChart data={portfolio.jsonData} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Analizy</h2>
          <AnalysesFeed initialAnalyses={analyses} />
        </div>
      </section>
    </div>
  )
} 