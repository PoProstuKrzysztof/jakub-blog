# Serwisy Supabase

Ten folder zawiera serwisy do zarządzania danymi w bazie Supabase.

## PostService

Główny serwis do zarządzania postami bloga z pełnym CRUD.

### Inicjalizacja

```typescript
import { PostService } from './post-service'

// Dla środowiska klienta
const postService = new PostService()

// Dla środowiska serwera
const postService = new PostService(true)
```

### Podstawowe operacje

#### Pobieranie postów

```typescript
// Wszystkie posty z filtrami
const posts = await postService.getPosts({
  status: 'published',
  search: 'inwestycje',
  is_featured: true
}, {
  field: 'published_at',
  direction: 'desc'
}, {
  page: 1,
  limit: 10,
  offset: 0
})

// Opublikowane posty (dla strony publicznej)
const publishedPosts = await postService.getPublishedPosts(10, 0)

// Post po ID
const post = await postService.getPostById('uuid')

// Post po slug
const post = await postService.getPostBySlug('moj-post')
```

#### Tworzenie posta

```typescript
const newPost = await postService.createPost({
  title: 'Nowy post',
  slug: 'nowy-post',
  content: 'Treść posta...',
  excerpt: 'Krótki opis',
  status: 'published',
  is_featured: true,
  categories: ['category-uuid-1', 'category-uuid-2'],
  tags: ['tag-uuid-1', 'tag-uuid-2']
}, 'author-uuid')
```

#### Aktualizacja posta

```typescript
const updatedPost = await postService.updatePost({
  id: 'post-uuid',
  title: 'Zaktualizowany tytuł',
  content: 'Nowa treść...',
  categories: ['new-category-uuid']
})
```

#### Usuwanie posta

```typescript
const result = await postService.deletePost('post-uuid')
if (result.success) {
  console.log('Post usunięty')
}
```

### Specjalne metody

#### Posty według kategorii

```typescript
const categoryPosts = await postService.getPostsByCategory('kategoria-slug', 10, 0)
```

#### Posty według tagu

```typescript
const tagPosts = await postService.getPostsByTag('tag-slug', 10, 0)
```

#### Popularne posty

```typescript
const popularPosts = await postService.getPopularPosts(5)
```

#### Najnowsze posty

```typescript
const latestPosts = await postService.getLatestPosts(5)
```

#### Zwiększanie wyświetleń

```typescript
await postService.incrementPostViews('post-slug')
```

## Typy danych

Wszystkie typy są zdefiniowane w folderze `lib/models/`:

- `Post` - podstawowy typ posta
- `PostFull` - post z pełnymi relacjami (autor, kategorie, tagi, załączniki)
- `CreatePostData` - dane do tworzenia posta
- `UpdatePostData` - dane do aktualizacji posta
- `PostFilters` - filtry wyszukiwania
- `PostSortOptions` - opcje sortowania
- `PostsResponse` - odpowiedź z listą postów

## Obsługa błędów

Wszystkie metody obsługują błędy i zwracają odpowiednie komunikaty:

```typescript
const result = await postService.getPostById('invalid-id')
if (result.error) {
  console.error('Błąd:', result.error)
} else {
  console.log('Post:', result.data)
}
```

## Konfiguracja środowiska

Upewnij się, że masz skonfigurowane zmienne środowiskowe:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
``` 