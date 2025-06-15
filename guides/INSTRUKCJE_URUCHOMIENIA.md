# 🚀 Instrukcje Uruchomienia - Jakub Blog

## 📋 Wymagania Systemowe

- **Node.js** 18.0 lub nowszy
- **npm**, **yarn** lub **pnpm** (zalecany)
- **Git**

## 🛠️ Instalacja i Uruchomienie

### 1. Klonowanie Repozytorium
```bash
git clone <repository-url>
cd jakub-blog
```

### 2. Instalacja Zależności
```bash
# Używając pnpm (zalecane)
pnpm install

# Lub używając npm
npm install

# Lub używając yarn
yarn install
```

### 3. Konfiguracja Zmiennych Środowiskowych

Utwórz plik `.env.local` w głównym katalogu projektu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jmtmhwzgvqnsitdgdgwa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteG1od3pndnFuc2l0ZGdkZ3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NjI0NzQsImV4cCI6MjA1MTIzODQ3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
```

### 4. Uruchomienie Aplikacji

#### Tryb Deweloperski
```bash
# Używając pnpm
pnpm dev

# Lub używając npm
npm run dev

# Lub używając yarn
yarn dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:3000**

#### Tryb Produkcyjny
```bash
# Build aplikacji
pnpm build

# Uruchomienie
pnpm start
```

## 🎯 Dostępne Strony

### Strona Główna
- **URL**: `http://localhost:3000`
- **Opis**: Lista wszystkich opublikowanych postów z wyszukiwarką i filtrami

### Panel Administratora
- **URL**: `http://localhost:3000/admin`
- **Opis**: Dashboard administratora z metrykami i zarządzaniem postami

### Tworzenie Nowego Posta
- **URL**: `http://localhost:3000/admin/nowy-post`
- **Opis**: Zaawansowany edytor do tworzenia nowych postów
- **Funkcje**:
  - ✅ Edytor WYSIWYG z TipTap
  - ✅ Upload obrazów i załączników
  - ✅ Zarządzanie kategoriami i tagami
  - ✅ Ustawienia SEO
  - ✅ Podgląd posta
  - ✅ Zapisywanie szkiców
  - ✅ Integracja z Supabase CRUD

### Analityka
- **URL**: `http://localhost:3000/admin/analytics`
- **Opis**: Dashboard z metrykami odwiedzin i statystykami

### Pojedynczy Post
- **URL**: `http://localhost:3000/post/[id]`
- **Opis**: Wyświetlanie pełnej treści posta

### Strona Kontaktowa
- **URL**: `http://localhost:3000/kontakt`
- **Opis**: Formularz kontaktowy

### Współpraca
- **URL**: `http://localhost:3000/wspolpraca`
- **Opis**: Informacje o możliwościach współpracy

## 🔧 Funkcjonalności CRUD

### PostService - Zarządzanie Postami
```typescript
import { PostService } from '@/lib/services/post-service'

const postService = new PostService()

// Tworzenie posta
const newPost = await postService.createPost({
  title: 'Nowy post',
  slug: 'nowy-post',
  content: 'Treść posta...',
  status: 'published',
  categories: ['category-id'],
  tags: ['tag-id-1', 'tag-id-2']
}, 'author-id')

// Pobieranie postów
const posts = await postService.getPublishedPosts(10, 0)

// Aktualizacja posta
const updatedPost = await postService.updatePost({
  id: 'post-id',
  title: 'Zaktualizowany tytuł'
})

// Usuwanie posta
const result = await postService.deletePost('post-id')
```

### CategoryService - Zarządzanie Kategoriami
```typescript
import { CategoryService } from '@/lib/services/category-service'

const categoryService = new CategoryService()

// Pobieranie kategorii
const categories = await categoryService.getCategories()

// Tworzenie kategorii
const newCategory = await categoryService.createCategory({
  name: 'Nowa kategoria',
  slug: 'nowa-kategoria'
})
```

### TagService - Zarządzanie Tagami
```typescript
import { TagService } from '@/lib/services/tag-service'

const tagService = new TagService()

// Pobieranie tagów
const tags = await tagService.getTags()

// Tworzenie tagu
const newTag = await tagService.createTag({
  name: 'Nowy tag',
  slug: 'nowy-tag'
})
```

## 📊 Baza Danych Supabase

