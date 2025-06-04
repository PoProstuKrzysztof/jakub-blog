"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn, user, loading } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/admin")
    }
  }, [user, loading, router])

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" className="bg-background">
        <div className="text-primary-foreground text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Sprawdzanie uwierzytelnienia...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn(formData.email, formData.password)
      
      if (result.error) {
        setError(result.error)
      } else {
        // Successful login - redirect to admin panel
        router.push("/admin")
      }
    } catch (error) {
      setError("Wystąpił nieoczekiwany błąd podczas logowania")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen" className="bg-background">
      {/* Header */}
      <header className="bg-accent shadow-lg border-b border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-foreground">
              Jakub Inwestycje
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Powrót do strony głównej
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="bg-card/95 rounded-2xl shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary shadow-lg">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Panel Administratora</CardTitle>
              <CardDescription className="text-muted-foreground">
                Zaloguj się, aby uzyskać dostęp do panelu twórcy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 border-accent rounded-xl focus:border-primary transition-colors duration-300"
                      placeholder="Wprowadź adres email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Hasło
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-10 border-accent rounded-xl focus:border-primary transition-colors duration-300"
                      placeholder="Wprowadź hasło"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-muted-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logowanie...
                    </div>
                  ) : (
                    "Zaloguj się"
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-background rounded-xl">
                <h4 className="text-sm font-medium text-foreground mb-2">Informacja:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Zaloguj się używając swojego konta Supabase
                  </p>
                  <p>
                    Jeśli nie masz konta, skontaktuj się z administratorem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
