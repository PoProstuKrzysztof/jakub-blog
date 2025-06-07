import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingCardProps {
  className?: string
  text?: string
  size?: "sm" | "md" | "lg"
  showCard?: boolean
}

export function LoadingCard({ 
  className, 
  text = "Ładowanie...", 
  size = "md",
  showCard = true 
}: LoadingCardProps) {
  const content = (
    <LoadingSpinner 
      size={size} 
      text={text} 
      className="py-8"
    />
  )

  if (!showCard) {
    return <div className={cn("flex justify-center items-center", className)}>{content}</div>
  }

  return (
    <div className={cn("flex justify-center items-center py-8", className)}>
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          {content}
        </CardContent>
      </Card>
    </div>
  )
}

export function LoadingCardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-card shadow-sm py-4 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <div className="hidden md:flex space-x-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
            <div className="relative">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-8 w-48" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 