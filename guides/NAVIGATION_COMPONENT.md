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
- Menu główne: Home, Wpisy, Współpraca, Kontakt
- Przycisk hamburger menu (mobile)
- **Pozycja**: Zawsze wyśrodkowane, niezależnie od innych elementów

### 3. **Prawa Sekcja** - Przyciski Administratora/Użytkownika
- **Panel Twórcy** (dla zalogowanych użytkowników) - **NOWA FUNKCJONALNOŚĆ**
- Nowy post (dla zalogowanych użytkowników)
- Przyciski edycji (kontekstowe)
- Wyloguj (dla zalogowanych użytkowników)
- Panel administratora/Zaloguj (dla niezalogowanych)
- Przyciski trybu administratora (Podgląd, Udostępnij, Powrót)
- **Pozycja**: Maksymalnie po prawej stronie, bez wpływu na inne elementy

## Kluczowe Korzyści Nowej Struktury

### ✅ **Stała Pozycja Menu Nawigacji**
- Menu nawigacji zawsze w centrum, niezależnie od liczby przycisków po prawej
- Brak przemieszania się elementów podczas przechodzenia między stronami

### ✅ **Izolowane Przyciski Administratora**
- Przyciski po prawej stronie nie wpływają na pozycję menu
- Panel administratora zawsze maksymalnie po prawej

### ✅ **Globalny Dostęp do Panelu Twórcy** - **NOWA FUNKCJONALNOŚĆ**
- Przycisk "Panel Twórcy" dostępny z każdego miejsca w aplikacji po zalogowaniu
- Spójny dostęp zarówno na desktop jak i mobile
- Wyróżniony wizualnie (primary color) dla łatwego rozpoznania

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
- **Globalny dostęp do panelu twórcy dla zalogowanych użytkowników**

## Właściwości (Props)

```typescript
interface SiteHeaderProps {
  currentPage?: 'home' | 'wpisy' | 'cooperation' | 'contact' | 'admin' | 'post'
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

### Strona główna (Home)
```tsx
<SiteHeader 
  currentPage="home"
  user={user}
/>
```
**Dla zalogowanych użytkowników wyświetla**: Panel Twórcy, Nowy post, Wyloguj

### Strona bloga z wyszukiwaniem
```tsx
<SiteHeader 
  currentPage="wpisy"
  showSearch={true}
  searchPlaceholder="Szukaj posty, kategorie..."
  searchValue={searchTerm}
  onSearchChange={handleSearchChange}
/>
```
**Dla zalogowanych użytkowników wyświetla**: Panel Twórcy, Nowy post, Wyloguj

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
**Dla zalogowanych użytkowników wyświetla**: Panel Twórcy, Nowy post, Edytuj usługi, Wyloguj

### Panel administratora - główny
```tsx
<SiteHeader 
  currentPage="admin"
  showSearch={false}
  searchPlaceholder="Szukaj w panelu..."
/>
```

### Panel administratora - nowy post
```tsx
<SiteHeader 
  adminMode={true}
  adminTitle="Nowy Post"
  currentPage="admin"
/>
```

### Panel administratora - z podglądem
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
- **Panel Twórcy na pierwszej pozycji dla zalogowanych użytkowników**

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

### 6. **Globalny Dostęp do Panelu Twórcy** - **NOWA FUNKCJONALNOŚĆ**
- Użytkownik może przejść do panelu twórcy z każdego miejsca w aplikacji
- Spójne doświadczenie zarządzania treścią
- Wyróżniony wizualnie przycisk dla łatwego rozpoznania

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

1. ✅ Strona główna (`components/home-page-client.tsx`)
2. ✅ Blog (`components/blog-page-client.tsx`)
3. ✅ Współpraca (`app/wspolpraca/page.tsx`)
4. ✅ Kontakt (`app/kontakt/page.tsx`)
5. ✅ Panel administratora (`app/admin/page.tsx`)
6. ✅ **Nowy post (`app/admin/nowy-post/page.tsx`)** - **ZAKTUALIZOWANE**
7. ✅ Analityka (`app/admin/analytics/page.tsx`)
8. ✅ Strona posta (`components/post-page-client.tsx`)

## Rozwiązane Problemy

### ❌ **Przed**: Flexbox z justify-between
- Menu przesuwało się w zależności od liczby przycisków
- Brak kontroli nad pozycją elementów
- Nieprzewidywalne zachowanie
- **Brak globalnego dostępu do panelu twórcy**

### ✅ **Po**: CSS Grid z trzema kolumnami + Panel Twórcy
- Stałe pozycje wszystkich elementów
- Menu zawsze wyśrodkowane
- Przyciski zawsze po prawej stronie
- Pełna kontrola nad layoutem
- **Globalny dostęp do panelu twórcy z każdego miejsca w aplikacji**

## Nowe Funkcjonalności - Panel Twórcy

### 🎯 **Globalny Dostęp**
- Przycisk "Panel Twórcy" dostępny na wszystkich stronach dla zalogowanych użytkowników
- Wyróżniony wizualnie (primary color border i text)
- Ikona Settings dla łatwego rozpoznania

### 🎯 **Responsywność**
- Desktop: Przycisk w prawej sekcji headera
- Mobile: Pierwszy przycisk w rozwijanym menu

### 🎯 **Spójność**
- Jednolity wygląd i zachowanie na wszystkich stronach
- Automatyczne wykrywanie stanu zalogowania

### 🎯 **Priorytet**
- Panel Twórcy jako pierwszy przycisk dla zalogowanych użytkowników
- Logiczne uporządkowanie: Panel Twórcy → Nowy post → Inne akcje → Wyloguj

## Przyszłe rozszerzenia

Możliwe ulepszenia:
- Breadcrumbs dla głębszej nawigacji
- Powiadomienia w headerze
- Więcej opcji personalizacji
- Animacje przejść między stronami
- Dodatkowe tryby wyświetlania
- **Floating Action Button dla panelu twórcy na wybranych stronach** 