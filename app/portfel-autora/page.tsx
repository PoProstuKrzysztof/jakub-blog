import { getActivePortfolio, listAnalyses } from '@/lib/actions/portfolio-actions'
import { PortfolioChart } from '@/components/portfolio/portfolio-chart'
import { AnalysesFeed } from '@/components/portfolio/analyses-feed'
import { PurchaseAccess } from '@/components/portfolio/purchase-access'

export const revalidate = 60

export default async function AuthorPortfolioPage() {
  const portfolio = await getActivePortfolio()
  const analyses = await listAnalyses(1, 20)

  // Jeśli nie ma portfela, pokaż stronę zakupu dostępu
  if (!portfolio) {
    return <PurchaseAccess />
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