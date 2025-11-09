-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create staff table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_path TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Admin can manage staff
CREATE POLICY "Admins manage staff"
ON public.staff
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view active staff
CREATE POLICY "Everyone can view active staff"
ON public.staff
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policy for staff photos (using existing team-photos bucket)
CREATE POLICY "Admins can upload staff photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'team-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update staff photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'team-photos'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete staff photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-photos'
  AND has_role(auth.uid(), 'admin'::app_role)
);