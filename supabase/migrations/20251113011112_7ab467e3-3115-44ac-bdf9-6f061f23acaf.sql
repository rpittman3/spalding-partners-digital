-- Add bio and phone fields to staff table
ALTER TABLE public.staff 
ADD COLUMN bio text,
ADD COLUMN phone text;