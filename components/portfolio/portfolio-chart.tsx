"use client"

import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import clsx from 'clsx'

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface Props {
  data: Record<string, number> | null | undefined
  className?: string
}

export function PortfolioChart({ data, className }: Props) {
  // Sprawdzenie czy data istnieje i czy jest obiektem przed użyciem Object.keys
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return (
      <p className="text-muted-foreground">Brak danych portfela do wyświetlenia.</p>
    )
  }

  const labels = Object.keys(data)
  const weights = Object.values(data)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Udział %',
        data: weights.map(w => w * 100),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { callbacks: { label: (ctx: any) => ctx.parsed.y.toFixed(2) + '%' } }
    },
    scales: {
      y: {
        ticks: { callback: (val: number) => val + '%' }
      }
    }
  }

  return (
    <div className={clsx('w-full overflow-x-auto', className)}>
      <Bar data={chartData} options={options as any} />
    </div>
  )
} 