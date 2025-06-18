-- Supabase schema for "Portfel autora"
-- Created: 2024-06-17

-- 1. Products --------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null,
  currency text not null default 'PLN',
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Public read access (bez RLS – katalog produktów jest jawny)
alter table products enable row level security;
create policy "Public read" on products for select using (true);

-- Dodanie przykładowego produktu
insert into products (name, slug, description, price_cents, currency, is_active) 
values ('Dostęp do Portfela Autora', 'portfolio-access', 'Miesięczny dostęp do portfela inwestycyjnego autora', 4900, 'PLN', true)
on conflict (slug) do nothing;

-- 2. Orders ---------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  status text not null check (status in ('paid','refunded','cancelled')),
  price_cents integer not null,
  currency text not null default 'PLN',
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

alter table orders enable row level security;

create policy "Own orders: read" on orders for select using (auth.uid() = user_id);
create policy "Own orders: insert" on orders for insert with check (auth.uid() = user_id);

-- 3. Author portfolio (bieżący skład portfela) -----------------------------
create table if not exists author_portfolio (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null, -- Nullable
  created_at timestamp with time zone default now(),
  description text,
  json_data jsonb not null, -- { "ticker": weight, ... }
  is_active boolean not null default true
);

alter table author_portfolio enable row level security;
-- Jeden rekord aktywny w danym czasie
create unique index if not exists author_portfolio_one_active on author_portfolio (is_active) where (is_active = true);

-- Helper function: sprawdza, czy użytkownik zakupił produkt o danym slugu
create or replace function has_product(p_slug text)
returns boolean language sql stable as $$
  select exists (
    select 1 from orders o
    join products p on p.id = o.product_id
    where o.user_id = auth.uid()
      and o.status = 'paid'
      and (o.expires_at is null or o.expires_at > now())
      and p.slug = p_slug
  );
$$;

-- Dostęp SELECT dla użytkowników, którzy kupili produkt "portfolio-access"
create policy "Portfolio: dostęp dla kupujących" on author_portfolio
  for select using (
    has_product('portfolio-access')
  );
-- Pełny dostęp dla autora (rola w kolumnie profiles.role = 'admin')
create policy "Portfolio: autor" on author_portfolio
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','author'))
  ) with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','author'))
  );

-- 4. Author analyses -------------------------------------------------------
create table if not exists author_analyses (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null, -- Nullable
  title text not null,
  content text,
  attachment_url text,
  created_at timestamp with time zone default now(),
  is_published boolean not null default true
);

alter table author_analyses enable row level security;

-- Read: tylko kupujący lub autor
create policy "Analizy: kupujący" on author_analyses
  for select using (
    has_product('portfolio-access') or exists (select 1 from profiles where id = auth.uid() and role in ('admin','author'))
  );
-- Write: tylko autor
create policy "Analizy: autor zarządza" on author_analyses
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','author'))
  ) with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin','author'))
  );

-- 5. Notifications ---------------------------------------------------------
create table if not exists notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table notifications enable row level security;

create policy "Powiadomienia: dostęp właściciela" on notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6. Przykładowe dane dla rozwoju ------------------------------------------
-- Dodanie przykładowego portfela (tylko jeśli nie istnieje aktywny)
do $$
begin
  if not exists (select 1 from author_portfolio where is_active = true) then
    insert into author_portfolio (description, json_data, is_active, author_id)
    values (
      'Przykładowy portfel inwestycyjny - mix akcji amerykańskich i gotówki',
      '{
        "AAPL": 0.25,
        "GOOGL": 0.15,
        "MSFT": 0.20,
        "TSLA": 0.10,
        "CASH": 0.30
      }'::jsonb,
      true,
      null
    );
  end if;
end $$;

-- Finished schema --------------------------------------------------------- 