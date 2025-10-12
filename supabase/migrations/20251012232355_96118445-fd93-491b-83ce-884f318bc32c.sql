-- Update the policy to allow clients to extend their document expiration
DROP POLICY IF EXISTS "Clients can mark their documents as seen" ON documents;

CREATE POLICY "Clients can update their documents"
ON documents
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());