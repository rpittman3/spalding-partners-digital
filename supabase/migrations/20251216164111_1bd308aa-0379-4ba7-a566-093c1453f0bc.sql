-- Allow admins to download any file from the client-documents bucket
CREATE POLICY "Admins can download client documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'client-documents'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);