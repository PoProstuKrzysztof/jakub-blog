import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"

interface LoadingPageProps {
  title?: string
  description?: string
}

export function LoadingPage({ 
  title = "Ładowanie...", 
  description = "Proszę czekać, trwa ładowanie treści" 
}: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <LoadingSpinner 
            size="lg" 
            text={title}
            className="mb-6"
          />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center items-center mt-6 space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 