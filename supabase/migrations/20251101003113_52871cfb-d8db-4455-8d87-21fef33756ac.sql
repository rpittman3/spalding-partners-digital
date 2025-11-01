-- Fix Critical Security Issues: Enable RLS on unprotected tables

-- 1. Enable RLS on access_requests table (CRITICAL - prevents access code theft)
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service can manage access requests"
ON public.access_requests
FOR ALL
USING (false);

-- 2. Enable RLS on audit_logs_archive table
ALTER TABLE public.audit_logs_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view archived audit logs"
ON public.audit_logs_archive
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Enable RLS on activity tracking tables
ALTER TABLE public.deadline_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;

-- Policies for deadline_views
CREATE POLICY "Users view own deadline activity"
ON public.deadline_views
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins view all deadline activity"
ON public.deadline_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users insert own deadline views"
ON public.deadline_views
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policies for resource_views
CREATE POLICY "Users view own resource activity"
ON public.resource_views
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins view all resource activity"
ON public.resource_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users insert own resource views"
ON public.resource_views
FOR INSERT
WITH CHECK (user_id = auth.uid());