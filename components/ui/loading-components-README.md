# Komponenty ładowania

Ten folder zawiera zestaw komponentów do wyświetlania stanów ładowania w aplikacji.

## LoadingSpinner

Podstawowy komponent z animowanym kółkiem ładowania.

### Użycie

```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Podstawowe użycie
<LoadingSpinner />

// Z niestandardowym tekstem i rozmiarem
<LoadingSpinner 
  size="lg" 
  text="Ładowanie danych..." 
  className="my-4"
/>
```

### Props

- `size`: "sm" | "md" | "lg" - rozmiar spinnera (domyślnie "md")
- `text`: string - tekst wyświetlany pod spinnerem (domyślnie "Ładowanie...")
- `className`: string - dodatkowe klasy CSS

## LoadingCard

Komponent karty z spinnerem ładowania, idealny do sekcji treści.

### Użycie

```tsx
import { LoadingCard } from "@/components/ui/loading-card"

// Z kartą
<LoadingCard 
  text="Ładowanie postów..." 
  size="md" 
/>

// Bez karty (tylko spinner)
<LoadingCard 
  text="Filtrowanie..." 
  showCard={false}
/>
```

### Props

- `text`: string - tekst ładowania
- `size`: "sm" | "md" | "lg" - rozmiar spinnera
- `showCard`: boolean - czy pokazać kartę (domyślnie true)
- `className`: string - dodatkowe klasy CSS

## PostSkeleton

Komponent skeleton dla postów bloga.

### Użycie

```tsx
import { PostSkeleton } from "@/components/ui/post-skeleton"

// Wersja karty (dla siatki postów)
<PostSkeleton variant="card" />

// Wersja listy (dla listy postów)
<PostSkeleton variant="list" />

// Wiele skeletonów
{Array.from({ length: 3 }).map((_, i) => (
  <PostSkeleton key={i} variant="list" />
))}
```

### Props

- `variant`: "card" | "list" - typ layoutu (domyślnie "card")
- `className`: string - dodatkowe klasy CSS

## PostsLoading

Kompletny komponent ładowania dla strony głównej bloga.

### Użycie

```tsx
import { PostsLoading } from "@/components/posts-loading"

// W Suspense boundary
<Suspense fallback={<PostsLoading />}>
  <PostsData />
</Suspense>
```

## LoadingPage

Komponent ładowania dla całych stron.

### Użycie

```tsx
import { LoadingPage } from "@/components/ui/loading-page"

// Podstawowe użycie
<LoadingPage />

// Z niestandardowymi tekstami
<LoadingPage 
  title="Ładowanie artykułu..."
  description="Przygotowujemy treść dla Ciebie"
/>
```

### Props

- `title`: string - tytuł ładowania (domyślnie "Ładowanie...")
- `description`: string - opis ładowania

## Przykłady użycia

### W komponencie React

```tsx
function MyComponent() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  if (isLoading) {
    return <LoadingPage title="Ładowanie danych..." />
  }

  return (
    <div>
      {isFiltering ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} variant="list" />
          ))}
        </div>
      ) : (
        <PostsList posts={posts} />
      )}
    </div>
  )
}
```

### W Next.js App Router

```tsx
// app/loading.tsx
import { PostsLoading } from '@/components/posts-loading'

export default function Loading() {
  return <PostsLoading />
}

// app/page.tsx
import { Suspense } from 'react'
import { PostsLoading } from '@/components/posts-loading'

export default function Page() {
  return (
    <Suspense fallback={<PostsLoading />}>
      <AsyncComponent />
    </Suspense>
  )
}
```

## Stylowanie

Wszystkie komponenty używają Tailwind CSS i są zgodne z systemem designu aplikacji. Używają zmiennych CSS dla kolorów, więc automatycznie dostosowują się do trybu ciemnego/jasnego.

## Animacje

- `LoadingSpinner` - animacja obracania (spin)
- `PostSkeleton` - animacja pulse dla elementów skeleton
- `LoadingPage` - animacja bounce dla kropek
- Wszystkie animacje są zoptymalizowane pod kątem wydajności 