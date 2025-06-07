# Konfiguracja Strony O Autorze

## 📋 Opis

Strona "O Autorze" to nowoczesny landing page prezentujący informacje o autorze bloga z możliwością edycji treści przez zalogowanych administratorów.

## 🛠️ Konfiguracja Bazy Danych

### 1. Utworzenie tabeli author_content

Wykonaj poniższy kod SQL w Supabase SQL Editor:

```sql
-- Tworzenie tabeli author_content do przechowywania treści sekcji strony o autorze
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

-- Indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_author_content_section_type ON author_content(section_type);
CREATE INDEX IF NOT EXISTS idx_author_content_section_order ON author_content(section_order);

-- Trigger do automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_author_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_author_content_updated_at
  BEFORE UPDATE ON author_content
  FOR EACH ROW
  EXECUTE FUNCTION update_author_content_updated_at();

-- Wstawienie domyślnych sekcji
INSERT INTO author_content (section_type, title, content, section_order, is_visible) VALUES
('hero', 'Jakub - Twój Przewodnik w Świecie Inwestycji', 'Witaj! Jestem Jakub, pasjonatem inwestycji z wieloletnim doświadczeniem na rynkach finansowych. Moją misją jest dzielenie się wiedzą i pomaganie innym w osiąganiu finansowej niezależności.', 1, true),
('experience', 'Doświadczenie', 'Ponad 8 lat doświadczenia w analizie rynków finansowych. Specjalizuję się w analizie fundamentalnej spółek, inwestycjach długoterminowych oraz strategiach dywersyfikacji portfela.', 2, true),
('education', 'Wykształcenie', 'Magister Ekonomii na Uniwersytecie Warszawskim, specjalizacja: Finanse i Bankowość. Certyfikat CFA Level II. Ukończone kursy z analizy technicznej i zarządzania ryzykiem.', 3, true),
('philosophy', 'Filozofia Inwestycyjna', 'Wierzę w długoterminowe inwestowanie oparte na solidnej analizie fundamentalnej. Kluczem do sukcesu jest dyscyplina, cierpliwość i systematyczne podejście do budowania portfela.', 4, true),
('achievements', 'Osiągnięcia', 'Autor ponad 200 analiz spółek. Średnia roczna stopa zwrotu z rekomendacji: 15.2%. Współpraca z największymi domami maklerskimi w Polsce. Regularny gość w programach finansowych.', 5, true),
('contact', 'Kontakt', 'Masz pytania? Chcesz nawiązać współpracę? Skontaktuj się ze mną przez formularz kontaktowy lub media społecznościowe. Odpowiadam na wszystkie wiadomości!', 6, true)
ON CONFLICT (section_type) DO NOTHING;
```

### 2. Konfiguracja Row Level Security (RLS)

```sql
-- Włączenie RLS
ALTER TABLE author_content ENABLE ROW LEVEL SECURITY;

-- Polityka odczytu - wszyscy mogą czytać widoczne sekcje
CREATE POLICY "Anyone can read visible author content" ON author_content
  FOR SELECT USING (is_visible = true);

-- Polityka zapisu - tylko uwierzytelnieni użytkownicy mogą edytować
CREATE POLICY "Authenticated users can update author content" ON author_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Polityka wstawiania - tylko uwierzytelnieni użytkownicy mogą dodawać
CREATE POLICY "Authenticated users can insert author content" ON author_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 🎨 Funkcjonalności

### Dla Wszystkich Użytkowników
- **Responsywny design** - Strona dostosowuje się do wszystkich urządzeń
- **Smooth scrolling** - Płynne przewijanie między sekcjami
- **Nawigacja sticky** - Nawigacja pozostaje na górze podczas przewijania
- **Animacje** - Subtelne animacje hover i przejść

### Dla Zalogowanych Administratorów
- **Edycja treści** - Możliwość edycji każdej sekcji przez modal
- **Automatyczne zapisywanie** - Zmiany są natychmiast zapisywane w bazie
- **Walidacja** - Sprawdzanie poprawności danych przed zapisem
- **Powiadomienia** - Toast notifications o statusie operacji

## 📁 Struktura Plików

```
app/o-autorze/
├── page.tsx                    # Główna strona (Server Component)

