-- This is a one-time setup script to create the initial admin user
-- Run this in the Supabase SQL editor

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Create the admin user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
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
    'admin@sp-financial.com',
    crypt('admin123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO admin_user_id;

  -- Create profile
  INSERT INTO public.profiles (id, email, first_name, last_name, is_main_user)
  VALUES (admin_user_id, 'admin@sp-financial.com', 'Admin', 'User', true);

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin');

  RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
END $$;
