import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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