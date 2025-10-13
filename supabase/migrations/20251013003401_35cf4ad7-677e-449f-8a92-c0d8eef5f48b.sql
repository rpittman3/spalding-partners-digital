-- Drop the existing problematic policies
DROP POLICY IF EXISTS "View deadlines by category" ON public.deadlines;
DROP POLICY IF EXISTS "Admins manage deadlines" ON public.deadlines;

-- Create separate policies for each operation to avoid recursion
-- Admins can do everything
CREATE POLICY "Admins can select deadlines"
ON public.deadlines
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert deadlines"
ON public.deadlines
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update deadlines"
ON public.deadlines
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete deadlines"
ON public.deadlines
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Clients can only SELECT deadlines based on their categories
CREATE POLICY "Clients view deadlines by category"
ON public.deadlines
FOR SELECT
USING (
  has_role(auth.uid(), 'client'::app_role) 
  AND (
    EXISTS (
      SELECT 1
      FROM deadline_categories dc
      JOIN user_categories uc ON dc.category_id = uc.category_id
      WHERE dc.deadline_id = deadlines.id 
        AND uc.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1
      FROM deadline_categories dc
      JOIN categories c ON dc.category_id = c.id
      WHERE dc.deadline_id = deadlines.id 
        AND c.name = 'ALL'
    )
  )
);