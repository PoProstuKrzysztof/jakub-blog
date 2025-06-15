# 🔧 Rozwiązanie błędu ChunkLoadError w Next.js 15

## 📋 Opis problemu

Błąd `ChunkLoadError` w Next.js 15 z React Server Components występuje podczas ładowania modułów JavaScript, szczególnie przy dynamicznym imporcie komponentów Client Components z dużymi zależnościami (np. TipTap, Chart.js).

### Typowy błąd:
```
ChunkLoadError
    at __webpack_require__.f.j (webpack.js:858:29)
    at loadChunk (react-server-dom-webpack-client.browser.development.js:126:34)
    at RootLayout (rsc://React/Server/webpack-internal:///(rsc)/./app/layout.tsx)
```

## 🔍 Przyczyny błędu

1. **Konflikt Server vs Client Components** - Próba użycia Client Components w kontekście Server Components
2. **Duże biblioteki** - TipTap, Chart.js, Radix UI z dużą liczbą zależności
3. **Nieprawidłowy webpack chunking** - Problemy z podziałem kodu na chunki
4. **React 19 + Next.js 15** - Kompatybilność między najnowszymi wersjami

## ✅ Zastosowane rozwiązania

### 1. **Dynamiczny import z wyłączonym SSR**

Utworzono wrapper komponenty dla TipTap Editor:

```tsx
// components/editor/rich-text-editor-dynamic.tsx
const RichTextEditorCore = dynamic(() => 
  import('./rich-text-editor').then(mod => ({ default: mod.RichTextEditor })), 
  {
    ssr: false,
    loading: () => <EditorSkeleton />
  }
)

export function RichTextEditorDynamic(props: RichTextEditorProps) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <RichTextEditorCore {...props} />
    </Suspense>
  )
}
```

### 2. **Ulepszona konfiguracja webpack**

Dodano optymalizację chunków w `next.config.mjs`:

```javascript
webpack: (config, { isServer, dev }) => {
  if (!isServer && !dev) {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    }
  }
  
  config.resolve = {
    ...config.resolve,
    fallback: {
      fs: false,
      net: false,
      tls: false,
    },
  }
  
  return config
}
```

### 3. **Suspense boundaries dla AuthProvider**

Opakowano AuthProvider w Suspense:

```tsx
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </Suspense>
  )
}
```

### 4. **Error Boundaries**

Dodano `app/error.tsx` dla lepszego zarządzania błędami:

```tsx
'use client'

export default function Error({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Error handling logic
}
```

### 5. **Dynamiczne komponenty Chart**

Utworzono wrapper dla Chart.js:

```tsx
// components/editor/chart-component-dynamic.tsx
const ChartComponentCore = dynamic(() => 
  import('./chart-component').then(mod => ({ default: mod.ChartComponent })), 
  {
    ssr: false,
    loading: () => <ChartSkeleton />
  }
)
```

## 🔧 Kroki debugowania

### 1. Sprawdź konsolę przeglądarki
```bash
# Otwórz DevTools > Console
# Szukaj błędów:
- ChunkLoadError
- Failed to fetch dynamically imported module
- Loading chunk [number] failed
```

### 2. Wyczyść cache
```bash
# Usuń cache Next.js
rm -rf .next

# Usuń cache node_modules
rm -rf node_modules/.cache

# Restart serwera
pnpm dev
```

### 3. Sprawdź Network tab
- Czy wszystkie chunki się ładują?
- Czy są błędy 404 dla plików JS?
- Czy CORS jest prawidłowo skonfigurowany?

## 🚨 Najlepsze praktyki zapobiegania

### 1. **Używaj dynamic() dla dużych komponentów**
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false,
  loading: () => <Skeleton />
})
```

### 2. **Suspense boundaries**
```tsx
<Suspense fallback={<Loading />}>
  <ClientComponent />
</Suspense>
```

### 3. **Poprawne oznaczenie Client Components**
```tsx
'use client' // Na początku pliku

import { useState } from 'react'
// Component code...
```

### 4. **Rozdziel Server i Client logic**
- Server Components: data fetching, static content
- Client Components: interakcje, state, browser APIs

## 📊 Monitorowanie

### Webpack Bundle Analyzer
```bash
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer .next/static/chunks
```

### Next.js Bundle Analyzer
```bash
npm install @next/bundle-analyzer
```

## 🔄 Jeśli problem persystuje

1. **Sprawdź wersje zależności**
   ```bash
   npm audit
   npm outdated
   ```

2. **Spróbuj disablować Turbopack**
   ```bash
   # Zamiast
   npm run dev --turbo
   
   # Użyj
   npm run dev
   ```

3. **Zaktualizuj zależności**
   ```bash
   npm update @next/bundle-analyzer
   npm update @radix-ui/react-*
   npm update @tiptap/*
   ```

4. **Sprawdź kompatybilność**
   - Next.js 15 + React 19
   - TipTap + React 19
   - Radix UI + React 19

## 📈 Śledzenie performansi

Po zastosowaniu poprawek, sprawdź:

- ✅ Brak błędów ChunkLoadError w konsoli
- ✅ Szybsze ładowanie edytora (< 2s)
- ✅ Płynne przejścia między stronami
- ✅ Poprawne ładowanie komponentów w background

---

**Status**: ✅ **ROZWIĄZANE**  
**Data**: 2024-01-XX  
**Wersja**: Next.js 15.2.4, React 19 