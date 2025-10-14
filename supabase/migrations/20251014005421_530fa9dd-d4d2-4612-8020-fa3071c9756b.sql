-- Add columns to meeting_requests table for admin management
ALTER TABLE public.meeting_requests 
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS appointment_set boolean DEFAULT false;

-- Update RLS policies for meeting_requests (recreate to ensure no recursion)
DROP POLICY IF EXISTS "Admins view all meeting requests" ON public.meeting_requests;
DROP POLICY IF EXISTS "Admins update meeting requests" ON public.meeting_requests;

-- Create policies using the has_role function to avoid recursion
CREATE POLICY "Admins view all meeting requests" 
ON public.meeting_requests
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage meeting requests" 
ON public.meeting_requests
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_meeting_requests_status 
ON public.meeting_requests(status, is_archived);