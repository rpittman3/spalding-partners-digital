-- Add city, state, zip fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN city text,
ADD COLUMN state text,
ADD COLUMN zip text;