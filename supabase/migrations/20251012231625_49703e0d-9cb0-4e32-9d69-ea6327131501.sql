-- Drop policies from wrong bucket
DROP POLICY IF EXISTS "Users can download their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can access all documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;

-- Create policies for client-documents bucket
CREATE POLICY "Users can download their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can access all documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'client-documents' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);