components/
├── author-page-client.tsx      # Komponent kliencki z logiką edycji
└── ui/
    ├── loading-card.tsx        # Komponent ładowania
    └── placeholder-author.svg  # Placeholder dla zdjęcia autora

sql/
└── create_author_content_table.sql  # Migracja bazy danych
```

## 🔧 Sekcje Strony

### 1. Hero Section
- **Główny nagłówek** z tytułem i opisem autora
- **Zdjęcie autora** (z fallback na placeholder)
- **Call-to-action buttons** - Kontakt i "Dowiedz się więcej"
- **Badge** z informacją o doświadczeniu

### 2. Experience (Doświadczenie)
- Opis doświadczenia zawodowego
- Specjalizacje i obszary ekspertyzy

### 3. Education (Wykształcenie)
- Wykształcenie formalne
- Certyfikaty i kursy
- Kwalifikacje zawodowe

### 4. Philosophy (Filozofia Inwestycyjna)
- Podejście do inwestowania
- Kluczowe zasady i wartości

### 5. Achievements (Osiągnięcia)
- **Statystyki** w formie kart:
  - Liczba analiz (200+)
  - Średnia stopa zwrotu (15.2%)
  - Lata doświadczenia (8+)
- Najważniejsze osiągnięcia

### 6. Contact (Kontakt)
- **Dane kontaktowe**:
  - Email
  - Telefon
  - Lokalizacja
- **Media społecznościowe**:
  - LinkedIn
  - Twitter
- **Przyciski CTA** do formularza kontaktowego

## 🎯 Call-to-Action Section

Sekcja zachęcająca do:
- Przejścia do bloga
- Skontaktowania się z autorem
- Dołączenia do społeczności

## 🔐 Bezpieczeństwo

- **RLS (Row Level Security)** - Kontrola dostępu na poziomie bazy danych
- **Uwierzytelnianie** - Tylko zalogowani użytkownicy mogą edytować
- **Walidacja** - Sprawdzanie danych po stronie klienta i serwera
- **Sanityzacja** - Bezpieczne wyświetlanie treści

## 🚀 Uruchomienie

1. **Wykonaj migrację bazy danych** (kod SQL powyżej)
2. **Zrestartuj aplikację** - `npm run dev`
3. **Przejdź do strony** - `http://localhost:3000/o-autorze`
4. **Zaloguj się** - Aby móc edytować treści
5. **Edytuj sekcje** - Kliknij ikonę edycji przy każdej sekcji

## 📱 Responsywność

Strona jest w pełni responsywna i dostosowana do:
- **Desktop** - Pełny layout z dwukolumnowym hero
- **Tablet** - Dostosowany layout z zachowaniem funkcjonalności
- **Mobile** - Jednkolumnowy layout z ukrytą nawigacją

## 🎨 Customizacja

### Zmiana kolorów
Kolory są zdefiniowane w `globals.css` i używają zmiennych CSS:
- `--primary` - Główny kolor (niebieski)
- `--accent` - Kolor akcentujący (zielony)
- `--foreground` - Kolor tekstu

### Dodanie nowych sekcji
1. Dodaj nową sekcję do bazy danych
2. Zaktualizuj `getSectionIcon()` w komponencie
3. Dodaj specjalną logikę renderowania (opcjonalnie)

### Zmiana zdjęcia autora
Umieść plik `author-photo.jpg` w folderze `public/images/`

## 🐛 Rozwiązywanie Problemów

### Błąd "Table 'author_content' doesn't exist"
- Wykonaj migrację SQL z sekcji "Konfiguracja Bazy Danych"

### Nie można edytować treści
- Sprawdź czy użytkownik jest zalogowany
- Sprawdź polityki RLS w Supabase

### Problemy z obrazami
- Sprawdź czy plik `author-photo.jpg` istnieje
- Fallback na `placeholder-author.svg` powinien działać automatycznie

## 📈 Przyszłe Rozszerzenia

- **Galeria zdjęć** - Dodanie galerii zdjęć z wydarzeń
- **Timeline** - Oś czasu z najważniejszymi momentami kariery
- **Testimoniale** - Opinie klientów i współpracowników
- **Blog posts** - Integracja z najnowszymi postami autora
- **Kalendarz** - Dostępność do konsultacji
- **Newsletter** - Formularz zapisu do newslettera 