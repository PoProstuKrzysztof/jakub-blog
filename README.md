# JAKUB INWESTYCJE - Blog Finansowy

## 📋 Opis Projektu

**JAKUB INWESTYCJE** to nowoczesny blog finansowy o tematyce inwestycyjnej, stworzony w technologii Next.js 15 z TypeScript. Aplikacja oferuje profesjonalną platformę do publikowania analiz finansowych, poradników inwestycyjnych oraz aktualności z rynków kapitałowych.

### 🎯 Główne Cele Aplikacji

1. **Edukacja Finansowa** - Dostarczanie wysokiej jakości treści edukacyjnych z zakresu inwestowania
2. **Analiza Rynkowa** - Publikowanie szczegółowych analiz spółek, sektorów i trendów rynkowych
3. **Społeczność Inwestorów** - Budowanie platformy wymiany wiedzy między inwestorami
4. **Profesjonalne Zarządzanie Treścią** - Zaawansowany panel administratora z edytorem WYSIWYG

### ✨ Kluczowe Funkcjonalności

- 📝 **Zaawansowany edytor tekstów** podobny do Microsoft Word z obsługą:
  - 🎨 Formatowanie tekstu (pogrubienie, kursywa, podkreślenie, indeksy)
  - 📊 **Wykresy interaktywne** (słupkowe, liniowe, kołowe) z Chart.js
  - 🎥 **Filmy YouTube** - bezpośrednie osadzanie
  - 🖼️ **Obrazy** z upload plików i URL
  - 📋 **Tabele** z edycją komórek
  - ✅ **Listy zadań** z interaktywnymi checkboxami
  - 🔗 **Linki** i cytaty
  - ↩️ **Cofnij/Ponów** z pełną historią zmian
- 🔐 **System uwierzytelniania** z Supabase Auth (email/hasło, OAuth)
- 🛡️ **Ochrona tras** z middleware Next.js
- 🔍 **System wyszukiwania i filtrowania** postów
- 📊 **Panel analityczny** z metrykami odwiedzin
- 📱 **Responsywny design** dostosowany do wszystkich urządzeń
- 🎨 **Nowoczesny interfejs** oparty na Tailwind CSS i Radix UI
- 📎 **System załączników** (PDF, Excel, obrazy)
- 🏷️ **Kategoryzacja treści** (Analiza spółek, Kryptowaluty, Edukacja)
- 📌 **System przypinania** ważnych postów

## 🛠️ Stack Technologiczny

### Frontend
- **Next.js 15** - Framework React z App Router
- **React 19** - Biblioteka do budowy interfejsów użytkownika
- **TypeScript** - Typowany JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Komponenty UI dostępne i konfigurowalne

### Backend i Baza Danych
- **Supabase** - Backend-as-a-Service z PostgreSQL
- **Supabase Auth** - System uwierzytelniania z obsługą OAuth
- **Supabase Client** - Klient do komunikacji z bazą danych
- **Row Level Security** - Bezpieczeństwo na poziomie wierszy
- **Real-time subscriptions** - Aktualizacje w czasie rzeczywistym

### Edytor i Formularze
- **TipTap** - Zaawansowany edytor WYSIWYG
- **React Hook Form** - Zarządzanie formularzami
- **Zod** - Walidacja schematów

### UI/UX
- **Lucide React** - Ikony
- **Next Themes** - Zarządzanie motywami
- **Sonner** - Powiadomienia toast
- **Recharts** - Wykresy i analityka

## 📁 Struktura Projektu

### `/app` - Routing i Strony Aplikacji
Folder zawierający wszystkie strony aplikacji zgodnie z App Router Next.js 15:

- **`page.tsx`** - Strona główna z listą postów, wyszukiwarką i filtrami
- **`layout.tsx`** - Główny layout aplikacji z nawigacją
- **`globals.css`** - Globalne style CSS i zmienne Tailwind
- **`loading.tsx`** - Komponent ładowania

