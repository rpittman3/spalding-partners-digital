-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "View notification categories" ON public.notification_categories;

-- Create a simpler SELECT policy for clients
-- Clients don't need direct access to notification_categories junction table
-- They access notifications through the notifications table policies
CREATE POLICY "Clients view notification categories"
ON public.notification_categories
FOR SELECT
USING (true);