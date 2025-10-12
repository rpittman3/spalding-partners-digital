-- Add RLS policies for notification_categories table
ALTER TABLE public.notification_categories ENABLE ROW LEVEL SECURITY;

-- Admins can manage notification categories
CREATE POLICY "Admins manage notification categories"
ON public.notification_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Clients can view notification categories for their accessible notifications
CREATE POLICY "View notification categories"
ON public.notification_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM notification_categories nc
    JOIN user_categories uc ON nc.category_id = uc.category_id
    WHERE nc.notification_id = notification_categories.notification_id
    AND uc.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1
    FROM notification_categories nc
    JOIN categories c ON nc.category_id = c.id
    WHERE nc.notification_id = notification_categories.notification_id
    AND c.name = 'ALL'
  )
);