import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { PostSkeleton } from "@/components/ui/post-skeleton"

export function PostsLoading() {
  return (
    <div className="min-h-screen bg-background antialiased">
      {/* Header Skeleton */}
      <header className="bg-card shadow-sm py-3 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm"></div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-8 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </header>

      {/* Logo Section */}
      <div className="bg-card py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">JAKUB INWESTYCJE</h1>
          <p className="text-muted-foreground text-lg">FINANSE BARDZO OSOBISTE</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-14">
            <div className="flex space-x-2">
              <div className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium">
                BLOG
              </div>
              <div className="text-foreground font-medium px-6 py-2 rounded-lg">
                WSPÓŁPRACA
              </div>
              <div className="text-foreground font-medium px-6 py-2 rounded-lg">
                KONTAKT
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Loading Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 rounded mb-6" />
          
          {/* Central Loading Spinner */}
          <div className="flex justify-center items-center py-16">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <LoadingSpinner 
                  size="lg" 
                  text="Ładowanie najnowszych postów..." 
                  className="py-4"
                />
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Przygotowujemy dla Ciebie najlepsze treści
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Loading Skeleton for Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} variant="card" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 