"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Skeleton loading component dla wykresów
function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-gray-600">Ładowanie wykresu...</p>
        </div>
      </div>
    </div>
  )
}

// Dynamicznie importowany komponent wykresów z wyłączonym SSR
const ChartComponentCore = dynamic(() => import('./chart-component').then(mod => ({ default: mod.ChartComponent })), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

const ChartRendererCore = dynamic(() => import('./chart-component').then(mod => ({ default: mod.ChartRenderer })), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

interface ChartComponentProps {
  type: 'bar' | 'line' | 'pie'
  data: any
  options?: any
  className?: string
}

export function ChartComponentDynamic(props: ChartComponentProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartComponentCore {...props} />
    </Suspense>
  )
}

export function ChartRendererDynamic({ element }: { element: HTMLElement }) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartRendererCore element={element} />
    </Suspense>
  )
} 