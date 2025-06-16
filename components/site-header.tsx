"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Edit,
  LogOut,
  Eye,
  ArrowLeft,
  Share2,
  Check,
  MessageCircle,
  Menu,
  X,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import type { User } from "@supabase/supabase-js"

interface SiteHeaderProps {
  currentPage?: 'home' | 'wpisy' | 'cooperation' | 'contact' | 'admin' | 'post'
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  adminMode?: boolean
  adminTitle?: string
  showPreviewToggle?: boolean
  isPreview?: boolean
  onPreviewToggle?: () => void
  showShareButton?: boolean
  onShare?: () => void
  shareButtonCopied?: boolean
  showEditButton?: boolean
  isEditing?: boolean
  onEditToggle?: () => void
  user?: User | null
}

export function SiteHeader({
  currentPage = 'home',
  showSearch = false,
  searchPlaceholder = "Szukaj...",
  searchValue = "",
  onSearchChange,
  adminMode = false,
  adminTitle,
  showPreviewToggle = false,
  isPreview = false,
  onPreviewToggle,
  showShareButton = false,
  onShare,
  shareButtonCopied = false,
  showEditButton = false,
  isEditing = false,
  onEditToggle,
  user: propUser,
}: SiteHeaderProps) {
  const { user: authUser, signOut } = useAuth()
  const user = propUser || authUser
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getNavLinkClass = (page: string) => {
    const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap flex items-center justify-center min-h-[40px]"
    const activeClass = "text-primary bg-primary/10"
    const inactiveClass = "text-foreground hover:text-primary hover:bg-primary/10"
    
    return `${baseClass} ${currentPage === page ? activeClass : inactiveClass}`
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <>
      {/* Header */}
      <header className={`shadow-sm py-4 border-b sticky top-0 z-40 ${
        adminMode ? 'bg-accent border-accent' : 'bg-card border-border'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center min-h-[48px]">
            
            {/* Left Section - Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${
                  adminMode ? 'text-primary-foreground' : 'text-primary'
                }`}>
                  JAKUB INWESTYCJE
                </div>
              </Link>
              {adminTitle && (
                <Badge className="bg-primary text-primary-foreground rounded-xl">
                  {adminTitle}
                </Badge>
              )}
            </div>

            {/* Center Section - Navigation Menu (stała pozycja) */}
            <div className="flex justify-center">
              {!adminMode && (
                <nav className="hidden lg:flex items-center space-x-2">
                  <Link href="/" className={getNavLinkClass('home')}>
                    Home
                  </Link>
                  <Link href="/wpisy" className={getNavLinkClass('wpisy')}>
                    Wpisy
                  </Link>
                  <Link href="/wspolpraca" className={getNavLinkClass('cooperation')}>
                    Współpraca
                  </Link>
                  <Link href="/kontakt" className={getNavLinkClass('contact')}>
                    Kontakt
                  </Link>
                </nav>
              )}
              
              {/* Mobile Menu Button - widoczny na tablet i mobile */}
              {!adminMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
            </div>

            {/* Right Section - Admin/User Buttons (maksymalnie po prawej) */}
            <div className="flex justify-end">
              <div className="flex items-center space-x-2">
                
                {/* Admin Mode Buttons */}
                {adminMode && (
                  <>
                    {showPreviewToggle && (
                      <Button
                        onClick={onPreviewToggle}
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isPreview ? "Edycja" : "Podgląd"}
                      </Button>
                    )}
                    {showShareButton && (
                      <Button
                        onClick={onShare}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {shareButtonCopied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Skopiowano!
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4 mr-2" />
                            Udostępnij
                          </>
                        )}
                      </Button>
                    )}
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Powrót
                      </Button>
                    </Link>
                  </>
                )}

                {/* Regular Mode Buttons - Responsive visibility */}
                {!adminMode && (
                  <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                    {/* Przyciski dla zalogowanych użytkowników */}
                    {user && (
                      <>
                        <Link href="/admin">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl text-xs lg:text-sm px-2 lg:px-3"
                          >
                            <Settings className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            <span className="hidden xl:inline">Panel Twórcy</span>
                            <span className="xl:hidden">Panel</span>
                          </Button>
                        </Link>
                        <Link href="/admin/nowy-post">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs lg:text-sm px-2 lg:px-3"
                          >
                            <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            <span className="hidden xl:inline">Nowy post</span>
                            <span className="xl:hidden">Nowy</span>
                          </Button>
                        </Link>
                        {showEditButton && (
                          <Button
                            onClick={onEditToggle}
                            variant="outline"
                            size="sm"
                            className="text-xs lg:text-sm px-2 lg:px-3"
                          >
                            <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            <span className="hidden xl:inline">{isEditing ? "Zakończ edycję" : "Edytuj usługi"}</span>
                            <span className="xl:hidden">Edytuj</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          className="text-xs lg:text-sm px-2 lg:px-3"
                        >
                          <LogOut className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                          <span className="hidden xl:inline">Wyloguj</span>
                          <span className="xl:hidden">Exit</span>
                        </Button>
                      </>
                    )}
                    
                    {/* Panel administratora dla niezalogowanych */}
                    {!user && (
                      <Link href="/admin/login">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs lg:text-sm px-2 lg:px-3"
                        >
                          Zaloguj
                        </Button>
                      </Link>
                    )}
                    
                    {/* Kontekstowe przyciski */}
                    {currentPage === 'post' && (
                      <Link href="/">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl text-xs lg:text-sm px-2 lg:px-3"
                        >
                          <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                          <span className="hidden xl:inline">Powrót do strony głównej</span>
                          <span className="xl:hidden">Powrót</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {!adminMode && isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link 
              href="/" 
              className={`block w-full ${getNavLinkClass('home')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/wpisy" 
              className={`block w-full ${getNavLinkClass('wpisy')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Wpisy
            </Link>
            <Link 
              href="/wspolpraca" 
              className={`block w-full ${getNavLinkClass('cooperation')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Współpraca
            </Link>
            <Link 
              href="/kontakt" 
              className={`block w-full ${getNavLinkClass('contact')}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontakt
            </Link>
            
            {/* Mobile Action Buttons */}
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Panel Twórcy
                    </Button>
                  </Link>
                  <Link href="/admin/nowy-post" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Nowy post
                    </Button>
                  </Link>
                  {showEditButton && (
                    <Button
                      onClick={() => {
                        onEditToggle?.()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Zakończ edycję" : "Edytuj usługi"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Wyloguj
                  </Button>
                </>
              ) : (
                <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Zaloguj
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Section */}
      {showSearch && (
        <section className="bg-card py-6 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 w-full bg-background text-foreground border border-border rounded-xl shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floating Action Button for Contact */}
      {(currentPage === 'cooperation' || currentPage === 'contact') && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <Link href="/kontakt">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110"
            >
              <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            </Button>
          </Link>
        </div>
      )}
    </>
  )
} 