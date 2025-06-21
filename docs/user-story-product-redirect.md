# User Story: Przekierowanie do produktów w panelu użytkownika

## Opis funkcjonalności

Gdy zalogowany użytkownik kliknie na ofertę na stronie `/wspolpraca`, zostanie przekierowany bezpośrednio do odpowiedniego produktu w swoim panelu użytkownika z automatycznym podświetleniem wybranego produktu.

## Implementacja

### 1. Strona współpracy (`/wspolpraca`)

**Plik:** `app/wspolpraca/page.tsx`

**Zmiany:**
- Zaktualizowano funkcję `handleOfferClick()` aby przekierowywała do panelu z parametrami URL
- Dodano walidację ID produktu przy pomocy `isValidCooperationProductId()`
- URL przekierowania: `{panelPath}?tab=available&product={offer.id}`

```typescript
const handleOfferClick = (offer: Service) => {
  if (user) {
    // Sprawdź czy produkt jest poprawny
    if (!isValidCooperationProductId(offer.id)) {
      console.error(`Invalid product ID: ${offer.id}`)
      router.push(getUserPanelPath(role))
      return
    }
    
    // Przekieruj do panelu z parametrem produktu
    const panelPath = getUserPanelPath(role)
    router.push(`${panelPath}?tab=available&product=${offer.id}`)
  } else {
    router.push('/login?from=offer')
  }
}
```

### 2. Panel użytkownika (`/panel`)

**Plik:** `app/panel/page.tsx`

**Zmiany:**
- Dodano obsługę parametrów URL (`tab` i `product`)
- Automatyczne przełączanie na zakładkę "Produkty" gdy przekazano ID produktu
- Podświetlanie wybranego produktu z efektami wizualnymi
- Automatyczne przewijanie do podświetlonego produktu
- Banner informacyjny o wybranym produkcie

**Nowe funkcjonalności:**
- `useSearchParams()` do odczytu parametrów URL
- State `highlightedProduct` do zarządzania podświetleniem
- Funkcja `handleDismissHighlight()` do ukrywania podświetlenia
- Walidacja ID produktu z automatycznym czyszczeniem niepoprawnych parametrów

### 3. Mapowanie produktów

**Plik:** `lib/utils/product-mapping.ts`

**Nowy plik pomocniczy zawierający:**
- Mapowanie ID produktów między stronami
- Funkcje walidacji ID produktów
- Funkcje pobierania informacji o produktach
- Typy TypeScript dla bezpieczeństwa typów

```typescript
export const PRODUCT_MAPPING = {
  CONSULTATION: {
    id: 2,
    title: "Konsultacja Majątkowa-Edukacyjna",
    slug: "consultation",
    cooperationPageId: 2
  },
  // ... inne produkty
}
```

### 4. Komponent banner

**Plik:** `components/panel/highlighted-product-banner.tsx`

**Nowy komponent wyświetlający:**
- Informację o wybranym produkcie
- Przycisk do ukrycia bannera
- Stylizację zgodną z design system

## Przepływ użytkownika

1. **Użytkownik na stronie `/wspolpraca`:**
   - Przegląda dostępne oferty
   - Klika na wybraną ofertę

2. **Przekierowanie:**
   - System sprawdza czy użytkownik jest zalogowany
   - Waliduje ID produktu
   - Przekierowuje do panelu z parametrami URL

3. **Panel użytkownika:**
   - Automatycznie otwiera zakładkę "Produkty"
   - Wyświetla banner informacyjny
   - Podświetla wybrany produkt
   - Przewija stronę do produktu

4. **Interakcja w panelu:**
   - Użytkownik może ukryć banner
   - Może kontynuować przeglądanie produktów
   - Może przejść do zakupu

## Parametry URL

### `/panel?tab=available&product={id}`

- `tab`: określa aktywną zakładkę (`products`, `available`, `orders`)
- `product`: ID produktu do podświetlenia (odpowiada `cooperationPageId` z mapowania)

## Obsługa błędów

1. **Niepoprawne ID produktu:**
   - Logowanie ostrzeżenia w konsoli
   - Automatyczne usunięcie parametru z URL
   - Przekierowanie do głównej zakładki panelu

2. **Brak uwierzytelnienia:**
   - Przekierowanie do strony logowania z parametrem `?from=offer`

3. **Brak dostępu do panelu:**
   - Fallback do domyślnej ścieżki panelu

## Efekty wizualne

### Podświetlony produkt:
- Ramka w kolorze primary
- Tło z przezroczystością primary/5
- Badge "Wybrane" przy tytule
- Zwiększony cień (shadow-lg)

### Banner informacyjny:
- Ikona gwiazdki
- Tytuł wybranego produktu
- Przycisk zamknięcia
- Stylizacja primary

## Testowanie

### Scenariusze testowe:

1. **Pozytywny przepływ:**
   - Zalogowany użytkownik klika ofertę → przekierowanie do panelu z podświetleniem

2. **Niezalogowany użytkownik:**
   - Klik na ofertę → przekierowanie do logowania

3. **Niepoprawne ID produktu:**
   - URL z błędnym ID → automatyczne czyszczenie parametru

4. **Bezpośredni dostęp z URL:**
   - Wejście na `/panel?product=2` → podświetlenie produktu

## Kompatybilność

- ✅ Next.js 15.2.4
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Shadcn UI

## Wydajność

- Minimalne opóźnienie przez `setTimeout(300ms)` dla przewijania
- Walidacja ID produktów odbywa się lokalnie
- Brak dodatkowych zapytań do API
- Lazy loading komponentów gdzie to możliwe 