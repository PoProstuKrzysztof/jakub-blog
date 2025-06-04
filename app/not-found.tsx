'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Strona nie została znaleziona
          </h2>
          <p className="text-muted-foreground">
            Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
              <Home className="h-4 w-4 mr-2" />
              Powrót do strony głównej
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Wróć do poprzedniej strony
          </Button>
        </div>
      </div>
    </div>
  )
} 