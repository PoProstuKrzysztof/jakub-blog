"use client"

import { publishPortfolio, createAnalysis } from '@/lib/actions/admin-portfolio-actions'
import { fetchActivePortfolio } from '@/lib/actions/portfolio-server-actions'
import { type PortfolioDto } from '@/lib/actions/portfolio-actions'
import { PortfolioChart } from '@/components/portfolio/portfolio-chart'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FormError } from '@/components/common/form-error'
import { FormSuccess } from '@/components/common/form-success'
import { AlertCircle, TrendingUp, FileText, Plus, Loader2 } from 'lucide-react'
import { useActionState } from 'react'
import { useEffect, useState } from 'react'

// Define types to match what the actions actually return
type ActionState = { success: true } | { error: string }

// Define initial state for the actions
const initialState: ActionState = { error: '' }

export default function AdminPortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioDto | null>(null)
  const [loading, setLoading] = useState(true)

  // State dla formularzy - używamy prawidłowych akcji z prevState
  const [portfolioState, portfolioAction, portfolioPending] = useActionState(publishPortfolio, initialState)
  const [analysisState, analysisAction, analysisPending] = useActionState(createAnalysis, initialState)

  // Pobierz dane portfela
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const data = await fetchActivePortfolio()
        setPortfolio(data)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPortfolio()
  }, [portfolioState && 'success' in portfolioState && portfolioState.success, 
      analysisState && 'success' in analysisState && analysisState.success]) // Odśwież po successful akcjach

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Panel – Portfel autora</h1>
        <p className="text-muted-foreground">
          Zarządzanie portfelem inwestycyjnym i publikowanie analiz
        </p>
      </div>

      {/* Sekcja aktualnego portfela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Obecny portfel
          </CardTitle>
          <CardDescription>
            Aktualny skład portfela inwestycyjnego
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolio ? (
            <div className="space-y-4">
              {portfolio.description && (
                <p className="text-sm text-muted-foreground">{portfolio.description}</p>
              )}
              <PortfolioChart data={portfolio.jsonData} />
              <div className="text-xs text-muted-foreground">
                Ostatnia aktualizacja: {new Date(portfolio.createdAt).toLocaleString('pl-PL')}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nie znaleziono aktywnego portfela w bazie danych.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Formularz publikacji portfela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Publikuj nowy portfel
          </CardTitle>
          <CardDescription>
            Zaktualizuj skład portfela i opublikuj go dla subskrybentów
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormError error={'error' in portfolioState ? portfolioState.error : undefined} />
            {'success' in portfolioState && portfolioState.success && (
              <FormSuccess message="Portfel został pomyślnie opublikowany!" />
            )}
            
            <form action={portfolioAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="portfolio-description" className="text-sm font-medium">
                  Opis (opcjonalny)
                </label>
                <Textarea 
                  id="portfolio-description"
                  name="description" 
                  placeholder="Krótki opis zmian w portfelu..."
                  rows={3}
                  disabled={portfolioPending}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="portfolio-jsonData" className="text-sm font-medium">
                  Dane JSON portfela *
                </label>
                <Textarea 
                  id="portfolio-jsonData"
                  name="jsonData" 
                  placeholder='{ "AAPL": 0.25, "GOOGL": 0.15, "MSFT": 0.20, "CASH": 0.40 }'
                  required
                  rows={4}
                  className="font-mono text-sm"
                  disabled={portfolioPending}
                />
                <p className="text-xs text-muted-foreground">
                  Format: klucz to ticker/nazwa, wartość to udział procentowy (0-1). Suma musi wynosić 1.0.
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={portfolioPending}>
                {portfolioPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publikowanie...
                  </>
                ) : (
                  'Publikuj portfel'
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Formularz nowej analizy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dodaj analizę
          </CardTitle>
          <CardDescription>
            Publikuj nową analizę dla subskrybentów portfela
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FormError error={'error' in analysisState ? analysisState.error : undefined} />
            {'success' in analysisState && analysisState.success && (
              <FormSuccess message="Analiza została pomyślnie opublikowana!" />
            )}
            
            <form action={analysisAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="analysis-title" className="text-sm font-medium">
                  Tytuł *
                </label>
                <Input 
                  id="analysis-title"
                  name="title" 
                  placeholder="Tytuł analizy..."
                  required
                  disabled={analysisPending}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="analysis-content" className="text-sm font-medium">
                  Treść
                </label>
                <Textarea 
                  id="analysis-content"
                  name="content" 
                  placeholder="Treść analizy (HTML lub Markdown)..."
                  rows={6}
                  disabled={analysisPending}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="analysis-attachment" className="text-sm font-medium">
                  URL załącznika (opcjonalnie)
                </label>
                <Input 
                  id="analysis-attachment"
                  name="attachmentUrl" 
                  type="url"
                  placeholder="https://example.com/report.pdf"
                  disabled={analysisPending}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={analysisPending}>
                {analysisPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publikowanie...
                  </>
                ) : (
                  'Publikuj analizę'
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 