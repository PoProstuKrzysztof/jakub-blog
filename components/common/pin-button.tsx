"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Pin, PinOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

interface PinButtonProps {
  postId: string
  isPinned: boolean
  onToggle?: (isPinned: boolean) => void
}

export function PinButton({ postId, isPinned, onToggle }: PinButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentlyPinned, setCurrentlyPinned] = useState(isPinned)
  const { user } = useAuth()
  const { toast } = useToast()

  // Only show to authenticated users (admins)
  if (!user) {
    return null
  }

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Optimistic update - zmiana natychmiastowa
    const newPinnedStatus = !currentlyPinned
    setCurrentlyPinned(newPinnedStatus)
    onToggle?.(newPinnedStatus)
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/posts/toggle-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Sprawdź czy stan z serwera jest zgodny z optimistic update
        const serverPinnedStatus = result.isPinned ?? newPinnedStatus
        
        if (serverPinnedStatus !== newPinnedStatus) {
          // Jeśli serwer zwrócił inny stan, skoryguj
          setCurrentlyPinned(serverPinnedStatus)
          onToggle?.(serverPinnedStatus)
        }
        
        toast({
          title: serverPinnedStatus ? "Post przypięty" : "Post odpięty",
          description: serverPinnedStatus 
            ? "Post został przypięty na górze strony" 
            : "Post został odpięty",
        })
      } else {
        // Rollback optimistic update w przypadku błędu
        setCurrentlyPinned(!newPinnedStatus)
        onToggle?.(!newPinnedStatus)
        
        toast({
          title: "Błąd",
          description: result.error || "Nie udało się zmienić statusu przypięcia",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Rollback optimistic update w przypadku błędu
      setCurrentlyPinned(!newPinnedStatus)
      onToggle?.(!newPinnedStatus)
      
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleTogglePin}
      disabled={isLoading}
      size="sm"
      className={`
        w-8 h-8 p-0 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110
        ${currentlyPinned 
          ? "bg-primary/90 hover:bg-primary text-primary-foreground border-2 border-background/20"
          : "bg-background/90 hover:bg-primary text-primary hover:text-primary-foreground border-2 border-primary/20"
        }
      `}
      title={currentlyPinned ? "Odepnij post" : "Przypnij post"}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : currentlyPinned ? (
        <PinOff className="h-4 w-4" />
      ) : (
        <Pin className="h-4 w-4" />
      )}
    </Button>
  )
} 