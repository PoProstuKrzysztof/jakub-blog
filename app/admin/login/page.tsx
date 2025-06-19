"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, LogIn, UserPlus, CheckCircle, Mail } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading, signIn, signUp } = useAuth()
  const { toast } = useToast()

  // Check URL params for initial tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'signup') {
      setActiveTab('signup')
    }
  }, [searchParams])

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
        description: "Przekierowywanie do panelu...",
        duration: 1500,
      })
      
      setTimeout(() => {
        // Sprawdź czy użytkownik to admin (można sprawdzić role w metadata lub inną logikę)
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
            {authLoading ? 'Sprawdzanie autoryzacji...' : 'Przekierowywanie...'}
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
      const result = await signIn(email, password)

      if (result.error) {
        setErrorMessage(result.error)
        toast({
          title: "Błąd logowania",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setSuccessMessage('Logowanie pomyślne! Przekierowywanie...')
      setIsRedirecting(true)
      
      toast({
        title: "Logowanie pomyślne! ✅",
        description: "Przekierowywanie do panelu...",
        duration: 2000,
      })
      
      setTimeout(() => {
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    // Walidacja
    if (password !== confirmPassword) {
      setErrorMessage('Hasła nie są identyczne')
      toast({
        title: "Błąd rejestracji",
        description: "Hasła nie są identyczne",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setErrorMessage('Hasło musi mieć co najmniej 6 znaków')
      toast({
        title: "Błąd rejestracji",
        description: "Hasło musi mieć co najmniej 6 znaków",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const metadata = fullName ? { full_name: fullName } : undefined
      const result = await signUp(email, password, metadata)

      if (result.error) {
        setErrorMessage(result.error)
        toast({
          title: "Błąd rejestracji",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setSuccessMessage('Rejestracja pomyślna! Sprawdź swoją skrzynkę email w celu potwierdzenia konta.')
      
      toast({
        title: "Rejestracja pomyślna! ✅",
        description: "Sprawdź swoją skrzynkę email w celu potwierdzenia konta.",
        duration: 5000,
      })

      // Wyczyść formularz
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setFullName('')
      
    } catch {
      setErrorMessage('Wystąpił błąd podczas rejestracji')
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas rejestracji.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Witaj!</CardTitle>
          <CardDescription className="text-center">
            Zaloguj się lub utwórz nowe konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value)
            clearMessages()
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Logowanie
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Rejestracja
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || isRedirecting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Hasło</Label>
                  <Input
                    id="login-password"
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
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Zaloguj się
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Imię i nazwisko (opcjonalne)</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Jan Kowalski"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Hasło</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Minimum 6 znaków"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Potwierdź hasło</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Powtórz hasło"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <Mail className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tworzenie konta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Utwórz konto
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
