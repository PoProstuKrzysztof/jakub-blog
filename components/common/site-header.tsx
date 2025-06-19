"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  User, 
  LogOut, 
  Plus, 
  Edit, 
  Eye, 
  Share2, 
  Check,
  Menu,
  X,
  Home,
  BookOpen,
  MessageCircle,
  Phone,
  BarChart3,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
  user?: SupabaseUser | null
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
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const actualUser = propUser || user

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getNavLinkClass = (page: string) => {
    const baseClass = "relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/10 btn-touch"
    return currentPage === page 
      ? `${baseClass} text-primary bg-primary/5` 
      : `${baseClass} text-foreground hover:text-primary`
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
    setIsMenuOpen(false)
  }

  const navigationItems = [
    { href: '/', label: 'Strona główna', page: 'home', icon: Home },
    { href: '/wpisy', label: 'Wpisy', page: 'wpisy', icon: BookOpen },
    { href: '/wspolpraca', label: 'Współpraca', page: 'cooperation', icon: MessageCircle },
    { href: '/kontakt', label: 'Kontakt', page: 'contact', icon: Phone },
    ...(actualUser ? [{ href: '/admin', label: 'Panel twórcy', page: 'admin', icon: BarChart3 }] : []),
  ]

  const MobileNavItem = ({ href, label, page, icon: Icon, onClick }: any) => (
    <Link 
      href={href} 
      onClick={() => {
        setIsMenuOpen(false)
        onClick?.()
      }}
      className={`flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 btn-touch ${
        currentPage === page 
          ? 'bg-primary/10 text-primary border-l-4 border-primary' 
          : 'text-foreground hover:bg-primary/5 hover:text-primary'
      }`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </Link>
  )

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 safe-top ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50' 
          : 'bg-background border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-sm sm:text-lg">J</span>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {adminMode && adminTitle ? adminTitle : 'Jakub'}
                </h1>
                <p className="text-xs text-muted-foreground -mt-1 hidden sm:block">Inwestycje</p>
              </div>
            </Link>
            
            {adminMode && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1 hidden xs:inline-flex">
                Admin
              </Badge>
            )}
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.page} href={item.href} className={getNavLinkClass(item.page)}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Hidden on small screens, visible on medium+ */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 bg-background border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 btn-touch"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Share Button - Hidden on mobile */}
            {showShareButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors duration-300 btn-touch"
              >
                {shareButtonCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                <span className="ml-2 hidden md:inline">
                  {shareButtonCopied ? 'Skopiowano!' : 'Udostępnij'}
                </span>
              </Button>
            )}

            {/* Edit Button - Hidden on mobile */}
            {showEditButton && (
              <Button
                variant={isEditing ? "default" : "ghost"}
                size="sm"
                onClick={onEditToggle}
                className="hidden sm:flex transition-all duration-300 btn-touch"
              >
                <Edit className="h-4 w-4" />
                <span className="ml-2 hidden md:inline">
                  {isEditing ? 'Zapisz' : 'Edytuj'}
                </span>
              </Button>
            )}

            {/* Preview Toggle - Hidden on mobile */}
            {showPreviewToggle && (
              <Button
                variant={isPreview ? "default" : "ghost"}
                size="sm"
                onClick={onPreviewToggle}
                className="hidden sm:flex transition-all duration-300 btn-touch"
              >
                <Eye className="h-4 w-4" />
                <span className="ml-2 hidden md:inline">
                  {isPreview ? 'Edycja' : 'Podgląd'}
                </span>
              </Button>
            )}

            {/* User Menu - Desktop and Mobile */}
            {actualUser ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {adminMode && (
                  <Link href="/admin/nowy-post">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground btn-touch hidden sm:flex">
                      <Plus className="h-4 w-4" />
                      <span className="ml-2 hidden lg:inline">Nowy post</span>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive transition-colors duration-300 btn-touch hidden sm:flex"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 hidden lg:inline">Wyloguj</span>
                </Button>
                {/* Mobile Logout Button - Visible only on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive transition-colors duration-300 btn-touch sm:hidden p-2"
                  title="Wyloguj się"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                {/* Desktop Login/Signup Buttons */}
                <div className="hidden sm:flex items-center space-x-1">
                  <Link href="/admin/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground  transition-colors duration-300 btn-touch"
                    >
                      <User className="h-4 w-4" />
                      <span className="ml-2 hidden lg:inline">Zaloguj</span>
                    </Button>
                  </Link>
                  <Link href="/admin/login?tab=signup">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground btn-touch"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="ml-2 hidden lg:inline">Utwórz konto</span>
                    </Button>
                  </Link>
                </div>
                
                {/* Mobile Login Button - Visible only on mobile */}
                <Link href="/admin/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 btn-touch sm:hidden p-2"
                    title="Zaloguj się / Utwórz konto"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2 btn-touch"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Otwórz menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-3/4 sm:max-w-sm p-0 safe-right">
                <SheetHeader className="p-4 sm:p-6 border-b border-border">
                  <SheetTitle className="text-left flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">J</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold">Jakub Inwestycje</span>
                      {adminMode && (
                        <Badge className="ml-2 bg-primary/10 text-primary text-xs">Admin</Badge>
                      )}
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                  {/* Search in Mobile Menu */}
                  {showSearch && (
                    <div className="p-4 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={searchPlaceholder}
                          value={searchValue}
                          onChange={(e) => onSearchChange?.(e.target.value)}
                          className="pl-10 bg-background border-border rounded-xl btn-touch"
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <nav className="flex-1 p-4 space-y-1">
                    {navigationItems.map((item) => (
                      <MobileNavItem
                        key={item.page}
                        href={item.href}
                        label={item.label}
                        page={item.page}
                        icon={item.icon}
                      />
                    ))}

                    {/* Admin Navigation */}
                    {actualUser && adminMode && (
                      <>
                        <div className="border-t border-border my-4 pt-4">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-3">
                            Panel administracyjny
                          </p>
                          <MobileNavItem
                            href="/admin"
                            label="Dashboard"
                            page="admin"
                            icon={BarChart3}
                          />
                          <MobileNavItem
                            href="/admin/nowy-post"
                            label="Nowy post"
                            page="new-post"
                            icon={Plus}
                          />
                        </div>
                      </>
                    )}
                  </nav>

                  {/* Mobile Action Buttons */}
                  <div className="p-4 border-t border-border space-y-2 safe-bottom">
                    {/* Mobile Share Button */}
                    {showShareButton && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onShare?.()
                          setIsMenuOpen(false)
                        }}
                        className="w-full justify-start btn-touch"
                      >
                        {shareButtonCopied ? <Check className="h-4 w-4 mr-3" /> : <Share2 className="h-4 w-4 mr-3" />}
                        {shareButtonCopied ? 'Skopiowano!' : 'Udostępnij'}
                      </Button>
                    )}

                    {/* Mobile Edit Button */}
                    {showEditButton && (
                      <Button
                        variant={isEditing ? "default" : "ghost"}
                        onClick={() => {
                          onEditToggle?.()
                          setIsMenuOpen(false)
                        }}
                        className="w-full justify-start btn-touch"
                      >
                        <Edit className="h-4 w-4 mr-3" />
                        {isEditing ? 'Zapisz' : 'Edytuj'}
                      </Button>
                    )}

                    {/* Mobile Preview Toggle */}
                    {showPreviewToggle && (
                      <Button
                        variant={isPreview ? "default" : "ghost"}
                        onClick={() => {
                          onPreviewToggle?.()
                          setIsMenuOpen(false)
                        }}
                        className="w-full justify-start btn-touch"
                      >
                        <Eye className="h-4 w-4 mr-3" />
                        {isPreview ? 'Edycja' : 'Podgląd'}
                      </Button>
                    )}

                    {/* User Actions - Show login/signup or logout based on user state */}
                    {actualUser ? (
                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 btn-touch"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Wyloguj się
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/admin/login" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start btn-touch">
                            <User className="h-4 w-4 mr-3" />
                            Zaloguj się
                          </Button>
                        </Link>
                        <Link href="/admin/login?tab=signup" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="default" className="w-full justify-start btn-touch bg-primary hover:bg-primary/90">
                            <UserPlus className="h-4 w-4 mr-3" />
                            Utwórz konto
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
} 