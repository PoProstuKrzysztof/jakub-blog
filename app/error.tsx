'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  const isChunkLoadError = error.name === 'ChunkLoadError' || 
    error.message?.includes('Loading chunk') ||
    error.message?.includes('Loading CSS chunk')

  const handleReset = () => {
    // Clear any cached chunks if it's a chunk load error
    if (isChunkLoadError && 'caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('next-static') || name.includes('webpack')) {
            caches.delete(name)
          }
        })
      })
    }
    
    // Force a hard reload for chunk errors
    if (isChunkLoadError) {
      window.location.reload()
    } else {
      reset()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-destructive">
            <AlertTriangle className="h-full w-full" />
          </div>
          <CardTitle className="text-xl">
            {isChunkLoadError ? 'Problem z ładowaniem' : 'Wystąpił błąd'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {isChunkLoadError 
              ? 'Wystąpił problem z ładowaniem części aplikacji. Spróbuj odświeżyć stronę.'
              : 'Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj ponownie.'
            }
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="text-sm font-medium cursor-pointer">
                Szczegóły błędu (tryb deweloperski)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {error.message}
              </pre>
            </details>
          )}
          
          <Button 
            onClick={handleReset} 
            className="w-full"
            variant={isChunkLoadError ? "default" : "outline"}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isChunkLoadError ? 'Odśwież stronę' : 'Spróbuj ponownie'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 