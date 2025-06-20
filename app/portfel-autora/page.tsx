import { getActivePortfolio, listAnalyses } from '@/lib/actions/portfolio-actions'
import { PortfolioChart } from '@/components/portfolio/portfolio-chart'
import { AnalysesFeed } from '@/components/portfolio/analyses-feed'
import { PurchaseAccess } from '@/components/portfolio/purchase-access'
import { SiteHeader } from '@/components/common/site-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowLeft, 
  TrendingUp, 
  PieChart, 
  FileText, 
  Sparkles,
  Calendar,
  Activity,
  Target,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export default async function AuthorPortfolioPage() {
  const portfolio = await getActivePortfolio()
  const analysesResult = await listAnalyses(1, 20)
  
  // Zabezpieczenie na wypadek gdyby listAnalyses nie zwróciło tablicy
  const analyses = Array.isArray(analysesResult) ? analysesResult : []

  // Jeśli nie ma portfela, pokaż stronę zakupu dostępu
  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-light-gray-100 to-background">
        <SiteHeader currentPage="panel" />
        <PurchaseAccess />
      </div>
    )
  }

  const portfolioData = portfolio.jsonData
  const totalPositions = portfolioData ? Object.keys(portfolioData).length : 0
  const analysesCount = analyses.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-light-gray-100 to-background">
      <SiteHeader currentPage="panel" />
      
      <div className="container mx-auto max-w-6xl p-4 sm:p-6 space-y-8">
        {/* Header with navigation and stats */}
        <div className="space-y-6 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button variant="outline" size="sm" asChild className="shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/panel" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Powrót do panelu
              </Link>
            </Button>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-primary">{totalPositions}</div>
                <div className="text-muted-foreground">Pozycji</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <div className="font-bold text-lg text-success-green-600">{analysesCount}</div>
                <div className="text-muted-foreground">Analiz</div>
              </div>
            </div>
          </div>

          {/* Main header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-start justify-between flex-col sm:flex-row gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Portfel autora
                      </h1>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Przejrzysty wgląd w moje inwestycje i strategie
                      </p>
                    </div>
                  </div>
                  
                  {portfolio.description && (
                    <div className="bg-muted/50 rounded-2xl p-4 max-w-2xl">
                      <p className="text-muted-foreground leading-relaxed">{portfolio.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-success-green-100 text-success-green-800 border-success-green-200 shadow-sm">
                    <Activity className="h-3 w-3 mr-1.5" />
                    Aktywny
                  </Badge>
                  <Badge variant="secondary" className="shadow-sm">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    Dziś
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Chart Section */}
        <div className="animate-in slide-in-from-left-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-xl">Skład portfela</span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Aktualna alokacja aktywów w portfelu
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chart container with better styling */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl"></div>
                <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
                  <PortfolioChart data={portfolio.jsonData} className="min-h-[300px]" />
                </div>
              </div>
              
              {/* Portfolio summary */}
              {portfolioData && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(portfolioData).map(([asset, weight], index) => (
                    <div 
                      key={asset} 
                      className="bg-gradient-to-br from-card via-card to-card/80 rounded-xl p-4 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slide-in-from-bottom 0.5s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="font-medium text-sm">{asset}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {(weight * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analyses Section */}
        <div className="animate-in slide-in-from-right-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success-green-100 rounded-xl">
                    <FileText className="h-6 w-6 text-success-green-600" />
                  </div>
                  <div>
                    <span className="text-xl">Analizy rynkowe</span>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      Regularne analizy i komentarze do rynku
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="shadow-sm">
                    <BarChart3 className="h-3 w-3 mr-1.5" />
                    {analysesCount} analiz
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-success-green-500/5 via-transparent to-transparent rounded-2xl"></div>
                <div className="relative bg-background/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
                  <AnalysesFeed initialAnalyses={analyses} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Strategy Section */}
        <div className="animate-in slide-in-from-bottom-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-xl">Strategia inwestycyjna</span>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Kluczowe założenia i cele portfela
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-success-green-100 rounded-lg mt-1">
                      <Sparkles className="h-4 w-4 text-success-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">Długoterminowy wzrost</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Portfel skupia się na stabilnym wzroście wartości w długim okresie z uwzględnieniem dywersyfikacji ryzyka.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">Aktywne zarządzanie</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Regularne monitorowanie i dostosowywanie alokacji na podstawie analiz rynkowych i fundamentalnych.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 border border-border/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Kluczowe metryki</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pozycje w portfelu</span>
                      <span className="font-medium">{totalPositions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Częstotliwość analiz</span>
                      <span className="font-medium">Tygodniowo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Horyzont inwestycyjny</span>
                      <span className="font-medium">Długoterminowy</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 