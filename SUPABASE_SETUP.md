# Konfiguracja Supabase dla Jakub Blog

## 1. Zmienne środowiskowe

Stwórz plik `.env.local` w głównym katalogu projektu i dodaj:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jmtmhwzgvqnsitdgdgwa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteG1od3pndnFuc2l0ZGdkZ3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NjI0NzQsImV4cCI6MjA1MTIzODQ3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
```

## 2. Struktura bazy danych

Baza danych zawiera następujące tabele:

### Główne tabele:
- `posts` - posty bloga
- `categories` - kategorie postów
- `tags` - tagi postów
- `profiles` - profile użytkowników
- `attachments` - załączniki (obrazy, pliki)

### Tabele relacyjne:
- `post_categories` - relacja posty-kategorie
- `post_tags` - relacja posty-tagi
- `post_attachments` - relacja posty-załączniki

### Tabele analityczne:
- `post_views` - wyświetlenia postów
- `post_analytics` - analityka postów

## 3. Funkcje bazy danych

### `get_published_posts(limit_count, offset_count)`
Pobiera opublikowane posty z paginacją.

### `increment_post_views(post_slug)`
Zwiększa liczbę wyświetleń posta.

### `handle_new_user()` ✅ ZAIMPLEMENTOWANE
Automatycznie tworzy profil w tabeli `profiles` dla nowych użytkowników rejestrujących się przez Supabase Auth.

**Trigger:**
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**Funkcja:**
```sql
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
```

## 4. Użycie w aplikacji

### Import serwisu:
```typescript
import { PostService } from '@/lib/services/post-service'
```

### Przykład użycia:
```typescript
// Inicjalizacja serwisu
const postService = new PostService()

// Pobieranie postów
const posts = await postService.getPublishedPosts(10, 0)

// Pobieranie pojedynczego posta
const post = await postService.getPostBySlug('slug-posta')

// Tworzenie nowego posta
const newPost = await postService.createPost({
  title: 'Tytuł posta',
  slug: 'slug-posta',
  content: 'Treść posta',
  status: 'published'
}, 'author-id')
```

## 5. Typy TypeScript

Wszystkie typy są automatycznie generowane z schematu bazy danych i dostępne w:
- `lib/database.types.ts` - typy bazy danych
- `lib/models/post.ts` - modele postów
- `lib/models/category.ts` - modele kategorii
- `lib/models/tag.ts` - modele tagów

## 6. Bezpieczeństwo

### Row Level Security (RLS)
Upewnij się, że RLS jest włączone dla wszystkich tabel i skonfigurowane odpowiednie polityki.

### Polityki przykładowe:
```sql
-- Publiczny dostęp do odczytu opublikowanych postów
CREATE POLICY "Public posts are viewable by everyone" ON posts
FOR SELECT USING (status = 'published');

-- Autorzy mogą edytować swoje posty
CREATE POLICY "Authors can update own posts" ON posts
FOR UPDATE USING (auth.uid() = author_id);
```

## 7. Migracje

Wszystkie zmiany w schemacie bazy danych powinny być wykonywane przez migracje:

```sql
-- Przykład migracji
CREATE TABLE IF NOT EXISTS new_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 8. Monitoring

Monitoruj wydajność zapytań w panelu Supabase:
- Dashboard > Database > Query Performance
- Logs > Database logs

## 9. Backup

Regularne backupy są automatycznie tworzone przez Supabase.
Możesz również eksportować dane ręcznie z panelu administracyjnego.

## 10. Troubleshooting

### Częste problemy:

1. **Błąd połączenia**: Sprawdź zmienne środowiskowe
2. **Brak uprawnień**: Sprawdź polityki RLS
3. **Błędy TypeScript**: Regeneruj typy z `supabase gen types`

### Rozwiązane problemy ✅

#### Problem z kluczem obcym posts_author_id_fkey
**Błąd:** `Error: insert or update on table "posts" violates foreign key constraint "posts_author_id_fkey"`

**Przyczyna:** Brak profilu użytkownika w tabeli `profiles` dla istniejącego użytkownika w `auth.users`.

**Rozwiązanie:**
1. Utworzono brakujący profil dla istniejącego użytkownika
2. Dodano automatyczny trigger `handle_new_user()` dla nowych rejestracji
3. Zapewniono spójność danych między tabelami `auth.users` i `profiles`

**Status:** ✅ ROZWIĄZANE - Trigger automatycznie tworzy profile dla nowych użytkowników 