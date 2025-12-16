-- Allow admins to download any document from the documents bucket
CREATE POLICY "Admins can download all documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);