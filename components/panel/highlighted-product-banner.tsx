import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Star } from "lucide-react"

interface HighlightedProductBannerProps {
  productTitle: string
  onDismiss: () => void
}

export function HighlightedProductBanner({ 
  productTitle, 
  onDismiss 
}: HighlightedProductBannerProps) {
  return (
    <Card className="border-primary bg-primary/5 mb-6">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Produkt wybrany ze strony współpracy
            </h3>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{productTitle}</span> został podświetlony poniżej
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
} 