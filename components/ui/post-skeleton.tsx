import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PostSkeletonProps {
  className?: string
  variant?: "card" | "list"
}

export function PostSkeleton({ className, variant = "card" }: PostSkeletonProps) {
  if (variant === "list") {
    return (
      <Card className={cn("rounded-2xl shadow-xl border border-border overflow-hidden my-4 mx-2", className)}>
        <div className="flex">
          {/* Post Image Skeleton */}
          <div className="w-80 flex-shrink-0">
            <Skeleton className="h-48 w-full rounded-none" />
          </div>

          {/* Post Content Skeleton */}
          <CardContent className="flex-1 p-6">
            <Skeleton className="h-4 w-20 rounded mb-3" />
            <Skeleton className="h-6 w-full rounded mb-3" />
            <Skeleton className="h-6 w-3/4 rounded mb-4" />
            
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            
            <Skeleton className="h-4 w-full rounded mb-2" />
            <Skeleton className="h-4 w-full rounded mb-2" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("rounded-2xl shadow-lg border border-border overflow-hidden", className)}>
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-6">
        <Skeleton className="h-4 w-20 rounded mb-3" />
        <Skeleton className="h-6 w-full rounded mb-3" />
        <Skeleton className="h-4 w-3/4 rounded mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      </CardContent>
    </Card>
  )
} 