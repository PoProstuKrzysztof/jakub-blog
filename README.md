# JAKUB INWESTYCJE - Wpisy Finansowe

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Spis Treści

- [Opis Projektu](#-opis-projektu)
- [Funkcjonalności](#-funkcjonalności)
- [Stack Technologiczny](#-stack-technologiczny)
- [Instalacja](#-instalacja)
- [Konfiguracja](#-konfiguracja)
- [Struktura Projektu](#-struktura-projektu)
- [Funkcjonalności Zaawansowane](#-funkcjonalności-zaawansowane)
- [Bezpieczeństwo](#-bezpieczeństwo)
- [Wdrożenie](#-wdrożenie)
- [Rozwiązywanie Problemów](#-rozwiązywanie-problemów)
- [Współpraca](#-współpraca)
- [Licencja](#-licencja)
- [Kontakt](#-kontakt)

## 📖 Opis Projektu

**JAKUB INWESTYCJE** to nowoczesny blog finansowy stworzony z myślą o edukacji inwestycyjnej i dzieleniu się wiedzą o rynkach finansowych. Projekt wykorzystuje najnowsze technologie webowe, zapewniając szybkość, bezpieczeństwo i doskonałe doświadczenie użytkownika.

### 🎯 Cel Projektu
- Edukacja finansowa społeczności
- Dzielenie się analizami rynkowymi
- Budowanie zaufanej marki w branży finansowej
- Demonstracja nowoczesnych technologii webowych

## ✨ Funkcjonalności

### 👤 Dla Czytelników
- 📚 **Przeglądanie artykułów** - Intuicyjny interfejs z wyszukiwarką i filtrami
- 🔍 **Zaawansowane wyszukiwanie** - Filtrowanie po kategoriach, tagach i dacie
- 📱 **Responsywny design** - Optymalizacja dla wszystkich urządzeń
- ⚡ **Szybkie ładowanie** - Optymalizacja wydajności i SEO
- 📊 **Interaktywne wykresy** - Wizualizacja danych finansowych

### 👨‍💼 Dla Administratorów
- ✍️ **Zaawansowany edytor WYSIWYG** - TipTap z funkcjami podobnymi do MS Word
- 📸 **Zarządzanie mediami** - Upload obrazów i filmów YouTube
- 📈 **Dashboard analityczny** - Statystyki odwiedzin i engagement
- 🔒 **Bezpieczne uwierzytelnianie** - Supabase Auth z RLS
- 📌 **System przypinania postów** - Wyróżnianie ważnych treści
- 💼 **Portfel autora** - Publikowanie składu portfela i analiz inwestycyjnych

### 💰 Portfel Autora (Premium Feature)
- 📊 **Wizualizacja portfela** - Interaktywne wykresy składu inwestycyjnego
- 📝 **Analizy inwestycyjne** - Publikowanie ekspertyz i raportów
- 🔐 **Dostęp płatny** - System zakupów przez Stripe
- 🔔 **Powiadomienia real-time** - Supabase Realtime dla nowych analiz
- 🎯 **Zarządzanie subskrypcjami** - Automatyczne zarządzanie dostępem

## 🛠️ Stack Technologiczny

### Frontend
- **Next.js 15** - React framework z App Router
- **React 19** - Najnowsza wersja z Server Components
- **TypeScript** - Statyczne typowanie
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI + Shadcn/ui** - Komponenty UI wysokiej jakości

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database z Row Level Security
  - Real-time subscriptions
  - Authentication & Authorization
  - File Storage
- **Redis (Upstash)** - Cache i rate limiting

### Narzędzia Deweloperskie
- **TipTap** - Rich text editor
- **Chart.js** - Interaktywne wykresy
- **Framer Motion** - Animacje
- **React Hook Form** - Zarządzanie formularzami
- **Zod** - Walidacja schematów

## 🚀 Instalacja

### Wymagania Systemowe
- **Node.js** 18.17 lub nowszy
- **pnpm** (zalecane) lub npm/yarn
- **Git**

### Kroki Instalacji

1. **Klonowanie repozytorium**
```bash
git clone https://github.com/your-username/jakub-blog.git
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

Skopiuj plik przykładowy i dostosuj wartości:
```bash
cp env.example .env.local
```

Lub utwórz plik `.env.local` w głównym katalogu projektu:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Builder.io Configuration (Optional)
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your-builder-public-key

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
    "backgroundColor": "rgba(54, 162, 235, 0.2)",
    "borderColor": "rgba(54, 162, 235, 1)"
  }]
}
```

### System Nawigacji

Responsywna nawigacja z trzema sekcjami:

#### Implementacja:
```typescript
// Struktura nawigacji
const navigationSections = {
  left: ['Wpisy', 'O Autorze', 'Współpraca'],
  center: 'Logo',
  right: ['Admin Panel', 'User Menu']
}
```

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

## 🛡️ Bezpieczeństwo

### Zaimplementowane Zabezpieczenia

#### 1. Middleware Bezpieczeństwa
- **Rate Limiting**: 2000 żądań na 60 sekund na IP
- **Request Validation**: Walidacja User-Agent i Content-Type
- **Security Headers**: CSP, HSTS, X-Frame-Options, X-XSS-Protection
- **Authentication Guards**: Ochrona tras administracyjnych

#### 2. Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

#### 3. Row Level Security (RLS)
- Wszystkie tabele mają włączone RLS
- Polityki dostępu oparte na rolach użytkowników
- Bezpieczne funkcje z `SET search_path = ''`

#### 4. Walidacja i Sanityzacja Danych
- Input Validation Hook dla formularzy
- XSS Protection - sanityzacja HTML i JavaScript
- SQL Injection Prevention - parametryzowane zapytania
- Pattern Matching - walidacja formatów (email, URL, UUID)

#### 5. Bezpieczny Upload Plików
- Type Validation - sprawdzanie MIME types
- Size Limits - ograniczenie rozmiaru plików (5MB)
- Content Scanning - detekcja niebezpiecznej zawartości
- Hash Verification - SHA-256 dla integralności plików

### Ochrona przed Atakami OWASP Top 10

✅ **A01:2021 – Broken Access Control** - RLS policies, role-based authorization  
✅ **A02:2021 – Cryptographic Failures** - HTTPS enforcement, secure cookies  
✅ **A03:2021 – Injection** - Parametrized queries, input sanitization  
✅ **A04:2021 – Insecure Design** - Security-first architecture  
✅ **A05:2021 – Security Misconfiguration** - Security headers, secure defaults  
✅ **A06:2021 – Vulnerable Components** - Dependency scanning, regular updates  
✅ **A07:2021 – Authentication Failures** - Strong password policy, session management  
✅ **A08:2021 – Data Integrity Failures** - File integrity checks, secure CI/CD  
✅ **A09:2021 – Logging Failures** - Comprehensive logging, security monitoring  
✅ **A10:2021 – Server-Side Request Forgery** - URL validation, request filtering  

## 🚀 Wdrożenie

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

#### Problem: TypeError: Cannot convert undefined or null to object
**Błąd:** `TypeError: Cannot convert undefined or null to object at Function.keys`

**Rozwiązanie:** ✅ ROZWIĄZANE
- Dodano sprawdzenie typu w `PortfolioChart` przed użyciem `Object.keys()`
- Dodano mock data w trybie development gdy brak konfiguracji Supabase
- Poprawiono obsługę błędów w `getActivePortfolio`

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

### Portfel Autora (`/admin/portfel`)
- Panel zarządzania portfelem inwestycyjnym
- Publikowanie nowych składów portfela
- Dodawanie analiz inwestycyjnych
- Wizualizacja danych Chart.js

### Portfel Autora dla Użytkowników (`/portfel-autora`)
- Dostęp po zakupie produktu
- Podgląd aktualnego portfela
- Lista analiz inwestycyjnych
- Real-time powiadomienia o nowych treściach

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

Jeśli znajdziesz błąd, utwórz issue z następującymi informacjami:
- Opis problemu
- Kroki do reprodukcji
- Oczekiwane zachowanie
- Zrzuty ekranu (jeśli dotyczy)
- Informacje o środowisku (OS, przeglądarka, wersja Node.js)

## 📄 Licencja

Ten projekt jest licencjonowany na licencji MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

---

## 📞 Kontakt

**Projekt Open Source** - Wpisy Finansowe JAKUB INWESTYCJE

- 📧 Email: [kontakt@example.com](mailto:kontakt@example.com)
- 🌐 Website: [https://example.com](https://example.com)
- 💼 LinkedIn: [Example Profile](https://linkedin.com/in/example)

> **Uwaga:** To jest projekt demonstracyjny. Dane kontaktowe powyżej są przykładowe.

---

**Projekt stworzony z ❤️ dla społeczności inwestorów**

*Dokumentacja aktualizowana na bieżąco wraz z rozwojem projektu.*

# Jakub Blog - Portfolio Autora

Blog inwestycyjny z funkcjonalnością płatnego dostępu do portfela autora.

## 🎯 Główne funkcjonalności

### 📝 Blog inwestycyjny
- Analizy spółek i rynków finansowych
- Poradniki edukacyjne
- System kategorii i tagów
- Wyszukiwarka treści

### 💼 Portfel autora (Premium)
Miesięczna subskrypcja (49 zł) zapewniająca:
- **Dostęp do aktualnego portfela** - widok składu i alokacji
- **Regularne analizy** - szczegółowe omówienia zmian
- **Powiadomienia real-time** - info o aktualizacjach portfela
- **Miesięczne raporty** - podsumowania wyników

### 🛡️ System uprawnień
- **Goście** - dostęp do darmowych artykułów
- **Subskrybenci** - płatny dostęp do portfela autora
- **Admin/Autor** - zarządzanie treścią i portfelem

## 🚀 Jak użytkownik uzyskuje dostęp do portfela?

### 1. **Zakup dostępu**
```
Użytkownik → /portfel-autora → Formularz z emailem → Stripe Checkout → Płatność 49 zł
```

### 2. **Automatyczne utworzenie konta**
Po udanej płatności webhook Stripe:
- Sprawdza czy użytkownik istnieje w bazie
- Tworzy nowe konto (jeśli nie istnieje)
- Zapisuje zamówienie w tabeli `orders`
- Generuje magic-link do logowania

### 3. **Dostęp do portfela**
Użytkownik:
- Otrzymuje email z linkiem logowania
- Klika link → automatyczne logowanie
- Uzyskuje dostęp do `/portfel-autora`

## 🔧 Technologie

- **Frontend**: Next.js 14 App Router, React, TypeScript
- **UI**: Tailwind CSS, Shadcn UI, Radix UI
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **Płatności**: Stripe + webhooks
- **Cache**: Redis
- **Real-time**: Supabase Realtime

## 📊 Architektura bazy danych

### Główne tabele:
- `products` - katalog produktów (portfolio-access)
- `orders` - zamówienia użytkowników
- `author_portfolio` - składy portfela (tylko jeden aktywny)
- `author_analyses` - analizy i raporty
- `notifications` - powiadomienia użytkowników

### Row Level Security (RLS):
- Funkcja `has_product()` sprawdza czy użytkownik kupił dostęp
- Polityki ograniczają dostęp do portfela tylko dla płacących
- Administratorzy mają pełny dostęp do zarządzania

## 🛠️ Rozwój lokalny

```bash
# Instalacja zależności
npm install

# Konfiguracja środowiska
cp .env.example .env.local
# Uzupełnij zmienne środowiskowe

# Uruchomienie
npm run dev
```

### Wymagane zmienne środowiskowe:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔐 Bezpieczeństwo

- **Middleware** chroni trasy `/portfel-autora` i `/admin`
- **Rate limiting** na żądania API
- **CSP headers** dla bezpieczeństwa treści
- **Walidacja schematów** (Zod) dla wszystkich akcji
- **Row Level Security** w Supabase

## 📈 Deployment

Projekt jest przygotowany na deployment na **Vercel** z:
- Automatycznym buildowaniem
- Edge Functions przez Supabase
- Webhooks Stripe
- Redis cache

## 🎨 UI/UX

- **Responsive design** - mobile-first approach
- **Loading states** - skeleton loaders
- **Error handling** - przyjazne komunikaty
- **Real-time updates** - powiadomienia o nowych analizach

---

> 💡 **Tip**: Funkcjonalność portfela autora działa w pełni w środowisku development - możesz testować flow zakupu używając Stripe test mode.
