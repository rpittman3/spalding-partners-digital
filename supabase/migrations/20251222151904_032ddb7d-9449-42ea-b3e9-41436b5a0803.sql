-- Drop the restrictive policy
DROP POLICY IF EXISTS "Only service can manage access requests" ON public.access_requests;

-- Create policies that allow admins to manage access requests
CREATE POLICY "Admins can view access requests"
ON public.access_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update access requests"
ON public.access_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert access requests"
ON public.access_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service can update access requests"
ON public.access_requests
FOR UPDATE
USING (true);