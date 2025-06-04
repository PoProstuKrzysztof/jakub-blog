-- Skrypt do utworzenia konta administratora w Supabase
-- Wykonaj to w Supabase SQL Editor

-- 1. Utwórz użytkownika administratora
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com', -- ZMIEŃ NA SWÓJ EMAIL
  crypt('your_secure_password', gen_salt('bf')), -- ZMIEŃ NA SWOJE HASŁO
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 2. Utwórz identyfikator w auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'), -- ZMIEŃ NA SWÓJ EMAIL
  format('{"sub": "%s", "email": "%s"}', (SELECT id FROM auth.users WHERE email = 'admin@example.com'), 'admin@example.com')::jsonb,
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- Sprawdź czy użytkownik został utworzony
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@example.com'; 