#### `/app/admin` - Panel Administratora
Sekcja zarządzania treścią dostępna dla administratorów:

- **`page.tsx`** - Dashboard administratora z metrykami i zarządzaniem postami
- **`loading.tsx`** - Komponent ładowania dla panelu admin

##### `/app/admin/login` - Logowanie
- Strona logowania do panelu administratora z integracją Supabase Auth
- Obsługa uwierzytelniania email/hasło
- Automatyczne przekierowanie po zalogowaniu
- Walidacja formularza i obsługa błędów

##### `/app/admin/nowy-post` - Tworzenie Postów
- Zaawansowany edytor do tworzenia nowych postów z integracją uwierzytelniania
- Obsługa załączników, SEO, kategorii
- Automatyczne przypisywanie autora na podstawie sesji użytkownika
- Ochrona przed nieautoryzowanym dostępem

##### `/app/admin/analytics` - Analityka
- Dashboard z metrykami odwiedzin
- Wykresy i statystyki

#### `/app/post/[id]` - Strony Postów
- Dynamiczne routing dla pojedynczych postów
- Wyświetlanie pełnej treści, załączników i komentarzy

#### `/app/auth/callback` - OAuth Callback
- Obsługa callback'ów OAuth z Supabase
- Automatyczne przekierowanie po uwierzytelnieniu
- Obsługa błędów uwierzytelniania

#### `/app/o-autorze` - Strona O Autorze
- Nowoczesny landing page prezentujący autora bloga
- Możliwość edycji treści przez zalogowanych administratorów
- Responsywny design z smooth scrolling między sekcjami
- Sekcje: Hero, Doświadczenie, Wykształcenie, Filozofia, Osiągnięcia, Kontakt

#### `/app/kontakt` - Strona Kontaktowa
- Formularz kontaktowy
- Informacje o autorze

#### `/app/wspolpraca` - Współpraca
- Informacje o możliwościach współpracy
- Formularz dla potencjalnych partnerów

### `/components` - Komponenty React

#### `/components/ui` - Komponenty UI
Biblioteka komponentów UI opartych na Radix UI i Tailwind CSS:

**Podstawowe Komponenty:**
- `button.tsx` - Przyciski w różnych wariantach
- `input.tsx` - Pola tekstowe
- `textarea.tsx` - Obszary tekstowe
- `label.tsx` - Etykiety formularzy
- `badge.tsx` - Znaczniki i tagi
- `card.tsx` - Karty zawartości

**Nawigacja i Layout:**
- `navigation-menu.tsx` - Menu nawigacyjne
- `breadcrumb.tsx` - Ścieżka nawigacji
- `sidebar.tsx` - Panel boczny
- `separator.tsx` - Separatory

**Formularze i Interakcja:**
- `form.tsx` - Komponenty formularzy
- `select.tsx` - Listy rozwijane
- `checkbox.tsx` - Pola wyboru
- `radio-group.tsx` - Grupy przycisków radio
- `switch.tsx` - Przełączniki
- `slider.tsx` - Suwaki

**Modalne i Overlays:**
- `dialog.tsx` - Okna dialogowe
- `alert-dialog.tsx` - Dialogi alertów
- `popover.tsx` - Popovery
- `tooltip.tsx` - Podpowiedzi
- `sheet.tsx` - Panele boczne
- `drawer.tsx` - Szuflady

**Wyświetlanie Danych:**
- `table.tsx` - Tabele
- `chart.tsx` - Wykresy
- `progress.tsx` - Paski postępu
- `skeleton.tsx` - Szkielety ładowania
- `avatar.tsx` - Awatary użytkowników

**Nawigacja i Paginacja:**
- `pagination.tsx` - Paginacja
- `tabs.tsx` - Zakładki
- `accordion.tsx` - Akordeony
- `collapsible.tsx` - Składane sekcje

