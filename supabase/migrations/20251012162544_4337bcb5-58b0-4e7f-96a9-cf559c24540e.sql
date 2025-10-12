-- Add is_active column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.profiles.is_active IS 'Controls whether a user can log in. When false, user is deactivated.';