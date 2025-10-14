-- Add RLS policies for audit_logs table
-- Only admins should be able to view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow system to insert audit logs (for triggers and functions)
CREATE POLICY "System can insert audit logs" 
ON public.audit_logs
FOR INSERT 
WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON public.audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
ON public.audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type 
ON public.audit_logs(entity_type);