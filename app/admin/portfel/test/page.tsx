import { PortfolioChart } from '@/components/portfolio/portfolio-chart'
import { PortfolioTest } from '@/components/portfolio/portfolio-test'

export const metadata = { title: 'Test Portfela' }

export default function TestPortfolioPage() {
  const testData = {
    "AAPL": 0.25,
    "GOOGL": 0.15,
    "MSFT": 0.20,
    "TSLA": 0.10,
    "CASH": 0.30
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-12">
      <h1 className="text-3xl font-bold">Test – Portfel autora</h1>

      {/* Test component */}
      <PortfolioTest />

      {/* Test PortfolioChart z przykładowymi danymi */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Test wykresu portfela</h2>
        <PortfolioChart data={testData} />
      </section>

      {/* Test z null data */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Test z null data</h2>
        <PortfolioChart data={null} />
      </section>

      {/* Test z undefined data */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Test z undefined data</h2>
        <PortfolioChart data={undefined} />
      </section>

      {/* Test z pustym obiektem */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Test z pustym obiektem</h2>
        <PortfolioChart data={{}} />
      </section>
    </div>
  )
} 