// Konfiguracja Builder.io dla Next.js App Router
// W najnowszej wersji SDK nie ma eksportów 'builder' i 'Builder'
// Inicjalizacja odbywa się poprzez zmienne środowiskowe

// Rejestracja komponentów RSC
import { CatFactsInfo } from '@/components/builder/cat-facts'
import { 
  HeroSectionInfo, 
  FeaturesSectionInfo, 
  ServicesSectionInfo, 
  TestimonialsSectionInfo, 
  CTASectionInfo 
} from '@/components/builder/home-page-sections'
import { HomePageBuilderInfo } from '@/components/home-page/home-page-builder'
import { register } from '@builder.io/sdk-react-nextjs'

// Rejestracja komponentów RSC
register('CatFacts', CatFactsInfo)

// Rejestracja sekcji strony głównej
register('HeroSection', HeroSectionInfo)
register('FeaturesSection', FeaturesSectionInfo)
register('ServicesSection', ServicesSectionInfo)
register('TestimonialsSection', TestimonialsSectionInfo)
register('CTASection', CTASectionInfo)

// Rejestracja całej strony głównej
register('HomePageBuilder', HomePageBuilderInfo)

// Walidacja i eksport klucza API
const builderPublicKey = process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY

if (!builderPublicKey) {
  throw new Error(
    'NEXT_PUBLIC_BUILDER_PUBLIC_KEY environment variable is required for Builder.io functionality'
  )
}

export const builderApiKey = builderPublicKey 