-- Allow clients to update is_seen_by_client on their own documents
CREATE POLICY "Clients can mark their documents as seen"
ON documents
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());