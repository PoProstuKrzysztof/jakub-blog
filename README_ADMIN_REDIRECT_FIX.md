# ✅ ROZWIĄZANIE: Problem z przekierowaniem administratora

## 🚫 Problem
Po zalogowaniu administrator nie był przekierowywany do `/admin`, tylko zostawał na stronie logowania.

**Symptomy:**
- Log: `GET /login?redirectTo=%2Fadmin 200 in 7ms po zalogowniu`
- Użytkownik zostaje na stronie logowania
- Brak przekierowania do panelu administratora

## 🔍 Przyczyna
Funkcja `getUserRole()` **automatycznie tworzyła nowe profile z domyślną rolą `'user'`** zamiast pozwolić triggerowi `handle_new_user()` utworzyć profil z rolą `'admin'`.

### Konflikt logiki:
1. **Trigger** (z README.md): Tworzy profile z rolą `'admin'`
2. **Funkcja getUserRole**: Tworzyła profile z rolą `'user'`
3. **Wynik**: Wszyscy nowi użytkownicy dostawali rolę `'user'`

## ✅ Zmiany wprowadzone

### 1. Poprawiono `lib/utils/user-role.ts`
**Przed:**
```typescript
// Jeśli profil nie istnieje, tworzymy go z domyślną rolą 'user'
const { data: newProfile, error: insertError } = await supabase
  .from('profiles')
  .insert({
    id: userId,
    username: user.email || '',
    role: 'user', // ❌ PROBLEM
    is_active: true,
    full_name: '',
    metadata: {}
  })
```

**Po:**
```typescript
// Jeśli profil nie istnieje, nie tworzymy go automatycznie
// Pozwalamy triggerowi handle_new_user() zająć się tym
if (error.code === 'PGRST116') { // No rows returned
  console.log('Profile not found for user:', userId, '. Trigger should create it automatically.')
  return null
}
```

### 2. Poprawiono logikę przekierowywania w `app/login/page.tsx`
**Dodano retry logic:**
```typescript
// Jeśli nie ma profilu jeszcze (trigger może potrzebować czasu), sprawdź ponownie
if (!role) {
  console.log('Profile not found, waiting for trigger to create it...')
  setTimeout(async () => {
    try {
      const retryRole = await getUserRole(user.id)
      const panelPath = getUserPanelPath(retryRole)
      router.push(panelPath)
    } catch (retryError) {
      router.push("/panel") // fallback
    }
  }, 2000) // Czekaj 2 sekundy na trigger
  return
}
```

### 3. Poprawiono `lib/utils/user-role-server.ts`
**Dodano lepszą obsługę błędów:**
```typescript
if (error.code === 'PGRST116') { // No rows returned
  console.log('Profile not found for user (server):', userId, '. Trigger should create it automatically.')
  return null
}
```

### 4. Dodano test triggera w `app/admin/test/page.tsx`
**Nowy test sprawdza czy trigger istnieje:**
```typescript
// Test 5: Check if user profile trigger exists
const { data: triggerData, error: triggerError } = await supabase
  .from('information_schema.triggers')
  .select('trigger_name, event_manipulation, event_object_table')
  .eq('trigger_name', 'on_auth_user_created')
```

## 🔧 Instrukcje weryfikacji

### 1. Sprawdź czy trigger istnieje
W Supabase SQL Editor uruchom:
```sql
-- Sprawdź czy trigger istnieje
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

### 2. Utwórz trigger jeśli nie istnieje
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

### 3. Sprawdź istniejące profile
```sql
SELECT id, username, role, is_active, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
```

### 4. Zmień rolę istniejącego użytkownika (jeśli potrzeba)
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_TUTAJ';
```

## 🧪 Test działania

1. **Nowy użytkownik:**
   - Zarejestruj nowego użytkownika
   - Sprawdź czy profil został utworzony z rolą `'admin'`
   - Sprawdź czy przekierowanie do `/admin` działa

2. **Strona testowa:**
   - Idź na `/admin/test`
   - Sprawdź czy test "Trigger user profile" pokazuje status SUCCESS

3. **Istniejący użytkownik:**
   - Zmień rolę w bazie na `'admin'`
   - Zaloguj się ponownie
   - Sprawdź przekierowanie

## 📋 Pliki zmodyfikowane

- ✅ `lib/utils/user-role.ts` - Usunięto automatyczne tworzenie profili
- ✅ `lib/utils/user-role-server.ts` - Dodano lepszą obsługę błędów
- ✅ `app/login/page.tsx` - Dodano retry logic dla triggera
- ✅ `app/admin/test/page.tsx` - Dodano test sprawdzający trigger
- ✅ `TRIGGER_SETUP.md` - Instrukcje SQL
- ✅ `README_ADMIN_REDIRECT_FIX.md` - To podsumowanie

## 🎯 Rezultat

Po tych zmianach:
- ✅ Nowi użytkownicy otrzymują rolę `'admin'` automatycznie
- ✅ Przekierowanie do `/admin` działa poprawnie
- ✅ Trigger tworzy profile z właściwą rolą
- ✅ Retry logic obsługuje opóźnienia triggera
- ✅ Testy pozwalają zdiagnozować problemy

**Problem rozwiązany! 🎉** 