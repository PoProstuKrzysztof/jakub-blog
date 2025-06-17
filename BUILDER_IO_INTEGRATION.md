# Integracja z Builder.io

## 📋 Status integracji

✅ **Projekt jest gotowy do pracy z Builder.io!**

### Co zostało zaimplementowane:

1. **Podstawowa konfiguracja SDK** - `@builder.io/sdk-react-nextjs: ^0.22.0`
2. **Route Builder.io** - `app/(builder)/[...slug]/page.tsx`
3. **Konfiguracja Next.js** - obsługa obrazów i CSP
4. **Przykładowy komponent RSC** - `CatFacts`
5. **Komponenty sekcji strony głównej** dostosowane do Builder.io
6. **Kompletny komponent strony głównej** z konfigurowalnymi sekcjami

## 🏗️ Nowe komponenty dla Builder.io

### Sekcje strony głównej:

1. **HeroSection** - sekcja główna z CTA
   - Konfigurowalny tytuł, podtytuł, przyciski
   - Opcjonalne statystyki
   - Responsive design

2. **FeaturesSection** - sekcja z funkcjami/korzyściami
   - Edytowalny tytuł i podtytuł
   - Sztywno zakodowane 4 główne funkcje

3. **ServicesSection** - sekcja z usługami
   - 3 główne kategorie usług
   - Edytowalne teksty nagłówków

4. **TestimonialsSection** - opinie klientów
   - Sztywno zakodowane 3 opinie
   - Edytowalne nagłówki

5. **CTASection** - sekcja call-to-action
   - Konfigurowalny tekst i przyciski
   - Gradient w tle

6. **HomePageBuilder** - kompletna strona główna
   - Łączy wszystkie powyższe sekcje
   - Obsługa bloga z postami
   - Pełna konfigurowalność sekcji

## 🚀 Jak zacząć

### 1. Utwórz plik `.env.local`:
```bash
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your_builder_io_public_key_here
```

### 2. Zdobądź klucz API z Builder.io:
- Idź na https://builder.io
- Zaloguj się/zarejestruj
- Skopiuj "Public API Key" z ustawień organizacji

### 3. Uruchom projekt:
```bash
npm run dev
# lub
pnpm dev
```

## 💡 Użycie w Builder.io

### Dostępne komponenty w edytorze:

1. **CatFacts** - przykładowy komponent z faktami o kotach
2. **HeroSection** - sekcja hero z konfigurowalnymi polami
3. **FeaturesSection** - sekcja funkcji
4. **ServicesSection** - sekcja usług
5. **TestimonialsSection** - sekcja opinii
6. **CTASection** - sekcja call-to-action
7. **HomePageBuilder** - cała strona główna

### Konfiguracja komponentów:

#### HeroSection:
- **Tytuł główny** (text)
- **Podtytuł** (longText)
- **Tekst głównego przycisku** (text)
- **Link głównego przycisku** (url)
- **Tekst drugiego przycisku** (text)
- **Link drugiego przycisku** (url)
- **Tekst znaczka** (text)
- **Pokaż statystyki** (boolean)

#### HomePageBuilder:
- **Widoczność sekcji** - kontrola, które sekcje mają być wyświetlane
- **Ustawienia Hero** - konfiguracja sekcji hero
- Automatyczna obsługa postów z bloga (jeśli dostępne)

## 🔧 Struktura plików

```
components/
├── builder/
│   ├── cat-facts.tsx           # Przykładowy komponent RSC
│   └── home-page-sections.tsx  # Sekcje strony głównej
├── home-page-builder.tsx       # Kompletna strona główna
└── home-page-client.tsx        # Oryginalna strona (zachowana)

lib/
└── builder.ts                  # Konfiguracja i rejestracja komponentów

app/
└── (builder)/
    └── [...slug]/
        └── page.tsx             # Route Builder.io
```

## 📝 Uwagi techniczne

1. **Client Components** - komponenty używają `"use client"` dla interaktywności
2. **TypeScript** - pełne wsparcie typów dla wszystkich props
3. **Responsive** - wszystkie komponenty są responsywne
4. **Icons** - używają Lucide React
5. **Styling** - Tailwind CSS z Shadcn/UI

## 🔄 Migracja z istniejącego kodu

Oryginalny komponent `HomePageClient` został zachowany w `components/home-page-client.tsx`. Nowy `HomePageBuilder` oferuje:

- Lepszą modularność
- Konfigurowalność przez Builder.io
- Zachowanie funkcjonalności bloga
- Łatwiejsze zarządzanie treścią

## 🌐 URLs i routing

- **Builder.io pages**: `https://yoursite.com/any-page`
- **Existing routes**: Zachowane bez zmian
- **Catch-all**: `app/(builder)/[...slug]` obsługuje wszystkie strony Builder.io

## 🎯 Następne kroki

1. Ustaw klucz API Builder.io
2. Przetestuj komponenty w edytorze Builder.io
3. Utwórz pierwszą stronę używając komponentów
4. Dodaj własne komponenty według potrzeb
5. Skonfiguruj domeny i publikowanie

Projekt jest w pełni gotowy do pracy z Builder.io! 🎉 