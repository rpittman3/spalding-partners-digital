-- Create enum for public resource types
CREATE TYPE public.public_resource_type AS ENUM ('url', 'pdf');

-- Create enum for public resource categories
CREATE TYPE public.public_resource_category AS ENUM ('tax_resources', 'guides_articles');

-- Create public_resources table for the Resources page
CREATE TABLE public.public_resources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category public_resource_category NOT NULL,
    resource_type public_resource_type NOT NULL,
    url TEXT, -- For external links
    file_path TEXT, -- For uploaded PDFs
    file_name TEXT, -- Original file name for PDFs
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_resources ENABLE ROW LEVEL SECURITY;

-- Admins can manage all resources
CREATE POLICY "Admins manage public resources"
ON public.public_resources
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view active resources (public page)
CREATE POLICY "Everyone can view active public resources"
ON public.public_resources
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_public_resources_updated_at
BEFORE UPDATE ON public.public_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for public resource PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('public-resources', 'public-resources', true);

-- Storage policies for public-resources bucket
CREATE POLICY "Public can view resource PDFs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'public-resources');

CREATE POLICY "Admins can upload resource PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'public-resources' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update resource PDFs"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'public-resources' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete resource PDFs"
ON storage.objects
FOR DELETE
USING (bucket_id = 'public-resources' AND has_role(auth.uid(), 'admin'::app_role));