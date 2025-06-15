# 📝 Przewodnik Zaawansowanego Edytora Tekstu

## 🎯 Przegląd

Zaawansowany edytor tekstu oparty na **TipTap** z funkcjonalnościami podobnymi do Microsoft Word. Umożliwia tworzenie bogatej treści z obrazami, filmami YouTube, wykresami i zaawansowanym formatowaniem.

## ✨ Główne Funkcjonalności

### 📄 Formatowanie Tekstu
- **Podstawowe**: Pogrubienie, kursywa, podkreślenie, przekreślenie
- **Kod**: Formatowanie kodu inline
- **Indeksy**: Górny (x²) i dolny (H₂O)
- **Highlight**: Podświetlanie tekstu

### 🏗️ Struktura Dokumentu
- **Nagłówki**: H1, H2, H3
- **Wyrównanie**: Lewo, środek, prawo, wyjustowanie
- **Listy**: Punktowane, numerowane, zadań z checkboxami
- **Cytaty**: Bloki cytatów
- **Tabele**: 3x3 z nagłówkami

### 🎨 Elementy Multimedialne
- **Obrazy**: Upload do Supabase Storage lub URL
- **Filmy**: YouTube embed
- **Wykresy**: Interaktywne wykresy Chart.js

### 🔧 Narzędzia
- **Cofnij/Ponów**: Pełna historia zmian
- **Linki**: Dodawanie hiperłączy
- **Skróty klawiszowe**: Standardowe kombinacje

## 🖼️ Upload Obrazów

### Automatyczny Upload do Supabase Storage
Edytor automatycznie przesyła obrazy do Supabase Storage:

1. **Lokalizacja**: Bucket `images` w folderze `editor/`
2. **Nazewnictwo**: `timestamp-randomstring.extension`
3. **Bezpieczeństwo**: Publiczny dostęp do odczytu
4. **Fallback**: Base64 w przypadku błędu uploadu

### Obsługiwane Formaty
- JPG/JPEG
- PNG
- GIF
- WEBP
- SVG

### Konfiguracja Bucket
```sql
-- Bucket został automatycznie utworzony z politykami:
-- 1. Upload dla zalogowanych użytkowników
-- 2. Pobieranie dla wszystkich
-- 3. Usuwanie dla zalogowanych użytkowników
```

## 📊 Wykresy Interaktywne

### Obsługiwane Typy
1. **Słupkowy** (Bar Chart)
2. **Liniowy** (Line Chart)  
3. **Kołowy** (Pie Chart)

### Format Danych JSON

#### Wykres Słupkowy
```json
{
  "labels": ["Styczeń", "Luty", "Marzec", "Kwiecień"],
  "datasets": [{
    "label": "Sprzedaż 2024",
    "data": [12, 19, 3, 17],
    "backgroundColor": [
      "#ff6384",
      "#36a2eb", 
      "#ffce56",
      "#4bc0c0"
    ]
  }]
}
```

#### Wykres Liniowy
```json
{
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "datasets": [{
    "label": "Przychody",
    "data": [1200, 1900, 800, 1700],
    "borderColor": "#36a2eb",
    "backgroundColor": "rgba(54, 162, 235, 0.1)",
    "tension": 0.4
  }]
}
```

#### Wykres Kołowy
```json
{
  "labels": ["Desktop", "Mobile", "Tablet"],
  "datasets": [{
    "data": [45, 35, 20],
    "backgroundColor": [
      "#ff6384",
      "#36a2eb",
      "#ffce56"
    ]
  }]
}
```

## 🎬 Filmy YouTube

### Obsługiwane Formaty URL
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Automatyczne Funkcje
- Responsywny player (16:9)
- Automatyczne wykrywanie ID wideo
- Bezpieczne osadzanie

## ⌨️ Skróty Klawiszowe

| Kombinacja | Akcja |
|------------|-------|
| `Ctrl + B` | Pogrubienie |
| `Ctrl + I` | Kursywa |
| `Ctrl + U` | Podkreślenie |
| `Ctrl + Z` | Cofnij |
| `Ctrl + Y` | Ponów |
| `Ctrl + K` | Dodaj link |

## 🔧 Integracja z Aplikacją

### Import Komponentu
```tsx
import { RichTextEditor } from '@/components/editor/rich-text-editor'
```

### Podstawowe Użycie
```tsx
function MyComponent() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      content={content}
      onChange={setContent}
      placeholder="Zacznij pisać..."
      className="min-h-[500px]"
    />
  )
}
```

### Props
- `content: string` - Treść HTML
- `onChange: (content: string) => void` - Callback zmiany
- `placeholder?: string` - Tekst placeholder
- `className?: string` - Dodatkowe klasy CSS

## 🎨 Stylowanie

### Klasy CSS
- `.prose` - Podstawowe style typograficzne
- `.chart-container` - Kontener wykresów
- `.video-wrapper` - Wrapper dla filmów

### Responsywność
- Automatyczne skalowanie na urządzeniach mobilnych
- Adaptacyjne rozmiary czcionek
- Elastyczne układy multimediów

## 🔍 Rozwiązywanie Problemów

### Problem: Obrazy się nie ładują
**Rozwiązanie**: 
1. Sprawdź połączenie z Supabase
2. Zweryfikuj polityki bucket `images`
3. Sprawdź logi konsoli

### Problem: Wykresy nie wyświetlają się
**Rozwiązanie**:
1. Zwaliduj format JSON
2. Sprawdź czy dane są poprawne
3. Użyj narzędzi deweloperskich

### Problem: YouTube nie działa
**Rozwiązanie**:
1. Sprawdź format URL
2. Upewnij się że wideo jest publiczne
3. Sprawdź ustawienia CORS

## 🚀 Planowane Ulepszenia

### Wersja 2.0
- [ ] Drag & Drop dla obrazów
- [ ] Więcej typów wykresów
- [ ] Współpraca w czasie rzeczywistym
- [ ] Eksport do PDF
- [ ] Szablony treści
- [ ] Automatyczne zapisywanie

### Wersja 2.1
- [ ] Integracja z AI
- [ ] Sprawdzanie pisowni
- [ ] Wersjonowanie treści
- [ ] Komentarze i adnotacje

## 📋 Wymagania Techniczne

### Zależności
- `@tiptap/react` - Główny framework
- `@tiptap/starter-kit` - Podstawowe rozszerzenia
- `chart.js` + `react-chartjs-2` - Wykresy
- `@supabase/supabase-js` - Upload obrazów

### Kompatybilność
- React 18+
- Next.js 13+
- TypeScript 4.9+
- Nowoczesne przeglądarki (ES2020+)

## 💡 Wskazówki i Najlepsze Praktyki

### Wydajność
- Używaj kompresji obrazów przed uploadem
- Ogranicz rozmiar wykresów do niezbędnego minimum
- Unikaj zbyt długich dokumentów (>10MB)

### Dostępność
- Zawsze dodawaj tekst alternatywny do obrazów
- Używaj semantycznych nagłówków
- Testuj z czytnikami ekranu

### SEO
- Strukturyzuj treść nagłówkami
- Używaj opisowych tekstów linków
- Optymalizuj obrazy pod kątem rozmiaru

---

**Wersja**: 1.2.0  
**Ostatnia aktualizacja**: Grudzień 2024  
**Autor**: Jakub Blog Team 