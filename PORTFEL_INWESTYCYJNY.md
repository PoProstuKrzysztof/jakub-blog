# Plan implementacji funkcjonalności "Portfel autora"

## 1. Analiza wymagań biznesowych
1. Zdefiniuj persony: **użytkownik** (klient) vs **autor** (twórca).  
2. Określ dokładne przypadki użycia: zakup produktu, dostęp do sekcji "Portfel autora", publikacja nowych analiz/portfela przez autora, powiadomienia.
3. **Identyfikacja użytkownika bez rejestracji** – system nie posiada formularza rejestracji. Użytkownik jest tworzony automatycznie po opłaceniu produktu (na podstawie e-maila z bramki płatności) i otrzymuje **magic-link** (Supabase) do ustawienia hasła.

### Flow "pierwszy zakup" (happy path)
   1. Użytkownik klika "Kup dostęp".  
   2. Przekierowanie do Checkout (Stripe).  
   3. Po `checkout.session.completed` webhook:
      - Sprawdza czy email istnieje w `auth.users`.  
      - Jeśli **nie istnieje**: tworzy konto `supabase.auth.admin.createUser()` z `email_confirm` = true i generuje `magic_link` (lub tymczasowe hasło).  
      - Tworzy rekord w `orders` (status = paid).  
      - Wysyła e-mail z linkiem do logowania i instrukcją.
   4. Po kliknięciu linku użytkownik loguje się i widzi sekcję "Portfel autora".
   5. Kolejne zakupy używają istniejącego `user_id`.

## 2. Projekt bazy danych (Supabase/PostgreSQL) ✅ ZREALIZOWANO
_Schemat oraz polityki RLS zostały dodane do pliku `supabase/sql/20240617_portfolio_schema.sql`._
1. **Tabela `products`** — lista płatnych produktów (np. dostęp "Portfel autora").
2. **Tabela `orders`** — zakupione produkty przez użytkowników.  
   • `user_id` → `auth.users.id`  
   • `product_id` → `products.id`  
   • status (paid, refund, cancelled)  
   • `expires_at` (jeżeli dostęp czasowy).
3. **Tabela `author_portfolio`** — aktualny stan portfela.  
   • `id`, `created_at`, `description`, `json_data` (skład portfela, wagi, wyniki)  
   • `is_active` (TINYINT) — tylko jeden rekord aktywny.
4. **Tabela `author_analyses`** — szczegółowe analizy/raporty.  
   • `title`, `content`, `attachment_url`, `created_at`.
5. **Tabela `notifications`** — komunikaty push/e-mail.  
   • `user_id`, `message`, `read_at`.

> Wszystkie tabele w schemacie `public` z RLS.  
> 🔒 Polityki: tylko właściciel `orders.user_id` ma SELECT, INSERT; autor ma pełny dostęp do `author_*`.

## 3. Integracja płatności ✅ ZREALIZOWANO
_Implementacja: `lib/actions/purchase-actions.ts`, `app/api/payments/webhook/route.ts`, `lib/services/stripe.ts`, `lib/supabase-admin.ts`, zmiana `package.json`._

## 4. Uprawnienia i role ✅ ZREALIZOWANO
_Dodano logikę w `middleware.ts` do ochrony trasy `/portfel-autora` (walidacja zakupu) oraz odtworzono ochronę tras administracyjnych._
1. **Domyślne role Supabase**:  
   • `authenticated` — użytkownicy po zakupie.  
   • `author` — rola przypisana ręcznie administratorom.  
2. W Next.js wykorzystaj `useAuth()` + middleware do ochrony trasy `/portfel-autora`.

## 5. Backend (Server Actions & Edge Functions) ✅ ZREALIZOWANO
_Wdrożono pliki `lib/actions/portfolio-actions.ts` oraz funkcję Edge `supabase/functions/notify_new_analysis`. Dodano Redis caching i broadcast Realtime._
1. `lib/actions/purchase-actions.ts`  
   • `createCheckoutSession(productId)` — zwraca URL Stripe.  
2. `lib/actions/portfolio-actions.ts`  
   • `getActivePortfolio()` — cached (Redis).  
   • `listAnalyses()` — paginacja.
3. Edge Function `notify_new_analysis.ts`  
   • Wywoływana triggerem DB przy INSERT na `author_analyses`.  
   • Publikuje wiadomość w Supabase Realtime kanał `analyses`.

## 6. Frontend (App Router) ✅ ZREALIZOWANO
_Utworzono stronę `app/portfel-autora/page.tsx` oraz komponenty w `components/portfolio/*` (chart, card, feed z subskrypcją Realtime)._
1. **Strona `/portfel-autora`**  
   • Server Component: pobiera `getActivePortfolio()` (RSC).  
   • Klient podstrona "Analizy" z subskrypcją Realtime → pokazuje badge "Nowe".
2. **Componenty UI**:  
   • `portfolio-chart.tsx` — Chart.js (lazy load).  
   • `analysis-card.tsx` — karta analizy.

## 7. Panel twórcy (`/admin/portfel`) ✅ ZREALIZOWANO
_Formularze publikacji portfela i analiz z akcjami serwerowymi (`admin-portfolio-actions.ts`), UI TipTap można dodać później._

## 8. Powiadomienia użytkowników ✅ ZREALIZOWANO
_Edge Function broadcast + klient `AnalysesFeed` wyświetla badge i toast z `useToast`._

## 9. Caching & Performance
1. Redis: cache `author_portfolio` 60 s.  
2. ISR (`revalidatePath('/portfel-autora')`) po aktualizacji.

## 10. Bezpieczeństwo
1. Walidacja schematów (Zod) dla wszystkich Server Actions.  
2. CSP: zezwól na Stripe, Chart.js CDN.  
3. Testy penetracyjne: upewnij się brak dostępu do `author_portfolio` bez zakupu.

## 11. Testy i QA
1. **Unit**: działania na DB (vitest + supabase-js mock).  
2. **E2E**: Cypress — scenariusz zakupu i dostępu.  
3. **Smoke**: endpoint health, webhook, realtime.

## 12. Deployment & Monitoring
1. Vercel preview → staging DB.  
2. Alerty na błędy Edge Functions (Sentry).  
3. Metryki: Supabase log drains → Grafana.

---
📌 **Następny krok**: tworzenie schematów DB i polityk RLS w Supabase. 