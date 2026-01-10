-- Drop the overly permissive service update policy that exposes client data
DROP POLICY IF EXISTS "Service can update access requests" ON public.access_requests;