**Multimedia i Interakcja:**
- `carousel.tsx` - Karuzele
- `aspect-ratio.tsx` - Proporcje obrazów
- `scroll-area.tsx` - Obszary przewijania
- `resizable.tsx` - Panele o zmiennym rozmiarze

**Menu Kontekstowe:**
- `context-menu.tsx` - Menu kontekstowe
- `dropdown-menu.tsx` - Menu rozwijane
- `menubar.tsx` - Pasek menu
- `command.tsx` - Paleta komend

**Powiadomienia:**
- `toast.tsx` - Komponenty toast
- `toaster.tsx` - Kontener toastów
- `sonner.tsx` - Integracja z Sonner
- `alert.tsx` - Alerty

**Specjalne:**
- `calendar.tsx` - Kalendarz
- `input-otp.tsx` - Pola OTP
- `hover-card.tsx` - Karty hover
- `toggle.tsx` - Przełączniki toggle
- `toggle-group.tsx` - Grupy przełączników

**Hooks i Utilities:**
- `use-toast.ts` - Hook do zarządzania toastami
- `use-mobile.tsx` - Hook do wykrywania urządzeń mobilnych

#### `/components/editor` - Komponenty Edytora
Zaawansowane komponenty do tworzenia i edycji treści:

- **`rich-text-editor.tsx`** - Główny komponent edytora WYSIWYG oparty na TipTap
  - Obsługa formatowania tekstu (pogrubienie, kursywa, podkreślenie)
  - Wstawianie linków i obrazów
  - Licznik znaków
  - Wyrównanie tekstu

- **`toolbar.tsx`** - Pasek narzędzi edytora
  - Przyciski formatowania
  - Opcje wstawiania mediów
  - Narzędzia do stylizacji tekstu

- **`media-upload.tsx`** - Komponent do przesyłania mediów
  - Upload obrazów
  - Zarządzanie załącznikami
  - Podgląd przesłanych plików

- **`seo-settings.tsx`** - Ustawienia SEO dla postów
  - Meta tytuł i opis
  - Słowa kluczowe
  - Ustawienia społecznościowe (Open Graph)

#### `/components/auth-provider.tsx`
- Provider do zarządzania uwierzytelnianiem z Supabase
- Dostarcza kontekst uwierzytelnienia dla całej aplikacji
- Integracja z `useAuth` hook

#### `/components/theme-provider.tsx`
- Provider do zarządzania motywami (jasny/ciemny)

### `/hooks` - Custom Hooks
Folder zawierający niestandardowe hooki React:

- **`use-auth.ts`** - Hook do zarządzania uwierzytelnianiem z Supabase
  - Zarządzanie sesją użytkownika
  - Metody logowania i rejestracji
  - Obsługa OAuth (Google, GitHub)
  - Context API dla stanu uwierzytelnienia
- **`use-mobile.tsx`** - Hook do wykrywania urządzeń mobilnych
- **`use-toast.ts`** - Hook do zarządzania powiadomieniami toast

### `/lib` - Biblioteki i Utilities
Folder zawierający konfigurację bazy danych, modele i serwisy:

#### Konfiguracja Supabase
- **`supabase.ts`** - Klient Supabase dla środowiska przeglądarki
- **`supabase-server.ts`** - Klient Supabase dla środowiska serwera
- **`database.types.ts`** - Automatycznie generowane typy TypeScript z schematu bazy

#### `/lib/models` - Modele Danych
- **`post.ts`** - Modele i typy dla postów bloga
- **`category.ts`** - Modele kategorii
- **`tag.ts`** - Modele tagów

#### `/lib/services` - Serwisy Biznesowe
- **`post-service.ts`** - Serwis do zarządzania postami (CRUD)
- **`README.md`** - Dokumentacja serwisów

### `/public` - Zasoby Statyczne

#### `/public/images`
- Obrazy, ikony i inne zasoby graficzne
- Zdjęcia do postów
- Logo i elementy brandingowe

