"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, User, Shield, Clock } from 'lucide-react'
import { SiteHeader } from '@/components/common/site-header'

interface AuthTestResult {
  status: 'success' | 'error' | 'warning'
  title: string
  description: string
  data?: any
}

export default function AuthTestPage() {
  const { user, session, loading } = useAuth()
  const [testResults, setTestResults] = useState<AuthTestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runAuthTests = async () => {
    setIsRunning(true)
    const results: AuthTestResult[] = []
    
    try {
      // Test 1: Check basic auth state
      if (user && session) {
        results.push({
          status: 'success',
          title: 'Sesja użytkownika',
          description: 'Użytkownik jest zalogowany',
          data: { email: user.email, id: user.id }
        })
      } else {
        results.push({
          status: 'error',
          title: 'Sesja użytkownika',
          description: 'Użytkownik nie jest zalogowany'
        })
      }

      // Test 2: Check session validity
      if (session) {
        const now = Math.floor(Date.now() / 1000)
        const expiresAt = session.expires_at
        
        if (expiresAt && expiresAt > now) {
          const timeLeft = Math.floor((expiresAt - now) / 60)
          results.push({
            status: 'success',
            title: 'Ważność sesji',
            description: `Sesja ważna przez ${timeLeft} minut`,
            data: { expiresAt: new Date(expiresAt * 1000).toLocaleString() }
          })
        } else {
          results.push({
            status: 'warning',
            title: 'Ważność sesji',
            description: 'Sesja wygasła lub wygaśnie wkrótce'
          })
        }
      }

      // Test 3: Check user profile and role
      if (user) {
        const supabase = createClient()
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, is_active, created_at')
          .eq('id', user.id)
          .single()

        if (error) {
          results.push({
            status: 'error',
            title: 'Profil użytkownika',
            description: `Błąd pobierania profilu: ${error.message}`
          })
        } else if (profile) {
          results.push({
            status: 'success',
            title: 'Profil użytkownika',
            description: `Rola: ${profile.role}, Aktywny: ${profile.is_active ? 'Tak' : 'Nie'}`,
            data: profile
          })

          // Test 4: Check admin permissions
          if (profile.role === 'admin' && profile.is_active) {
            results.push({
              status: 'success',
              title: 'Uprawnienia administratora',
              description: 'Użytkownik ma pełne uprawnienia administratora'
            })
          } else if (profile.role === 'author' && profile.is_active) {
            results.push({
              status: 'warning',
              title: 'Uprawnienia administratora',
              description: 'Użytkownik ma uprawnienia autora (ograniczone)'
            })
          } else {
            results.push({
              status: 'error',
              title: 'Uprawnienia administratora',
              description: 'Użytkownik nie ma uprawnień administratora'
            })
          }
        }
      }

      // Test 5: Check auth error handling
      try {
        const supabase = createClient()
        const { data: { user: currentUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          results.push({
            status: 'error',
            title: 'Test pobrania użytkownika',
            description: `Błąd: ${error.message}`
          })
        } else {
          results.push({
            status: 'success',
            title: 'Test pobrania użytkownika',
            description: 'Pomyślnie pobrano dane użytkownika'
          })
        }
      } catch (error: any) {
        results.push({
          status: 'error',
          title: 'Test pobrania użytkownika',
          description: `Błąd: ${error.message}`
        })
      }

    } catch (error: any) {
      results.push({
        status: 'error',
        title: 'Błąd testów',
        description: `Nieoczekiwany błąd: ${error.message}`
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }

  useEffect(() => {
    if (!loading) {
      runAuthTests()
    }
  }, [loading, user, session])

  const getStatusIcon = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader currentPage="admin" adminMode={true} />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg text-muted-foreground">Sprawdzanie stanu uwierzytelniania...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader currentPage="admin" adminMode={true} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Test Uwierzytelniania</h1>
          <p className="text-muted-foreground">
            Sprawdzenie stanu uwierzytelniania i uprawnień użytkownika
          </p>
        </div>

        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informacje o bieżącym użytkowniku</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-sm font-mono">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ostatnie logowanie</p>
                  <p className="text-sm">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Brak danych'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="default">Zalogowany</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">Brak zalogowanego użytkownika</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Wyniki testów</h2>
          
          {isRunning ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Wykonywanie testów...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {testResults.map((result, index) => (
                <Card key={index} className={getStatusColor(result.status)}>
                  <CardContent className="flex items-start space-x-4 p-4">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                      {result.data && (
                        <pre className="mt-2 text-xs bg-background/50 p-2 rounded">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* API Test Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Test API uwierzytelniania</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Przetestuj endpoint API który sprawdza uwierzytelnianie i uprawnienia
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => window.open('/api/admin/test-auth', '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Otwórz API Test w nowej karcie
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/test-auth')
                        const data = await response.json()
                        alert(JSON.stringify(data, null, 2))
                      } catch (error) {
                        alert('Błąd: ' + error)
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Wykonaj API Test (Alert)
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={runAuthTests}
            disabled={isRunning}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isRunning ? 'Testowanie...' : 'Odśwież testy'}
          </button>
        </div>
      </div>
    </div>
  )
} 