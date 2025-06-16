# Rozwiązania błędów iframe i rozszerzeń przeglądarki

## Przegląd problemów

Aplikacja doświadczała następujących błędów:

1. **Błędy iframe**: "Could not evaluate in iframe, doesnt exist!"
2. **Blokowanie Sentry**: "net::ERR_BLOCKED_BY_CLIENT" dla endpointów Sentry
3. **Konflikty rozszerzeń**: Błędy pochodzące z rozszerzeń przeglądarki (chrome-extension://)
4. **Ostrzeżenia cross-origin**: Żądania z Builder.io do zasobów Next.js

## Implementowane rozwiązania

### 1. Error Boundary Components (`components/error-boundary.tsx`)

- **Cel**: Przechwytuje i obsługuje błędy React na poziomie komponentów
- **Funkcje**:
  - Filtruje błędy rozszerzeń przeglądarki
  - Wyświetla przyjazne dla użytkownika komunikaty błędów
  - Opcja ponownego ładowania komponentów
  - Tryb deweloperski z szczegółowymi informacjami

### 2. Client-Side Error Filter (`components/client-error-filter.tsx`)

- **Cel**: Filtruje błędy po stronie klienta z rozszerzeń i blokerów reklam
- **Funkcje**:
  - Przechwytuje globalne błędy JavaScript
  - Filtruje znane wzorce błędów (chrome-extension, net::ERR_BLOCKED_BY_CLIENT)
  - Obsługuje odrzucone promises
  - Redukuje hałas w konsoli deweloperskiej

### 3. Iframe Error Handler (`lib/utils/iframe-error-handler.ts`)

- **Cel**: Zaawansowana obsługa błędów iframe
- **Funkcje**:
  - Mechanizm retry z wykładniczym wycofywaniem
  - Bezpieczne tworzenie iframe z właściwymi ustawieniami sandbox
  - Filtrowanie błędów z blokerów reklam
  - Globalne handlery błędów

### 4. Next.js Configuration (`next.config.mjs`)

- **Cel**: Konfiguracja na poziomie serwera dla lepszej obsługi błędów
- **Funkcje**:
  - Dozwolone origins dla Builder.io
  - Konfiguracja obrazów z fallbackami
  - Webpack optimizations dla zmniejszenia ostrzeżeń
  - Kompresja i cache headers

### 5. Middleware (`middleware.ts`)

- **Cel**: Obsługa cross-origin requests i nagłówków bezpieczeństwa
- **Funkcje**:
  - CORS headers dla Builder.io
  - Content Security Policy (CSP)
  - Security headers (X-Frame-Options, etc.)
  - Cache control dla różnych typów zasobów

### 6. Content Renderer Improvements (`components/post-content-renderer.tsx`)

- **Cel**: Bezpieczne renderowanie treści z iframe i mediami
- **Funkcje**:
  - Error handling dla iframe YouTube/Vimeo
  - Fallback content dla zablokowanych zasobów
  - Lazy loading z proper error handling
  - Safe image loading z placeholderami

## Jak działają rozwiązania

### Error Filtering Flow

1. **Global Level**: `ClientErrorFilter` przechwytuje błędy na poziomie window
2. **Component Level**: `ErrorBoundary` obsługuje błędy React components
3. **Content Level**: `PostContentRenderer` obsługuje błędy mediów
4. **Network Level**: `IframeErrorHandler` zarządza błędami sieciowymi

### Error Types Handled

```typescript
// Browser Extension Errors
- chrome-extension://
- Could not evaluate in iframe
- Extension context invalidated

// Ad Blocker Errors
- net::ERR_BLOCKED_BY_CLIENT
- uBlock, AdBlock, Privacy Badger
- Blocked resource loading

// Tracking/Analytics Errors
- sentry.io blocked requests
- Google Analytics blocks
- Facebook tracking blocks

// Network/CORS Errors
- Cross-origin resource sharing
- Mixed content warnings
- CSP violations
```

### Performance Impact

- **Minimal**: Błędy są filtrowane, nie blokowane
- **Graceful Degradation**: Aplikacja działa nawet gdy część funkcji jest zablokowana
- **User Experience**: Brak irytujących błędów w konsoli dla użytkowników końcowych

## Monitorowanie i debugging

### Development Mode

```javascript
// W trybie deweloperskim, filtrowane błędy są logowane jako debug
console.debug("Filtered error:", error);
```

### Production Mode

- Błędy są cicho filtrowane
- Krytyczne błędy nadal są raportowane
- Graceful fallbacks dla wszystkich komponentów

## Maintenance

### Dodawanie nowych filtrów błędów

```typescript
// W IframeErrorHandler
iframeErrorHandler.addErrorFilter((error) => {
  return error.message?.includes("new-pattern");
});
```

### Konfiguracja CSP

```typescript
// W middleware.ts - dodawanie nowych domen
"connect-src 'self' https://new-domain.com";
```

## Sprawdzanie skuteczności

1. **Przed**: Liczne błędy w konsoli, przerwania w działaniu iframe
2. **Po**: Czysta konsola, graceful fallbacks, stabilne działanie

### Testowanie

- Włącz uBlock Origin / AdBlock
- Testuj z różnymi rozszerzeniami przeglądarki
- Sprawdź iframe YouTube/Vimeo w różnych warunkach
- Monitoruj Network tab dla zablokowanych żądań

## Najbardziej częste problemy i rozwiązania

| Problem               | Rozwiązanie         | Lokalizacja           |
| --------------------- | ------------------- | --------------------- |
| Iframe nie ładuje się | Fallback content    | `PostContentRenderer` |
| Błędy rozszerzeń      | Global error filter | `ClientErrorFilter`   |
| CORS z Builder.io     | Middleware headers  | `middleware.ts`       |
| Sentry blocking       | Error filtering     | `IframeErrorHandler`  |
| React crashes         | Error boundaries    | `ErrorBoundary`       |

Ta implementacja zapewnia stabilne, przyjazne dla użytkownika doświadczenie nawet w obecności agresywnych blokerów reklam i rozszerzeń przeglądarki.
