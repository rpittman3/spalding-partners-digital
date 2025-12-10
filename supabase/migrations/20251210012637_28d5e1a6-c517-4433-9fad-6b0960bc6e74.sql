-- Fix function search path mutable warning for set_document_expiration
CREATE OR REPLACE FUNCTION public.set_document_expiration()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := NEW.uploaded_at + INTERVAL '1 year';
  END IF;
  NEW.purge_at := NEW.expires_at + INTERVAL '3 months';
  RETURN NEW;
END;
$function$;