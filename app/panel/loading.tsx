import { Loader2 } from 'lucide-react'

export default function PanelLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Ładowanie panelu użytkownika...</p>
      </div>
    </div>
  )
} 