-- Storage policies for client-documents bucket

-- Allow admins to insert/upload documents
CREATE POLICY "Admins can upload to client-documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to view all documents
CREATE POLICY "Admins can view all client documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow clients to view their own documents (files in their folder)
CREATE POLICY "Clients can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow clients to upload to their own folder
CREATE POLICY "Clients can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'client-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);