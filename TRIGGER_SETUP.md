# Instrukcje naprawy triggera user profile

## Problem
Po zalogowaniu administrator nie jest przekierowywany do `/admin` tylko zostaje na stronie logowania.

## Przyczyna
Funkcja `getUserRole` tworzyła profile z domyślną rolą `'user'` zamiast pozwolić triggerowi `handle_new_user()` utworzyć profil z rolą `'admin'`.

## Rozwiązanie

### 1. Sprawdź czy trigger istnieje w Supabase SQL Editor:

```sql
-- Sprawdź czy trigger istnieje
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Sprawdź czy funkcja istnieje
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

### 2. Jeśli trigger nie istnieje, utwórz go:

```sql
-- Utwórz funkcję triggera
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'admin',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utwórz trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 3. Sprawdź istniejące profile:

```sql
-- Zobacz istniejące profile
SELECT id, username, role, is_active, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
```

### 4. Jeśli potrzebujesz zmienić rolę istniejącego użytkownika:

```sql
-- Zmień rolę konkretnego użytkownika na admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_HERE';
```

## Zmiany w kodzie (już zrobione):

1. ✅ Usunięto automatyczne tworzenie profili z funkcji `getUserRole`
2. ✅ Dodano retry logic w komponencie logowania
3. ✅ Poprawiono obsługę błędów w `getUserRoleServer`

## Test:

Po zastosowaniu zmian:
1. Zaloguj się jako użytkownik
2. Sprawdź w bazie czy profil został utworzony z rolą `'admin'`
3. Sprawdź czy przekierowanie do `/admin` działa poprawnie 