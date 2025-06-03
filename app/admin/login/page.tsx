"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple authentication check (in real app, this would be server-side)
    if (formData.username === "admin" && formData.password === "admin123") {
      // Set admin session (in real app, use proper authentication)
      localStorage.setItem("isAdmin", "true")
      router.push("/admin")
    } else {
      setError("Nieprawidłowa nazwa użytkownika lub hasło")
    }

    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#413B61" }}>
      {/* Header */}
      <header className="bg-[#332941] shadow-lg border-b border-[#3B3486]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              Jakub Inwestycje
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-[#864AF9] text-[#864AF9] hover:bg-[#864AF9] hover:text-white transition-all duration-300 rounded-xl"
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
          <Card className="bg-white/95 rounded-2xl shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#864AF9] shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#332941]">Panel Administratora</CardTitle>
              <CardDescription className="text-gray-600">
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
                  <Label htmlFor="username" className="text-[#332941] font-medium">
                    Nazwa użytkownika
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="pl-10 border-[#3B3486] rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                      placeholder="Wprowadź nazwę użytkownika"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#332941] font-medium">
                    Hasło
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 pr-10 border-[#3B3486] rounded-xl focus:border-[#864AF9] transition-colors duration-300"
                      placeholder="Wprowadź hasło"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#864AF9] hover:bg-[#7c42e8] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:opacity-70"
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

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Dane testowe:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Użytkownik:</strong> admin
                  </p>
                  <p>
                    <strong>Hasło:</strong> admin123
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
