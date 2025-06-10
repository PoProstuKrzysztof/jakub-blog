"use client"

import { useEffect, useRef } from 'react'
import { ChartComponentDynamic } from './editor/chart-component-dynamic'

interface PostContentRendererProps {
  content: string
  className?: string
}

export function PostContentRenderer({ content, className }: PostContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Znajdź wszystkie kontenery wykresów i zastąp je komponentami React
    const chartContainers = contentRef.current.querySelectorAll('.chart-container')
    
    chartContainers.forEach((container) => {
      const chartType = container.getAttribute('data-chart-type') as 'bar' | 'line' | 'pie'
      const chartDataString = container.getAttribute('data-chart-data')
      
      if (chartDataString) {
        try {
          const chartData = JSON.parse(decodeURIComponent(chartDataString))
          
          // Utwórz nowy element div dla wykresu
          const chartDiv = document.createElement('div')
          chartDiv.className = 'chart-wrapper my-6'
          
          // Zastąp placeholder rzeczywistym wykresem
          container.innerHTML = ''
          container.appendChild(chartDiv)
          
          // Renderuj wykres (w rzeczywistej aplikacji użyłbyś ReactDOM.render lub portal)
          // Na razie zostawiamy placeholder z lepszym stylem
          chartDiv.innerHTML = `
            <div class="bg-white border rounded-lg p-6 shadow-sm">
              <div class="flex items-center justify-center h-64 bg-gray-50 rounded border-2 border-dashed border-gray-200">
                <div class="text-center">
                  <div class="text-2xl mb-2">📊</div>
                  <p class="text-gray-600 font-medium">Wykres ${chartType.toUpperCase()}</p>
                  <p class="text-sm text-gray-500">Dane: ${Object.keys(chartData).join(', ')}</p>
                </div>
              </div>
            </div>
          `
        } catch (error) {
          console.error('Error parsing chart data:', error)
          container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <p class="text-red-700">Błąd w danych wykresu</p>
            </div>
          `
        }
      }
    })

    // Dodaj style dla YouTube embedów
    const youtubeIframes = contentRef.current.querySelectorAll('iframe[src*="youtube.com"]')
    youtubeIframes.forEach((iframe) => {
      iframe.setAttribute('class', 'w-full aspect-video rounded-lg my-6')
    })

    // Dodaj style dla obrazów
    const images = contentRef.current.querySelectorAll('img')
    images.forEach((img) => {
      img.setAttribute('class', 'max-w-full h-auto rounded-lg my-4 mx-auto')
    })

    // Dodaj style dla tabel
    const tables = contentRef.current.querySelectorAll('table')
    tables.forEach((table) => {
      table.setAttribute('class', 'w-full border-collapse border border-gray-300 my-6')
      
      // Style dla komórek tabeli
      const cells = table.querySelectorAll('td, th')
      cells.forEach((cell) => {
        cell.setAttribute('class', 'border border-gray-300 px-4 py-2')
      })
      
      // Style dla nagłówków tabeli
      const headers = table.querySelectorAll('th')
      headers.forEach((header) => {
        header.setAttribute('class', 'border border-gray-300 px-4 py-2 bg-gray-100 font-semibold')
      })
    })

    // Dodaj style dla list zadań
    const taskLists = contentRef.current.querySelectorAll('ul[data-type="taskList"]')
    taskLists.forEach((list) => {
      list.setAttribute('class', 'space-y-2 my-4')
      
      const taskItems = list.querySelectorAll('li[data-type="taskItem"]')
      taskItems.forEach((item) => {
        item.setAttribute('class', 'flex items-center space-x-2')
      })
    })

  }, [content])

  return (
    <div 
      ref={contentRef}
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
} 