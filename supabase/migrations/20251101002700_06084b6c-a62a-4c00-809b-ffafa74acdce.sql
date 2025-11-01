-- Enable Row Level Security on client_imports table
ALTER TABLE public.client_imports ENABLE ROW LEVEL SECURITY;

-- Create admin-only policies for client_imports
CREATE POLICY "Admins can view all client imports"
ON public.client_imports
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert client imports"
ON public.client_imports
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update client imports"
ON public.client_imports
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete client imports"
ON public.client_imports
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));