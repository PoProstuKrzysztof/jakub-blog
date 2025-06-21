import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">
            Błąd autoryzacji
          </h1>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Wystąpił problem podczas logowania</AlertTitle>
          <AlertDescription className="mt-2">
            Nie udało się przetworzyć kodu autoryzacji. To może oznaczać:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Link autoryzacji wygasł</li>
              <li>Link został już użyty</li>
              <li>Wystąpił problem z konfiguracją OAuth</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/login">
              Spróbuj zalogować się ponownie
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Wróć do strony głównej
            </Link>
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            Jeśli problem się powtarza, skontaktuj się z administratorem.
          </p>
        </div>
      </div>
    </div>
  )
} 