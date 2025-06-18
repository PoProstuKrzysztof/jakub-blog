"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, LogIn, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      setIsRedirecting(false)
      setSuccessMessage('')
    }
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      setSuccessMessage('Już jesteś zalogowany! Przekierowywanie...')
      setIsRedirecting(true)
      
      toast({
        title: "Już jesteś zalogowany! 👋",
        description: "Przekierowywanie do panelu administratora...",
        duration: 1500,
      })
      
      setTimeout(() => {
        router.push("/admin")
      }, 1000)
    }
  }, [user, authLoading, router, toast])

  // Show loading while checking auth state or redirecting
  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium text-slate-600">
            {authLoading ? 'Sprawdzanie autoryzacji...' : 'Przekierowywanie do panelu...'}
          </div>
          {successMessage && (
            <div className="text-sm text-green-600 font-medium">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setErrorMessage(authError.message)
        toast({
          title: "Błąd logowania",
          description: authError.message,
          variant: "destructive",
        })
        return
      }

      if (data.user) {
        setSuccessMessage('Logowanie pomyślne! Przekierowywanie...')
        setIsRedirecting(true)
        
        // Show success toast
        toast({
          title: "Logowanie pomyślne! ✅",
          description: "Przekierowywanie do panelu administratora...",
          duration: 2000,
        })
        
        // Small delay to show success message
        const redirectTimeout = setTimeout(() => {
          try {
            router.push('/admin')
          } catch (error) {
            console.error('Redirect error:', error)
            setErrorMessage('Błąd podczas przekierowywania. Spróbuj ponownie.')
            setIsRedirecting(false)
            setSuccessMessage('')
            
            toast({
              title: "Błąd przekierowywania",
              description: "Spróbuj ponownie lub odśwież stronę.",
              variant: "destructive",
            })
          }
        }, 1500)

        // Cleanup timeout if component unmounts
        return () => clearTimeout(redirectTimeout)
      }
    } catch {
      setErrorMessage('Wystąpił błąd podczas logowania')
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas logowania.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Panel Administratora</CardTitle>
          <CardDescription className="text-center">
            Zaloguj się aby uzyskać dostęp do panelu administracyjnego
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || isRedirecting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || isRedirecting}
              />
            </div>
            
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading || isRedirecting}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
                </>
              ) : isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Przekierowywanie...
                </>
              ) : (
                'Zaloguj się'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
