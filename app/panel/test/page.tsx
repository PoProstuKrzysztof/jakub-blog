"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useUserRole } from '@/hooks/use-user-role'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SiteHeader } from '@/components/common/site-header'
import { CheckCircle, XCircle, User, Shield, Clock } from 'lucide-react'
import { userService } from '@/lib/services/user-service'
import { getUserPanelPath, getUserPanelLabel } from '@/lib/utils/user-role'

interface TestResult {
  status: 'success' | 'warning' | 'error'
  title: string
  description: string
  data?: any
}

export default function UserPanelTestPage() {
  const { user, loading: authLoading } = useAuth()
  const { role, loading: roleLoading, isAdmin } = useUserRole()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    if (!user) return

    setIsRunning(true)
    const results: TestResult[] = []

    try {
      // Test 1: User Authentication
      results.push({
        status: 'success',
        title: 'Uwierzytelnienie użytkownika',
        description: 'Użytkownik jest zalogowany',
        data: { email: user.email, id: user.id }
      })

      // Test 2: User Role
      if (role) {
        results.push({
          status: 'success',
          title: 'Rola użytkownika',
          description: `Rola: ${role}`,
          data: { 
            role, 
            isAdmin, 
            panelPath: getUserPanelPath(role), 
            panelLabel: getUserPanelLabel(role) 
          }
        })
      } else {
        results.push({
          status: 'warning',
          title: 'Rola użytkownika',
          description: 'Nie udało się pobrać roli użytkownika'
        })
      }

      // Test 3: User Orders
      try {
        const orders = await userService.getUserOrders(user.id)
        results.push({
          status: 'success',
          title: 'Zamówienia użytkownika',
          description: `Znaleziono ${orders.length} zamówień`,
          data: orders
        })
      } catch (error) {
        results.push({
          status: 'error',
          title: 'Zamówienia użytkownika',
          description: `Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
        })
      }

      // Test 4: User Products
      try {
        const products = await userService.getUserProducts(user.id)
        results.push({
          status: 'success',
          title: 'Produkty użytkownika',
          description: `Znaleziono ${products.length} produktów`,
          data: products
        })
      } catch (error) {
        results.push({
          status: 'error',
          title: 'Produkty użytkownika',
          description: `Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
        })
      }

      // Test 5: User Stats
      try {
        const stats = await userService.getUserStats(user.id)
        results.push({
          status: 'success',
          title: 'Statystyki użytkownika',
          description: `${stats.totalOrders} zamówień, ${stats.activeProducts} aktywnych produktów`,
          data: stats
        })
      } catch (error) {
        results.push({
          status: 'error',
          title: 'Statystyki użytkownika',
          description: `Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
        })
      }

      // Test 6: Portfolio Access (if applicable)
      try {
        const hasPortfolioAccess = await userService.hasProductAccess(user.id, 'portfolio-access')
        results.push({
          status: hasPortfolioAccess ? 'success' : 'warning',
          title: 'Dostęp do portfela autora',
          description: hasPortfolioAccess ? 'Użytkownik ma dostęp' : 'Użytkownik nie ma dostępu',
          data: { hasAccess: hasPortfolioAccess }
        })
      } catch (error) {
        results.push({
          status: 'error',
          title: 'Dostęp do portfela autora',
          description: `Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
        })
      }

    } catch (error) {
      results.push({
        status: 'error',
        title: 'Test ogólny',
        description: `Błąd podczas testów: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
      })
    } finally {
      setTestResults(results)
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader currentPage="panel" />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg text-muted-foreground">Ładowanie testów...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader currentPage="panel" />
        <div className="container mx-auto p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Musisz być zalogowany aby korzystać z testów</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader currentPage="panel" user={user} />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Test Panelu Użytkownika</h1>
          <p className="text-muted-foreground">
            Testy funkcjonalności panelu użytkownika i systemu zarządzania danymi
          </p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informacje o użytkowniku</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <p className="text-sm font-medium text-muted-foreground">Rola</p>
                <div className="flex items-center space-x-2">
                  {isAdmin ? <Shield className="h-4 w-4 text-blue-600" /> : <User className="h-4 w-4 text-gray-600" />}
                  <Badge variant={isAdmin ? "default" : "secondary"}>
                    {role || 'Nieznana'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Panel</p>
                <p className="text-sm">{getUserPanelLabel(role)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Testy funkcjonalności</CardTitle>
            <CardDescription>
              Kliknij przycisk aby uruchomić testy panelu użytkownika
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} disabled={isRunning} className="w-full sm:w-auto">
              {isRunning ? 'Uruchamianie testów...' : 'Uruchom testy'}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Wyniki testów</CardTitle>
              <CardDescription>
                Wyniki {testResults.length} przeprowadzonych testów
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.status)}
                      <h3 className="font-semibold">{result.title}</h3>
                    </div>
                    <Badge variant={result.status === 'success' ? 'default' : result.status === 'warning' ? 'secondary' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                  {result.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Pokaż dane
                      </summary>
                      <pre className="mt-2 p-2 bg-background rounded border overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 