### `/styles` - Style CSS
Dodatkowe pliki stylów (obecnie główne style w `globals.css`)

## 📋 Pliki Konfiguracyjne

### `package.json`
Definicja zależności i skryptów projektu:
- **Zależności produkcyjne**: Next.js, React, Radix UI, TipTap, Tailwind CSS
- **Zależności deweloperskie**: TypeScript, PostCSS, Tailwind CSS
- **Skrypty**: `dev`, `build`, `start`, `lint`

### `next.config.mjs`
Konfiguracja Next.js:
- Wyłączenie błędów ESLint i TypeScript podczas budowania
- Wyłączenie optymalizacji obrazów

### `tailwind.config.ts`
Konfiguracja Tailwind CSS:
- Rozszerzona paleta kolorów
- Zmienne CSS dla motywów
- Animacje i keyframes
- Plugin dla animacji

### `middleware.ts`
Middleware Next.js do obsługi uwierzytelniania:
- Automatyczna ochrona tras `/admin/*`
- Przekierowanie niezalogowanych użytkowników do strony logowania
- Odświeżanie sesji Supabase
- Obsługa cookies uwierzytelniania

### `tsconfig.json`
Konfiguracja TypeScript z aliasami ścieżek

### `postcss.config.mjs`
Konfiguracja PostCSS z Tailwind CSS

### `components.json`
Konfiguracja komponentów UI (shadcn/ui)

## 🚀 Instalacja i Uruchomienie

### Wymagania
- Node.js 18+
- pnpm (zalecane) lub npm

### Kroki instalacji

1. **Klonowanie repozytorium**
```bash
git clone [repository-url]
cd jakub-blog
```

2. **Instalacja zależności**
```bash
pnpm install
```

3. **Uruchomienie w trybie deweloperskim**
```bash
pnpm dev
```

4. **Budowanie dla produkcji**
```bash
pnpm build
pnpm start
```

## 🎨 Funkcjonalności UI/UX

### Strona Główna
- **Header z social media** - Linki do mediów społecznościowych
- **Wyszukiwarka** - Filtrowanie postów w czasie rzeczywistym
- **Kategoryzacja** - Filtrowanie po kategoriach
- **Sortowanie** - Według daty lub popularności
- **Przypinane posty** - Wyróżnienie ważnych treści

### Panel Administratora
- **Uwierzytelnianie** - Bezpieczne logowanie z Supabase Auth
- **Ochrona tras** - Automatyczne przekierowanie niezalogowanych użytkowników
- **Dashboard** - Przegląd metryk i zarządzanie
- **Edytor postów** - Zaawansowany WYSIWYG z TipTap
- **Zarządzanie mediami** - Upload i organizacja plików
- **Analityka** - Statystyki odwiedzin i engagement

### Responsywność
- Pełna responsywność na wszystkich urządzeniach
- Optymalizacja dla mobile-first
- Dostępność (a11y) dzięki Radix UI

## 🔧 Rozwój i Rozszerzenia

### Zaimplementowane Funkcjonalności ✅
- ✅ **System uwierzytelniania** - Pełna integracja z Supabase Auth
- ✅ **Ochrona tras** - Middleware zabezpieczający panel administratora
- ✅ **Zarządzanie sesjami** - Automatyczne odświeżanie i walidacja
- ✅ **OAuth callback** - Obsługa zewnętrznych dostawców uwierzytelniania
- ✅ **Strona O Autorze** - Landing page z możliwością edycji treści przez administratorów

### Planowane Funkcjonalności
- System komentarzy
- Newsletter
- Integracja z API giełdowymi
- System tagów
- Wersje językowe
- PWA (Progressive Web App)

### Struktura Gotowa na Rozszerzenie
- Modułowa architektura komponentów
- Hooks do logiki biznesowej
- Utilities dla funkcji pomocniczych
- Konfigurowalny system motywów