### Główne Tabele
- `posts` - posty bloga
- `categories` - kategorie postów
- `tags` - tagi postów
- `profiles` - profile użytkowników
- `attachments` - załączniki

### Tabele Relacyjne
- `post_categories` - relacja posty-kategorie
- `post_tags` - relacja posty-tagi
- `post_attachments` - relacja posty-załączniki

## 🎨 Technologie

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Shadcn UI
- **Backend**: Supabase (PostgreSQL)
- **Edytor**: TipTap
- **Formularze**: React Hook Form, Zod
- **Ikony**: Lucide React

## ✅ Rozwiązane Problemy

### Problem z `next/headers` w komponentach klienckich
**Błąd:** `You're importing a component that needs "next/headers". That only works in a Server Component`

**Rozwiązanie:** 
- Usunięto importy `supabase-server.ts` z serwisów używanych w komponentach klienckich
- Wszystkie serwisy (`PostService`, `CategoryService`, `TagService`) używają teraz tylko klienta Supabase
- Funkcjonalność server-side zostanie dodana w przyszłości

### Problem z błędami TypeScript w CategoryService
**Błąd:** `'is_active' does not exist in type CategoryInsert`

**Rozwiązanie:**
- Usunięto pole `is_active` z modelu kategorii (nie istnieje w bazie danych)
- Zaktualizowano typy w `CreateCategoryData`

## 🔍 Debugowanie

### Sprawdzenie Połączenia z Supabase
```typescript
// W konsoli przeglądarki
import { createClient } from '@/lib/supabase'
const supabase = createClient()
const { data, error } = await supabase.from('posts').select('*').limit(1)
console.log({ data, error })
```

### Logi Aplikacji
- Sprawdź konsolę przeglądarki dla błędów frontend
- Sprawdź terminal dla błędów serwera
- Sprawdź panel Supabase dla błędów bazy danych

## 📝 Dodatkowe Informacje

### Struktura Projektu
```
jakub-blog/
├── app/                    # Strony aplikacji (App Router)
├── components/             # Komponenty React
│   ├── ui/                # Komponenty UI (Shadcn)
│   └── editor/            # Komponenty edytora
├── lib/                   # Biblioteki i utilities
│   ├── services/          # Serwisy CRUD
│   ├── models/           # Modele TypeScript
│   └── supabase.ts       # Konfiguracja Supabase
├── hooks/                # Custom hooks
├── public/               # Pliki statyczne
└── styles/               # Style CSS
```

### Skrypty NPM
```bash
pnpm dev          # Uruchomienie w trybie deweloperskim
pnpm build        # Build aplikacji
pnpm start        # Uruchomienie w trybie produkcyjnym
pnpm lint         # Sprawdzenie kodu
```

## 🚨 Rozwiązywanie Problemów

### Problem: Błąd połączenia z Supabase
**Rozwiązanie**: 
1. Sprawdź czy plik `.env.local` istnieje w głównym katalogu
2. Sprawdź czy zawiera poprawne klucze Supabase
3. Uruchom ponownie serwer: `npm run dev`

### Problem: Błędy TypeScript
**Rozwiązanie**: 
1. Sprawdź czy wszystkie zależności są zainstalowane: `npm install`
2. Uruchom `npm run build` aby sprawdzić wszystkie błędy

### Problem: Komponenty UI nie działają
**Rozwiązanie**: Sprawdź czy wszystkie zależności są zainstalowane

### Problem: Cache Next.js
**Rozwiązanie**: 
1. Usuń folder `.next`
2. Uruchom ponownie: `npm run dev`

## 📋 Instrukcja tworzenia pliku .env.local

**WAŻNE:** Utwórz plik `.env.local` w głównym katalogu projektu:

1. Otwórz terminal w katalogu projektu
2. Utwórz plik `.env.local`:
   ```bash
   # Windows
   echo. > .env.local
   
   # macOS/Linux
   touch .env.local
   ```
3. Otwórz plik w edytorze i dodaj:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://jmtmhwzgvqnsitdgdgwa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteG1od3pndnFuc2l0ZGdkZ3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NjI0NzQsImV4cCI6MjA1MTIzODQ3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
   ```
4. Zapisz plik
5. Uruchom aplikację: `npm run dev`

---

🎉 **Gotowe!** Aplikacja powinna działać poprawnie. W przypadku problemów sprawdź logi w konsoli lub skontaktuj się z zespołem deweloperskim. 