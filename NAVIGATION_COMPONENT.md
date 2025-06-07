# Zunifikowany Komponent Nawigacji - SiteHeader

## Opis

Komponent `SiteHeader` to zunifikowany pasek nawigacji używany na wszystkich stronach aplikacji. Zapewnia spójne doświadczenie użytkownika z **ustaloną pozycją elementów nawigacji** i **przyciskami administratora maksymalnie po prawej stronie** bez wpływu na inne elementy.

## Lokalizacja

`components/site-header.tsx`

## Nowa Architektura (Grid Layout)

Pasek nawigacji używa **CSS Grid z 3 kolumnami** dla zapewnienia stałych pozycji:

### 1. **Lewa Sekcja** - Logo i Badge
- Logo "JAKUB INWESTYCJE" 
- Badge z tytułem administratora (jeśli w trybie admin)
- **Pozycja**: Zawsze po lewej stronie

### 2. **Środkowa Sekcja** - Menu Nawigacji  
- Menu główne: O autorze, Blog, Współpraca, Kontakt
- Przycisk hamburger menu (mobile)
- **Pozycja**: Zawsze wyśrodkowane, niezależnie od innych elementów

### 3. **Prawa Sekcja** - Przyciski Administratora/Użytkownika
- Panel administratora (dla niezalogowanych)
- Przyciski zalogowanego użytkownika (Nowy post, Wyloguj, etc.)
- Przyciski trybu administratora (Podgląd, Udostępnij, Powrót)
- **Pozycja**: Maksymalnie po prawej stronie, bez wpływu na inne elementy

## Kluczowe Korzyści Nowej Struktury

### ✅ **Stała Pozycja Menu Nawigacji**
- Menu nawigacji zawsze w centrum, niezależnie od liczby przycisków po prawej
- Brak przemieszania się elementów podczas przechodzenia między stronami

### ✅ **Izolowane Przyciski Administratora**
- Przyciski po prawej stronie nie wpływają na pozycję menu
- Panel administratora zawsze maksymalnie po prawej

### ✅ **Responsywność**
- Desktop: Pełny grid layout z trzema sekcjami
- Mobile: Hamburger menu w centrum, przyciski w menu rozwijanym

### ✅ **Przewidywalność**
- Użytkownik zawsze wie gdzie znajdzie konkretne elementy
- Spójne doświadczenie na wszystkich stronach

## Funkcjonalności

### 1. Responsywna nawigacja
- Desktop: Grid layout z trzema sekcjami
- Mobile: Hamburger menu z rozwijaną nawigacją

### 2. Tryby działania
- **Tryb normalny**: Standardowa nawigacja dla użytkowników
- **Tryb administratora**: Specjalne przyciski dla panelu administratora

### 3. Izolowane sekcje
- Każda sekcja jest niezależna i nie wpływa na inne
- Grid CSS zapewnia stałe pozycje

### 4. Integracja z autoryzacją
- Automatyczne wykrywanie stanu zalogowania
- Różne opcje dla zalogowanych i niezalogowanych użytkowników

## Właściwości (Props)

```typescript
interface SiteHeaderProps {
  currentPage?: 'home' | 'blog' | 'cooperation' | 'contact' | 'admin' | 'post'
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  adminMode?: boolean
  adminTitle?: string
  showPreviewToggle?: boolean
  isPreview?: boolean
  onPreviewToggle?: () => void
  showShareButton?: boolean
  onShare?: () => void
  shareButtonCopied?: boolean
  showEditButton?: boolean
  isEditing?: boolean
  onEditToggle?: () => void
  user?: User | null
}
```

## Przykłady użycia

### Strona główna (O autorze)
```tsx
<SiteHeader 
  currentPage="home"
  user={user}
/>
```

### Strona bloga z wyszukiwaniem
```tsx
<SiteHeader 
  currentPage="blog"
  showSearch={true}
  searchPlaceholder="Szukaj posty, kategorie..."
  searchValue={searchTerm}
  onSearchChange={handleSearchChange}
/>
```

### Strona współpracy z edycją
```tsx
<SiteHeader 
  currentPage="cooperation"
  showSearch={true}
  searchPlaceholder="Szukaj usług, informacji..."
  showEditButton={true}
  isEditing={isEditing}
  onEditToggle={() => setIsEditing(!isEditing)}
/>
```