## 📞 Kontakt i Wsparcie

Projekt stworzony dla bloga finansowego **JAKUB INWESTYCJE - FINANSE BARDZO OSOBISTE**.

---

## 🚀 Konfiguracja i Uruchomienie

### 1. Instalacja zależności
```bash
npm install
# lub
pnpm install
```

### 2. Konfiguracja Supabase
Stwórz plik `.env.local` i dodaj zmienne środowiskowe:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Przykładowa konfiguracja znajduje się w pliku `env-test.txt`.**

**Ważne:** Aplikacja wymaga prawidłowej konfiguracji Supabase Auth:
- ✅ Tabele `profiles` są automatycznie tworzone przez trigger
- ✅ Trigger `handle_new_user()` automatycznie tworzy profile dla nowych użytkowników
- Ustaw odpowiednie polityki RLS
- Skonfiguruj dostawców OAuth (opcjonalnie)

Szczegółowe instrukcje konfiguracji znajdziesz w pliku `SUPABASE_SETUP.md`.

### 3. Uruchomienie aplikacji
```bash
npm run dev
# lub
pnpm dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

### 4. Logowanie do panelu administratora
- Przejdź do `http://localhost:3000/admin/login`
- Zaloguj się używając konta Supabase (email/hasło)
- Po zalogowaniu zostaniesz automatycznie przekierowany do panelu administratora
- Wszystkie trasy `/admin/*` są chronione i wymagają uwierzytelnienia

### 5. Budowanie dla produkcji
```bash
npm run build
npm start
```

## 🔧 Rozwiązane Problemy

### Problem z UUID w bazie danych
**Błąd:** `Error: invalid input syntax for type uuid: "mock-author-id"`

**Rozwiązanie:**
- ✅ Zaimplementowano pełny system uwierzytelniania z Supabase Auth
- ✅ Zastąpiono "mock-author-id" prawdziwym UUID użytkownika z sesji
- ✅ Dodano walidację uwierzytelnienia przed tworzeniem postów
- ✅ Zaimplementowano automatyczne przekierowanie do logowania

### Problem z kluczem obcym w tabeli posts
**Błąd:** `Error: insert or update on table "posts" violates foreign key constraint "posts_author_id_fkey"`

**Rozwiązanie:**
- ✅ Utworzono brakujący profil użytkownika w tabeli `profiles`
- ✅ Dodano automatyczny trigger `handle_new_user()` do tworzenia profili
- ✅ Skonfigurowano trigger na tabeli `auth.users` dla nowych rejestracji
- ✅ Zapewniono spójność danych między `auth.users` a `profiles`

### Implementacja uwierzytelniania
**Zmiany:**
- ✅ Utworzono hook `useAuth` do zarządzania sesją
- ✅ Dodano `AuthProvider` do głównego layoutu
- ✅ Zaktualizowano stronę logowania z integracją Supabase
- ✅ Dodano middleware do ochrony tras administratora
- ✅ Zaimplementowano OAuth callback handler

### Bezpieczeństwo aplikacji
**Zabezpieczenia:**
- ✅ Ochrona tras `/admin/*` przez middleware
- ✅ Automatyczne przekierowanie niezalogowanych użytkowników
- ✅ Walidacja sesji na poziomie serwera
- ✅ Bezpieczne zarządzanie cookies uwierzytelniania
- ✅ Automatyczne tworzenie profili dla nowych użytkowników

## 📚 Dokumentacja

- **Serwisy**: `lib/services/README.md` - Dokumentacja serwisów do zarządzania danymi
- **Konfiguracja**: `SUPABASE_SETUP.md` - Instrukcje konfiguracji Supabase
- **Modele**: Typy i interfejsy w folderze `lib/models/`
- **Uwierzytelnianie**: `hooks/use-auth.ts` - Hook do zarządzania sesją użytkownika

*Dokumentacja aktualizowana na bieżąco wraz z rozwojem projektu.* 