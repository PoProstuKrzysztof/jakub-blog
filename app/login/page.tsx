"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, LogIn, UserPlus, CheckCircle, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useAuthForm } from '@/hooks/use-auth-form'
import { useToast } from '@/hooks/use-toast'
import { getUserRole, getUserPanelPath } from '@/lib/utils/user-role'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [hasTriggeredRedirect, setHasTriggeredRedirect] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  // Hook dla logowania
  const loginForm = useAuthForm({
    preserveFormOnError: true,
    onSuccess: async (result) => {
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
      toast({
        title: "Błąd logowania",
        description: error,
        variant: "destructive",
      })
    }
  })

  // Hook dla rejestracji
  const signupForm = useAuthForm({
    preserveFormOnError: true,
    onSuccess: () => {
      setSuccessMessage('Sprawdź swoją skrzynkę e-mail i kliknij link aktywacyjny.')
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
    loginForm.clearErrors()
    signupForm.clearErrors()
  }

  const isLoading = loginForm.loading || signupForm.loading

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
                     value={loginForm.formData.email}
                     onChange={(e) => loginForm.updateField('email', e.target.value)}
                     required
                     disabled={isLoading}
                   />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Hasło</Label>
                  <Input
                    id="login-password"
                    type="password"
                                         value={loginForm.formData.password}
                     onChange={(e) => loginForm.updateField('password', e.target.value)}
                     required
                     disabled={isLoading}
                   />
                 </div>
                 
                 {loginForm.errors.general && (
                   <Alert variant="destructive">
                     <AlertDescription>{loginForm.errors.general}</AlertDescription>
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

                 <Button type="submit" className="w-full" disabled={isLoading}>
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
                   />
                 </div>
                 
                 {signupForm.errors.general && (
                   <Alert variant="destructive">
                     <AlertDescription>{signupForm.errors.general}</AlertDescription>
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

                 <Button type="submit" className="w-full" disabled={isLoading}>
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