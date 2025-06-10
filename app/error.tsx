'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Coś poszło nie tak!
        </h2>
        <p className="text-muted-foreground mb-6">
          Wystąpił nieoczekiwany błąd podczas ładowania aplikacji.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Spróbuj ponownie
          </button>
          <div>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Wróć do strony głównej
            </button>
          </div>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            ID błędu: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
} 