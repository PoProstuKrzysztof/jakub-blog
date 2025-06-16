# JAKUB INWESTYCJE - Blog Finansowy

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Spis Treści

- [Opis Projektu](#-opis-projektu)
- [Funkcjonalności](#-funkcjonalności)
- [Stack Technologiczny](#️-stack-technologiczny)
- [Instalacja i Uruchomienie](#-instalacja-i-uruchomienie)
- [Konfiguracja](#-konfiguracja)
- [Struktura Projektu](#-struktura-projektu)
- [Funkcjonalności Zaawansowane](#-funkcjonalności-zaawansowane)
- [Bezpieczeństwo](#-bezpieczeństwo)
- [Wdrożenie](#-wdrożenie)
- [Rozwiązywanie Problemów](#-rozwiązywanie-problemów)
- [Współpraca](#-współpraca)
- [Licencja](#-licencja)

## 🎯 Opis Projektu

**JAKUB INWESTYCJE** to nowoczesny blog finansowy o tematyce inwestycyjnej, stworzony w technologii Next.js 15 z TypeScript. Aplikacja oferuje profesjonalną platformę do publikowania analiz finansowych, poradników inwestycyjnych oraz aktualności z rynków kapitałowych.

### Główne Cele Aplikacji

1. **Edukacja Finansowa** - Dostarczanie wysokiej jakości treści edukacyjnych z zakresu inwestowania
2. **Analiza Rynkowa** - Publikowanie szczegółowych analiz spółek, sektorów i trendów rynkowych
3. **Społeczność Inwestorów** - Budowanie platformy wymiany wiedzy między inwestorami
4. **Profesjonalne Zarządzanie Treścią** - Zaawansowany panel administratora z edytorem WYSIWYG

## ✨ Funkcjonalności

### 📝 Zaawansowany Edytor Tekstów
- **Formatowanie tekstu** (pogrubienie, kursywa, podkreślenie, indeksy)
- **Wykresy interaktywne** (słupkowe, liniowe, kołowe) z Chart.js
- **Filmy YouTube** - bezpośrednie osadzanie
- **Obrazy** z upload plików i URL do Supabase Storage
- **Tabele** z edycją komórek
- **Listy zadań** z interaktywnymi checkboxami
- **Linki** i cytaty
- **Cofnij/Ponów** z pełną historią zmian

### 🔐 System Uwierzytelniania
- Integracja z Supabase Auth (email/hasło, OAuth)
- Ochrona tras z middleware Next.js
- Automatyczne tworzenie profili użytkowników
- Role-based access control

### 🎨 Interfejs Użytkownika
- **Responsywny design** dostosowany do wszystkich urządzeń
- **Nowoczesny interfejs** oparty na Tailwind CSS i Radix UI
- **Zunifikowana nawigacja** z Grid Layout CSS
- **Drag & Drop** dla ofert współpracy
- **Inline edycja** treści dla administratorów

### 📊 Zarządzanie Treścią
- System wyszukiwania i filtrowania postów
- Kategoryzacja treści (Analiza spółek, Kryptowaluty, Edukacja)
- System przypinania ważnych postów
- Panel analityczny z metrykami odwiedzin
- System załączników (PDF, Excel, obrazy)

### 🖼️ Strona O Autorze
- Nowoczesny landing page z możliwością edycji
- Upload głównego zdjęcia autora
- Responsywny design z smooth scrolling
- Sekcje: Hero, Doświadczenie, Wykształcenie, Filozofia, Osiągnięcia, Kontakt

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
- **Row Level Security** - Bezpieczeństwo na poziomie wierszy
- **Real-time subscriptions** - Aktualizacje w czasie rzeczywistym

### Edytor i Formularze
- **TipTap** - Zaawansowany edytor WYSIWYG
- **React Hook Form** - Zarządzanie formularzami
- **Zod** - Walidacja schematów

### UI/UX i Narzędzia
- **Lucide React** - Ikony
- **Next Themes** - Zarządzanie motywami
- **Sonner** - Powiadomienia toast
- **Chart.js** - Wykresy interaktywne
- **@dnd-kit** - Drag & Drop functionality

## 🚀 Instalacja i Uruchomienie

### Wymagania Systemowe
- **Node.js** 18.0 lub nowszy
- **pnpm** (zalecane), **npm** lub **yarn**
- **Git**

### Kroki Instalacji

1. **Klonowanie repozytorium**
```bash
git clone <repository-url>
cd jakub-blog
```

2. **Instalacja zależności**
```bash
# Używając pnpm (zalecane)
pnpm install

# Lub używając npm
npm install

# Lub używając yarn
yarn install
```

3. **Konfiguracja zmiennych środowiskowych**

Utwórz plik `.env.local` w głównym katalogu projektu:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Security Configuration
CSRF_SECRET=your_csrf_secret_32_chars_minimum
RATE_LIMIT_MAX=2000
RATE_LIMIT_WINDOW_MS=60000
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif

# Redis Configuration (Optional)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
REDIS_DEFAULT_TTL=3600
REDIS_KEY_PREFIX=blog:
REDIS_RATE_LIMIT_ENABLED=true

# Headers Security
HSTS_MAX_AGE=31536000
CSP_REPORT_URI=https://yourdomain.com/api/security/csp-report
```

4. **Uruchomienie aplikacji**

#### Tryb Deweloperski
```bash
pnpm dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

#### Tryb Produkcyjny
```bash
pnpm build
pnpm start
```

## ⚙️ Konfiguracja

### Konfiguracja Supabase

#### 1. Utworzenie projektu Supabase
- Utwórz konto na [Supabase](https://supabase.com/)
- Stwórz nowy projekt
- Skopiuj URL i klucz anonimowy do `.env.local`

#### 2. Konfiguracja bazy danych

Wykonaj poniższe skrypty SQL w Supabase SQL Editor:

```sql
-- Funkcja automatycznego tworzenia profili
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role, is_active)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'admin',
    true
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger dla nowych użytkowników
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### 3. Konfiguracja Storage

Utwórz bucket `images` z następującymi politykami:

```sql
-- Publiczny dostęp do odczytu
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Upload dla zalogowanych użytkowników
CREATE POLICY "Authenticated users can upload images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

#### 4. Tabela author_content

```sql
-- Tabela dla treści strony O Autorze
CREATE TABLE IF NOT EXISTS author_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type VARCHAR(50) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  section_order INTEGER NOT NULL DEFAULT 1,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wstawienie domyślnych sekcji
INSERT INTO author_content (section_type, title, content, section_order, is_visible) VALUES
('hero', 'Jakub - Twój Przewodnik w Świecie Inwestycji', 'Witaj! Jestem Jakub, pasjonatem inwestycji z wieloletnim doświadczeniem na rynkach finansowych.', 1, true),
('experience', 'Doświadczenie', 'Ponad 8 lat doświadczenia w analizie rynków finansowych.', 2, true),
('education', 'Wykształcenie', 'Magister Ekonomii na Uniwersytecie Warszawskim.', 3, true),
('philosophy', 'Filozofia Inwestycyjna', 'Wierzę w długoterminowe inwestowanie oparte na solidnej analizie.', 4, true),
('achievements', 'Osiągnięcia', 'Autor ponad 200 analiz spółek.', 5, true),
('contact', 'Kontakt', 'Masz pytania? Skontaktuj się ze mną!', 6, true)
ON CONFLICT (section_type) DO NOTHING;
```

### Konfiguracja Redis (Opcjonalna)

#### Opcja 1: Upstash Redis (Zalecane dla Vercel)
1. Utwórz konto na [Upstash](https://upstash.com/)
2. Stwórz nową bazę Redis
3. Dodaj URL i token do `.env.local`

#### Opcja 2: Lokalny Redis (Docker)
```bash
docker run -d --name redis-blog -p 6379:6379 redis:7-alpine
```

## 📁 Struktura Projektu

```
jakub-blog/
├── app/                        # Next.js App Router
│   ├── admin/                  # Panel administratora
│   │   ├── analytics/          # Dashboard analityczny
│   │   ├── login/             # Logowanie administratora
│   │   └── nowy-post/         # Tworzenie postów
│   ├── api/                   # API endpoints
│   │   ├── redis/health/      # Health check Redis
│   │   └── security/csp-report/ # CSP violation reports
│   ├── auth/callback/         # OAuth callback
│   ├── blog/                  # Strona bloga
│   ├── kontakt/              # Strona kontaktowa
│   ├── post/[id]/            # Dynamiczne strony postów
│   ├── wpisy/                # Lista wszystkich postów
│   └── wspolpraca/           # Strona współpracy
├── components/               # Komponenty React
│   ├── editor/              # Komponenty edytora
│   │   ├── rich-text-editor.tsx
│   │   ├── chart-component.tsx
│   │   └── media-upload.tsx
│   └── ui/                  # Komponenty UI (Radix/Shadcn)
├── hooks/                   # Custom React hooks
│   ├── use-auth.ts         # Hook uwierzytelniania
│   └── use-mobile.tsx      # Hook wykrywania mobile
├── lib/                    # Biblioteki i utilities
│   ├── actions/           # Server actions
│   ├── models/            # Modele danych
│   ├── redis/             # Konfiguracja Redis
│   ├── security/          # Zabezpieczenia
│   └── services/          # Serwisy biznesowe
├── public/                # Zasoby statyczne
│   └── images/           # Obrazy i ikony
├── styles/               # Style CSS
└── guides/              # Dokumentacja techniczna
```

## 🔧 Funkcjonalności Zaawansowane

### Zaawansowany Edytor Tekstu (TipTap)

Edytor oferuje funkcjonalności podobne do Microsoft Word:

#### Formatowanie Tekstu
- **Podstawowe**: Pogrubienie, kursywa, podkreślenie, przekreślenie
- **Kod**: Formatowanie kodu inline
- **Indeksy**: Górny (x²) i dolny (H₂O)
- **Highlight**: Podświetlanie tekstu

#### Elementy Multimedialne
- **Obrazy**: Automatyczny upload do Supabase Storage
- **Filmy YouTube**: Automatyczne osadzanie z URL
- **Wykresy**: Interaktywne wykresy Chart.js (słupkowe, liniowe, kołowe)

#### Przykład konfiguracji wykresu:
```json
{
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "datasets": [{
    "label": "Przychody",
    "data": [1200, 1900, 800, 1700],
    "borderColor": "#36a2eb",
    "backgroundColor": "rgba(54, 162, 235, 0.1)"
  }]
}
```

### Drag & Drop dla Ofert Współpracy

Implementacja z biblioteką `@dnd-kit`:

```typescript
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
```

#### Funkcjonalności:
- Przeciąganie i upuszczanie ofert
- Inline edycja treści
- Automatyczne zapisywanie zmian
- Responsywny design

### Zunifikowana Nawigacja (SiteHeader)

Komponent nawigacji z Grid Layout CSS:

#### Struktura (3 kolumny):
1. **Lewa sekcja**: Logo i badge administratora
2. **Środkowa sekcja**: Menu nawigacji (zawsze wyśrodkowane)
3. **Prawa sekcja**: Przyciski administratora/użytkownika

#### Funkcjonalności:
- Globalny dostęp do panelu twórcy
- Responsywny hamburger menu
- Izolowane sekcje bez wpływu na pozycjonowanie

### System Przypinania Postów

```typescript
// Server Action
export async function togglePostPin(postId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: post } = await supabase
    .from('posts')
    .select('is_featured')
    .eq('id', postId)
    .single()

  await supabase
    .from('posts')
    .update({ is_featured: !post.is_featured })
    .eq('id', postId)

  revalidatePath('/')
}
```

### Vercel (Zalecane)

1. **Połącz projekt z Vercel**
```bash
vercel --prod
```

2. **Dodaj zmienne środowiskowe** w Vercel Dashboard
3. **Skonfiguruj domeny** i SSL

### Inne Platformy

#### Railway
```bash
railway add redis
railway deploy
```

#### DigitalOcean App Platform
1. Dodaj Redis Managed Database
2. Skonfiguruj zmienne środowiskowe
3. Wdróż aplikację

### Lista Kontrolna Wdrożenia

- [ ] Wszystkie zmienne środowiskowe ustawione
- [ ] HTTPS włączone (SSL/TLS)
- [ ] Security headers skonfigurowane
- [ ] RLS policies aktywne w Supabase
- [ ] Rate limiting włączony
- [ ] Monitoring skonfigurowany
- [ ] Backup i recovery plan
- [ ] Incident response plan

## 🔍 Rozwiązywanie Problemów

### Częste Problemy i Rozwiązania

#### Problem: ChunkLoadError w Next.js 15
**Błąd:** `ChunkLoadError` podczas ładowania komponentów

**Rozwiązanie:**
```tsx
// Dynamiczny import z wyłączonym SSR
const RichTextEditorCore = dynamic(() => 
  import('./rich-text-editor').then(mod => ({ default: mod.RichTextEditor })), 
  {
    ssr: false,
    loading: () => <EditorSkeleton />
  }
)
```

#### Problem: Błąd klucza obcego posts_author_id_fkey
**Błąd:** `violates foreign key constraint "posts_author_id_fkey"`

**Rozwiązanie:** ✅ ROZWIĄZANE
- Utworzono automatyczny trigger `handle_new_user()`
- Zapewniono spójność między `auth.users` a `profiles`

#### Problem: next/headers w komponentach klienckich
**Błąd:** `You're importing a component that needs "next/headers"`

**Rozwiązanie:**
- Usunięto importy `supabase-server.ts` z komponentów klienckich
- Wszystkie serwisy używają teraz tylko klienta Supabase

### Debugowanie

#### 1. Sprawdź konsolę przeglądarki
```bash
# Otwórz DevTools > Console
# Szukaj błędów:
- ChunkLoadError
- Failed to fetch dynamically imported module
- Loading chunk [number] failed
```

#### 2. Wyczyść cache
```bash
# Usuń cache Next.js
rm -rf .next

# Usuń cache node_modules
rm -rf node_modules/.cache

# Restart serwera
pnpm dev
```

#### 3. Webpack Bundle Analyzer
```bash
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer .next/static/chunks
```

## 📊 Dostępne Strony i Funkcjonalności

### Strona Główna (`/`)
- Lista wszystkich opublikowanych postów
- Wyszukiwarka i filtry
- Przypinane posty w specjalnej sekcji
- Sortowanie według daty i popularności

### Panel Administratora (`/admin`)
- Dashboard z metrykami i zarządzaniem postami
- Wymagane uwierzytelnienie

### Tworzenie Postów (`/admin/nowy-post`)
- Zaawansowany edytor WYSIWYG z TipTap
- Upload obrazów i załączników
- Zarządzanie kategoriami i tagami
- Ustawienia SEO i podgląd

### Analityka (`/admin/analytics`)
- Dashboard z metrykami odwiedzin
- Wykresy i statystyki

### Strona O Autorze (`/o-autorze`)
- Nowoczesny landing page
- Możliwość edycji treści przez administratorów
- Upload głównego zdjęcia autora
- Responsywny design z smooth scrolling

### Pojedynczy Post (`/post/[id]`)
- Wyświetlanie pełnej treści posta
- Automatyczne zwiększanie liczby wyświetleń
- Obsługa błędów 404 dla nieistniejących postów

### Współpraca (`/wspolpraca`)
- Informacje o możliwościach współpracy
- Drag & Drop dla ofert (dla administratorów)
- Inline edycja treści

## 🤝 Współpraca

### Jak Współpracować

1. **Fork** repozytorium
2. **Utwórz** branch dla swojej funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. **Commit** swoje zmiany (`git commit -m 'Add some AmazingFeature'`)
4. **Push** do brancha (`git push origin feature/AmazingFeature`)
5. **Otwórz** Pull Request

### Wytyczne Kodowania

- Używaj TypeScript dla wszystkich nowych plików
- Przestrzegaj konwencji nazewnictwa (camelCase dla zmiennych, PascalCase dla komponentów)
- Dodawaj JSDoc komentarze dla publicznych funkcji
- Pisz testy dla nowych funkcjonalności
- Używaj Prettier i ESLint

### Zgłaszanie Błędów

Używaj [GitHub Issues](https://github.com/your-repo/issues) do zgłaszania błędów. Dołącz:
- Opis problemu
- Kroki do reprodukcji
- Oczekiwane zachowanie
- Zrzuty ekranu (jeśli dotyczy)
- Informacje o środowisku (OS, przeglądarka, wersja Node.js)

## 📄 Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

---
