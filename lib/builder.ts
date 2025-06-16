// Konfiguracja Builder.io dla Next.js App Router
// W najnowszej wersji SDK nie ma eksportów 'builder' i 'Builder'
// Inicjalizacja odbywa się poprzez zmienne środowiskowe

// Rejestracja komponentów RSC
import { CatFactsInfo } from '@/components/builder/cat-facts'
import { register } from '@builder.io/sdk-react-nextjs'

// Rejestracja komponentu RSC
register('CatFacts', CatFactsInfo)

// Eksportujemy klucz API dla komponentów
export const builderApiKey = process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY as string 