# Instrukcje naprawy triggera user profile

## Problem
Po rejestracji nowego konta wyskakuje błąd:
```
ERROR: new row for relation "profiles" violates check constraint "profiles_role_check" (SQLSTATE 23514)
```

## Przyczyna
1. **Funkcja `handle_new_user()`** była ustawiona na tworzenie profili z rolą `'user'`
2. **Check constraint `profiles_role_check`** dozwalał tylko: `'admin'`, `'editor'`, `'author'` - **bez `'user'`**
3. **Aplikacja TypeScript używa typu `'user'`** ale baza danych nie miała tej wartości w ograniczeniach

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

-- Sprawdź check constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE t.relname = 'profiles' 
    AND n.nspname = 'public'
    AND c.contype = 'c';
```

### 2. Napraw check constraint (już zrobione):

```sql
-- Usuń stary constraint (ograniczał do admin, editor, author)
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;

-- Dodaj nowy constraint z wartością 'user'
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'editor'::text, 'author'::text, 'user'::text]));
```

### 3. Poprawna funkcja triggera (już zaktualizowana):

```sql
-- Poprawiona funkcja triggera
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utwórz trigger (jeśli nie istnieje)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4. Sprawdź istniejące profile:

```sql
-- Zobacz istniejące profile
SELECT id, username, role, is_active, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
```

### 5. Jeśli potrzebujesz zmienić rolę konkretnego użytkownika:

```sql
-- Zmień rolę konkretnego użytkownika na admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_HERE';

-- Lub zmień na author
UPDATE public.profiles 
SET role = 'author' 
WHERE id = 'USER_ID_HERE';

-- Lub zmień na editor
UPDATE public.profiles 
SET role = 'editor' 
WHERE id = 'USER_ID_HERE';
```

## Zmiany w kodzie:

1. ✅ **Poprawiono check constraint** - dodano wartość `'user'` do dozwolonych ról
2. ✅ **Poprawiono funkcję triggera** - nowi użytkownicy są teraz tworzeni z rolą `'user'`
3. ✅ **Trigger automatycznie tworzy profil** dla każdego nowego użytkownika
4. ✅ **Kod aplikacji nie ingeruje** w tworzenie profili - pozostawia to triggerowi

## Hierarchia ról:
- `'user'` - domyślna rola dla nowych użytkowników (dostęp do `/panel`)
- `'editor'` - może edytować treści
- `'author'` - może tworzyć posty (dostęp do `/admin`)  
- `'admin'` - pełne uprawnienia administratora (dostęp do `/admin`)

## Dozwolone wartości w bazie danych:
Check constraint `profiles_role_check` dozwala: `'admin'`, `'editor'`, `'author'`, `'user'`

## Test:

Po zastosowaniu zmian:
1. Zarejestruj nowe konto
2. Sprawdź w bazie czy profil został utworzony z rolą `'user'`
3. Sprawdź czy przekierowanie do `/panel` działa poprawnie

## Historia zmian:
- **2025-01-XX**: ✅ **Poprawiono check constraint** - dodano `'user'` do dozwolonych wartości
- **2025-01-XX**: ✅ **Poprawiono trigger** - zmieniono domyślną rolę na `'user'`
- **Wcześniej**: ❌ Funkcja tworzyła użytkowników z rolą `'author'`, ale constraint nie dozwalał `'user'` 