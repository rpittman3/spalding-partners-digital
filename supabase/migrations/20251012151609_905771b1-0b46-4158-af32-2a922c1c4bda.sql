-- Add foreign key constraint from user_roles.user_id to profiles.id
-- This allows joining user_roles with profiles
ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
ADD CONSTRAINT user_roles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Add self-referencing foreign key for parent_user_id in profiles
-- This allows querying parent user information
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_parent_user_id_fkey,
ADD CONSTRAINT profiles_parent_user_id_fkey 
  FOREIGN KEY (parent_user_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;