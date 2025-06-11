"use client"

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ChartComponentProps {
  type: 'bar' | 'line' | 'pie'
  data: any
  options?: any
  className?: string
}

export function ChartComponent({ type, data, options = {}, className }: ChartComponentProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: data.title || 'Wykres',
      },
    },
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={mergedOptions} />
      case 'line':
        return <Line data={data} options={mergedOptions} />
      case 'pie':
        return <Pie data={data} options={mergedOptions} />
      default:
        return <Bar data={data} options={mergedOptions} />
    }
  }

  return (
    <div className={`w-full h-64 ${className}`}>
      {renderChart()}
    </div>
  )
}

// Komponent do renderowania wykresów z HTML
export function ChartRenderer({ element }: { element: HTMLElement }) {
  const chartType = element.getAttribute('data-chart-type') as 'bar' | 'line' | 'pie'
  const chartDataString = element.getAttribute('data-chart-data')
  
  if (!chartDataString) return null

  try {
    const chartData = JSON.parse(decodeURIComponent(chartDataString))
    return <ChartComponent type={chartType} data={chartData} />
  } catch (error) {
    console.error('Error parsing chart data:', error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Błąd w danych wykresu
      </div>
    )
  }
} 