### Panel administratora - nowy post
```tsx
<SiteHeader 
  adminMode={true}
  adminTitle="Panel Twórcy"
  showPreviewToggle={true}
  isPreview={isPreview}
  onPreviewToggle={() => setIsPreview(!isPreview)}
  user={user}
/>
```

### Strona posta z udostępnianiem
```tsx
<SiteHeader 
  currentPage="post"
  adminMode={true}
  showShareButton={true}
  onShare={sharePost}
  shareButtonCopied={copied}
  user={user}
/>
```

## Struktura komponentu

### 1. Header główny (Grid Layout)
```tsx
<div className="grid grid-cols-3 items-center min-h-[48px]">
  {/* Lewa sekcja - Logo */}
  <div className="flex items-center space-x-4">
    {/* Logo i badge */}
  </div>
  
  {/* Środkowa sekcja - Menu nawigacji */}
  <div className="flex justify-center">
    {/* Menu lub hamburger */}
  </div>
  
  {/* Prawa sekcja - Przyciski */}
  <div className="flex justify-end">
    {/* Przyciski administratora/użytkownika */}
  </div>
</div>
```

### 2. Menu mobilne
- Rozwijane menu nawigacyjne
- Przyciski akcji dla mobile

### 3. Sekcja wyszukiwania
- Opcjonalna sekcja z polem wyszukiwania
- Wyświetlana gdy `showSearch={true}`

### 4. Floating Action Button
- Automatycznie wyświetlany na stronach współpracy i kontaktu
- Przycisk kontaktu w prawym dolnym rogu

## Korzyści Nowej Struktury

### 1. **Eliminacja Przemieszania**
- Grid CSS zapewnia stałe pozycje wszystkich elementów
- Menu nawigacji zawsze w centrum, niezależnie od przycisków

### 2. **Maksymalna Kontrola Pozycji**
- Przyciski administratora zawsze maksymalnie po prawej
- Brak wpływu na inne elementy interfejsu

### 3. **Spójność UI/UX**
- Jednolity wygląd na wszystkich stronach
- Przewidywalne zachowanie elementów

### 4. **Responsywność**
- Automatyczne dostosowanie do różnych rozmiarów ekranu
- Optymalizacja dla urządzeń mobilnych

### 5. **Łatwość utrzymania**
- Centralne zarządzanie nawigacją
- Łatwe dodawanie nowych funkcjonalności

## Integracja z AuthProvider

Komponent automatycznie korzysta z kontekstu autoryzacji:

```tsx
const { user: authUser, signOut } = useAuth()
const user = propUser || authUser
```

## Stylowanie

Komponent używa:
- **CSS Grid** dla głównego layoutu
- Tailwind CSS dla stylowania
- Shadcn/ui komponenty
- Lucide React ikony
- Responsywne klasy CSS

## Migracja ze starych komponentów

Wszystkie strony zostały zaktualizowane do używania `SiteHeader`:

1. ✅ Strona główna (`app/page.tsx`)
2. ✅ Blog (`app/blog/page.tsx` → `components/home-page-client.tsx`)
3. ✅ Współpraca (`app/wspolpraca/page.tsx`)
4. ✅ Kontakt (`app/kontakt/page.tsx`)
5. ✅ Nowy post (`app/admin/nowy-post/page.tsx`)
6. ✅ Analityka (`app/admin/analytics/page.tsx`)
7. ✅ Strona posta (`components/post-page-client.tsx`)

## Rozwiązane Problemy

### ❌ **Przed**: Flexbox z justify-between
- Menu przesuwało się w zależności od liczby przycisków
- Brak kontroli nad pozycją elementów
- Nieprzewidywalne zachowanie

### ✅ **Po**: CSS Grid z trzema kolumnami
- Stałe pozycje wszystkich elementów
- Menu zawsze wyśrodkowane
- Przyciski zawsze po prawej stronie
- Pełna kontrola nad layoutem

## Przyszłe rozszerzenia

Możliwe ulepszenia:
- Breadcrumbs dla głębszej nawigacji
- Powiadomienia w headerze
- Więcej opcji personalizacji
- Animacje przejść między stronami
- Dodatkowe tryby wyświetlania 