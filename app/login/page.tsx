"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, LogIn, UserPlus, CheckCircle, Mail, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useAuthForm } from '@/hooks/use-auth-form'
import { useToast } from '@/hooks/use-toast'
import { getUserRole, getUserPanelPath } from '@/lib/utils/user-role'
import { createClient } from '@/lib/supabase/supabase'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [hasTriggeredRedirect, setHasTriggeredRedirect] = useState(false)
  const [showResendEmail, setShowResendEmail] = useState(false)
  const [emailForResend, setEmailForResend] = useState('')
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

  // Hook dla logowania
  const loginForm = useAuthForm({
    preserveFormOnError: true,
    onSuccess: async (result) => {
      setShowResendEmail(false)
      setHasTriggeredRedirect(true)
      setSuccessMessage('Logowanie pomyślne! Przekierowywanie...')
      setIsRedirecting(true)
      
      toast({
        title: "Logowanie pomyślne! ✅",
        description: "Przekierowywanie do panelu...",
        duration: 2000,
      })

      setTimeout(async () => {
        try {
          const redirectTo = searchParams.get('redirectTo')
          
          if (redirectTo) {
            router.push(redirectTo)
            return
          }

          if (result.user) {
            const role = await getUserRole(result.user.id)
            const panelPath = getUserPanelPath(role)
            router.push(panelPath)
          } else {
            router.push('/panel')
          }
        } catch (error) {
          router.push('/panel')
        }
      }, 1500)
    },
    onError: (error) => {
      // Sprawdź czy to błąd niezweryfikowanego emaila
      const errorLower = error.toLowerCase()
      const isEmailNotConfirmed = 
        errorLower.includes('email not confirmed') || 
        errorLower.includes('email not verified') ||
        errorLower.includes('confirm your email') ||
        errorLower.includes('invalid login credentials') ||
        errorLower.includes('user not confirmed') ||
        errorLower.includes('account not confirmed')
      
      if (isEmailNotConfirmed && loginForm.formData.email) {
        setEmailForResend(loginForm.formData.email)
        setShowResendEmail(true)
        // Nie pokazuj błędu - tylko opcję ponownego wysłania emaila
      } else {
        toast({
          title: "Błąd logowania",
          description: error,
          variant: "destructive",
        })
      }
    }
  })

  // Hook dla rejestracji
  const signupForm = useAuthForm({
    preserveFormOnError: true,
    onSuccess: () => {
      setShowResendEmail(false)
      setSuccessMessage('Sprawdź swoją skrzynkę e-mail (w tym folder spam) i kliknij link aktywacyjny.')
      toast({
        title: "Rejestracja pomyślna! 📧",
        description: "Sprawdź swoją skrzynkę e-mail.",
        duration: 3000,
      })
      // Wyczyść formularz po udanej rejestracji
      signupForm.resetForm()
    },
    onError: (error) => {
      toast({
        title: "Błąd rejestracji",
        description: error,
        variant: "destructive",
      })
    }
  })

  // Funkcja do ponownego wysłania emaila potwierdzającego
  const handleResendConfirmation = async () => {
    if (!emailForResend) return

    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailForResend,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }

      toast({
        title: "Email wysłany ponownie! 📧", 
        description: "Sprawdź swoją skrzynkę email i kliknij link potwierdzający.",
        duration: 5000,
      })
      setShowResendEmail(false)
    } catch (error) {
      toast({
        title: "Błąd wysyłania emaila",
        description: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd',
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  // Check URL params for initial tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'signup') {
      setActiveTab('signup')
    }
  }, [searchParams])

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading && !hasTriggeredRedirect && !isRedirecting) {
      setHasTriggeredRedirect(true)
      setSuccessMessage('Już jesteś zalogowany! Przekierowywanie...')
      setIsRedirecting(true)
      
      toast({
        title: "Już jesteś zalogowany! 👋",
        description: "Przekierowywanie do panelu...",
        duration: 1500,
      })
      
      setTimeout(async () => {
        try {
          const redirectTo = searchParams.get('redirectTo')
          
          if (redirectTo) {
            router.push(redirectTo)
            return
          }

          // Spróbuj pobrać rolę użytkownika z opóźnieniem na wypadek, gdyby trigger potrzebował czasu
          const role = await getUserRole(user.id)
          
          // Jeśli nie ma profilu jeszcze (trigger może potrzebować czasu), sprawdź ponownie
          if (!role) {
            setTimeout(async () => {
              try {
                const retryRole = await getUserRole(user.id)
                const panelPath = getUserPanelPath(retryRole)
                router.push(panelPath)
              } catch (retryError) {
                // Jeśli nadal błąd, przekieruj do panelu użytkownika
                router.push("/panel")
              }
            }, 2000) // Czekaj 2 sekundy na trigger
            return
          }

          const panelPath = getUserPanelPath(role)
          router.push(panelPath)
        } catch (error) {
          router.push("/panel")
        }
      }, 1000)
    }
  }, [user, authLoading, router, toast, searchParams, hasTriggeredRedirect, isRedirecting])

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
    await loginForm.submitLogin()
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Dodatkowa walidacja dla rejestracji
    if (signupForm.formData.password !== signupForm.formData.confirmPassword) {
      signupForm.setErrors({ confirmPassword: 'Hasła nie są identyczne' })
      return
    }

    if (signupForm.formData.password.length < 6) {
      signupForm.setErrors({ password: 'Hasło musi mieć co najmniej 6 znaków' })
      return
    }

    await signupForm.submitSignup()
  }

  const clearMessages = () => {
    setSuccessMessage('')
    setShowResendEmail(false)
    loginForm.clearErrors()
    signupForm.clearErrors()
  }

  const isLoading = loginForm.loading || signupForm.loading

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Witaj!
          </CardTitle>
          <CardDescription className="text-base">
            Zaloguj się lub utwórz nowe konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value)
            clearMessages()
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center gap-2 font-medium">
                <LogIn className="h-4 w-4" />
                Logowanie
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2 font-medium">
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
                    value={loginForm.formData.email}
                    onChange={(e) => loginForm.updateField('email', e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Hasło</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Wprowadź hasło"
                    value={loginForm.formData.password}
                    onChange={(e) => loginForm.updateField('password', e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                
                {loginForm.errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginForm.errors.general}</AlertDescription>
                  </Alert>
                )}

                {showResendEmail && (
                  <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="space-y-3">
                        <p className="font-medium">Potwierdź swój adres email</p>
                        <p className="text-sm">
                          Wyślij link potwierdzający na adres <strong>{emailForResend}</strong>.
                          Sprawdź swoją skrzynkę pocztową (w tym folder spam).
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResendConfirmation}
                          disabled={isResending}
                          className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800 font-medium"
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Wysyłanie...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Wyślij email potwierdzający
                            </>
                          )}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="space-y-2">
                        <p className="font-medium">Sukces!</p>
                        <p className="text-sm">{successMessage}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logowanie...
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
                    value={signupForm.formData.fullName}
                    onChange={(e) => signupForm.updateField('fullName', e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="twoj@email.com"
                    value={signupForm.formData.email}
                    onChange={(e) => signupForm.updateField('email', e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Hasło</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Minimum 6 znaków"
                    value={signupForm.formData.password}
                    onChange={(e) => signupForm.updateField('password', e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Potwierdź hasło</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Powtórz hasło"
                    value={signupForm.formData.confirmPassword}
                    onChange={(e) => signupForm.updateField('confirmPassword', e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>
                
                {signupForm.errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{signupForm.errors.general}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="space-y-2">
                        <p className="font-medium">Sukces!</p>
                        <p className="text-sm">{successMessage}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
                  {isLoading ? (
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