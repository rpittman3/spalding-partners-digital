-- Enable RLS and policies for notification_status so clients can manage their own rows
ALTER TABLE public.notification_status ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own notification status
CREATE POLICY "Users view own notification status"
ON public.notification_status
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users update own notification status"
ON public.notification_status
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users insert own notification status"
ON public.notification_status
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admins can manage all
CREATE POLICY "Admins manage all notification status"
ON public.notification_status
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));