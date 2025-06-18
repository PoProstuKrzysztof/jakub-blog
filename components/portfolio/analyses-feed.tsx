"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { AnalysisDto } from '@/lib/actions/portfolio-actions'
import { AnalysisCard } from './analysis-card'
import { Badge } from '../ui/badge'
import { useToast } from '../ui/use-toast'

interface Props {
  initialAnalyses: AnalysisDto[]
}

export function AnalysesFeed({ initialAnalyses }: Props) {
  const [analyses, setAnalyses] = useState<AnalysisDto[]>(initialAnalyses)
  const [hasNew, setHasNew] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('analyses')
      .on('broadcast', { event: 'new-analysis' }, payload => {
        const analysis = payload.payload as AnalysisDto
        setAnalyses(prev => [analysis, ...prev])
        setHasNew(true)
        toast({ title: 'Nowa analiza', description: analysis.title })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="space-y-4 w-full">
      {hasNew && <Badge variant="secondary">Nowe</Badge>}
      {analyses.map(a => (
        <AnalysisCard key={a.id} analysis={a} />
      ))}
    </div>
  )
} 