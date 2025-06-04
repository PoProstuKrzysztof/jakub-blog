-- Test posts for the blog
-- Run this in Supabase SQL Editor to add some test data

-- Create RPC function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_slug text)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql;

-- First, let's create some categories
INSERT INTO categories (name, slug, description, color) VALUES
('Analiza spółek', 'analiza-spolek', 'Analizy fundamentalne i techniczne spółek giełdowych', '#3B82F6'),
('Kryptowaluty', 'kryptowaluty', 'Wszystko o rynku kryptowalut', '#F59E0B'),
('Edukacja', 'edukacja', 'Materiały edukacyjne z zakresu inwestowania', '#10B981'),
('Makroekonomia', 'makroekonomia', 'Analiza sytuacji makroekonomicznej', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

-- Create some tags
INSERT INTO tags (name, slug, description, color) VALUES
('Analiza fundamentalna', 'analiza-fundamentalna', 'Posty dotyczące analizy fundamentalnej', '#3B82F6'),
('Giełda', 'gielda', 'Posty o giełdzie papierów wartościowych', '#EF4444'),
('Bitcoin', 'bitcoin', 'Posty o Bitcoin', '#F59E0B'),
('Ethereum', 'ethereum', 'Posty o Ethereum', '#6366F1'),
('Inwestowanie', 'inwestowanie', 'Ogólne posty o inwestowaniu', '#10B981'),
('Portfel', 'portfel', 'Zarządzanie portfelem inwestycyjnym', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

-- Insert test posts
INSERT INTO posts (
  title, 
  slug, 
  excerpt, 
  content, 
  featured_image_url, 
  status, 
  published_at, 
  is_featured,
  view_count,
  allow_comments
) VALUES
(
  'Analiza fundamentalna spółki PKN Orlen - Q3 2024',
  'analiza-pkn-orlen-q3-2024',
  'Szczegółowa analiza wyników finansowych największej polskiej spółki paliwowej wraz z prognozami na kolejne kwartały i oceną potencjału inwestycyjnego.',
  '<h2>Wprowadzenie</h2><p>PKN Orlen to największa polska spółka paliwowa, która w ostatnich kwartałach przechodzi przez znaczące zmiany strukturalne...</p><h2>Kluczowe wskaźniki finansowe</h2><p>W trzecim kwartale 2024 roku PKN Orlen osiągnął:</p><ul><li><strong>Przychody</strong>: 45,2 mld PLN (wzrost o 8% r/r)</li><li><strong>EBITDA</strong>: 3,8 mld PLN (spadek o 12% r/r)</li><li><strong>Zysk netto</strong>: 1,2 mld PLN (spadek o 25% r/r)</li></ul>',
  '/placeholder.jpg',
  'published',
  '2024-12-01T10:00:00Z',
  true,
  1250,
  true
),
(
  'Trendy na rynku kryptowalut - Grudzień 2024',
  'trendy-kryptowaluty-grudzien-2024',
  'Przegląd najważniejszych wydarzeń na rynku kryptowalut i analiza potencjalnych kierunków rozwoju w nadchodzącym roku.',
  '<h2>Sytuacja na rynku</h2><p>Rynek kryptowalut w grudniu 2024 roku charakteryzuje się zwiększoną zmiennością...</p>',
  '/placeholder.jpg',
  'published',
  '2024-11-28T14:30:00Z',
  false,
  890,
  true
),
(
  'Jak czytać sprawozdania finansowe - Poradnik',
  'jak-czytac-sprawozdania-finansowe',
  'Kompleksowy przewodnik po sprawozdaniach finansowych z praktycznymi przykładami i wskazówkami dla początkujących inwestorów.',
  '<h2>Podstawy</h2><p>Sprawozdania finansowe to podstawowe narzędzie analizy każdej spółki giełdowej...</p>',
  '/placeholder.jpg',
  'published',
  '2024-11-25T09:15:00Z',
  false,
  2100,
  true
),
(
  'Sektor bankowy - perspektywy na 2025',
  'sektor-bankowy-perspektywy-2025',
  'Analiza kondycji polskiego sektora bankowego i prognozy na nadchodzący rok z uwzględnieniem zmian regulacyjnych.',
  '<h2>Obecna sytuacja</h2><p>Polski sektor bankowy w 2024 roku charakteryzował się stabilnym wzrostem...</p>',
  '/placeholder.jpg',
  'published',
  '2024-11-20T16:45:00Z',
  false,
  756,
  true
),
(
  'Strategie inwestycyjne w czasach inflacji',
  'strategie-inwestycyjne-inflacja',
  'Jak chronić kapitał i generować zyski w okresie wysokiej inflacji. Praktyczne porady i strategie dla inwestorów.',
  '<h2>Wyzwania inflacyjne</h2><p>Inflacja stanowi jedno z największych wyzwań dla współczesnych inwestorów...</p>',
  '/placeholder.jpg',
  'published',
  '2024-11-15T11:20:00Z',
  true,
  1340,
  true
);

-- Link posts to categories
INSERT INTO post_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE (p.slug = 'analiza-pkn-orlen-q3-2024' AND c.slug = 'analiza-spolek')
   OR (p.slug = 'trendy-kryptowaluty-grudzien-2024' AND c.slug = 'kryptowaluty')
   OR (p.slug = 'jak-czytac-sprawozdania-finansowe' AND c.slug = 'edukacja')
   OR (p.slug = 'sektor-bankowy-perspektywy-2025' AND c.slug = 'analiza-spolek')
   OR (p.slug = 'strategie-inwestycyjne-inflacja' AND c.slug = 'edukacja')
ON CONFLICT DO NOTHING;

-- Link posts to tags
INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p, tags t
WHERE (p.slug = 'analiza-pkn-orlen-q3-2024' AND t.slug IN ('analiza-fundamentalna', 'gielda'))
   OR (p.slug = 'trendy-kryptowaluty-grudzien-2024' AND t.slug IN ('bitcoin', 'ethereum'))
   OR (p.slug = 'jak-czytac-sprawozdania-finansowe' AND t.slug IN ('analiza-fundamentalna', 'inwestowanie'))
   OR (p.slug = 'sektor-bankowy-perspektywy-2025' AND t.slug IN ('analiza-fundamentalna', 'gielda'))
   OR (p.slug = 'strategie-inwestycyjne-inflacja' AND t.slug IN ('inwestowanie', 'portfel'))
ON CONFLICT DO NOTHING; 