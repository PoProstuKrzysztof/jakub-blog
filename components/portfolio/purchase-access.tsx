"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FormError } from '@/components/common/form-error'
import { FormSuccess } from '@/components/common/form-success'
import { ShoppingCart, Loader2, Lock, Star, TrendingUp, CheckCircle, CreditCard } from 'lucide-react'
import { createCheckoutSession } from '@/lib/actions/purchase-actions'

interface PurchaseAccessProps {
  productSlug?: string
  className?: string
}

export function PurchaseAccess({ 
  productSlug = 'portfolio-access',
  className 
}: PurchaseAccessProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Podaj adres email')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { url } = await createCheckoutSession({
        productSlug,
        customerEmail: email,
        successUrl: `${window.location.origin}/portfel-autora?payment=success`,
        cancelUrl: `${window.location.origin}/portfel-autora?payment=cancelled`
      })

      if (url) {
        setSuccess('Przekierowywanie do płatności...')
        window.location.href = url
      } else {
        throw new Error('Nie udało się utworzyć sesji płatności')
      }
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas tworzenia sesji płatności')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`container mx-auto max-w-4xl py-10 ${className}`}>
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Portfel autora</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Uzyskaj dostęp do mojego portfela inwestycyjnego i regularnych analiz rynkowych
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Funkcje */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Co otrzymasz?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Dostęp do aktualnego składu portfela",
              "Regularne analizy inwestycyjne",
              "Powiadomienia o zmianach w portfelu",
              "Wyjaśnienia strategii inwestycyjnej",
              "Miesięczne raporty wyników",
              "Pełną transparentność inwestycji"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Formularz zakupu */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Kup dostęp
            </CardTitle>
            <CardDescription>
              Miesięczny dostęp do portfela autora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary mb-2">49 zł</div>
              <div className="text-sm text-muted-foreground">miesięcznie</div>
            </div>

            <form onSubmit={handlePurchase} className="space-y-4">
              <FormError error={error} />
              <FormSuccess message={success} />
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Adres email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="twoj@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Na ten adres otrzymasz link do logowania
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Przekierowywanie...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Przejdź do płatności
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground">
                🔒 Bezpieczna płatność przez Stripe<br/>
                📧 Natychmiastowy dostęp po płatności<br/>
                ❌ Anuluj w każdej chwili
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dodatkowe informacje */}
      <Alert className="mb-8">
        <AlertDescription>
          <strong>Jak to działa?</strong> Po dokonaniu płatności automatycznie otrzymasz email z linkiem do logowania. 
          Kliknij w link, zaloguj się i od razu zyskasz dostęp do portfela autora i wszystkich analiz.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Masz pytania? <a href="/kontakt" className="text-primary hover:underline">Skontaktuj się ze mną</a>
        </p>
        <a href="/wpisy" className="text-primary hover:underline">
          Zobacz przykładowe analizy na blogu →
        </a>
      </div>
    </div>
  )
} 