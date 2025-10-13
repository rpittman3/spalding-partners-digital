-- Enable RLS on deadline_categories and add policies for admins
ALTER TABLE public.deadline_categories ENABLE ROW LEVEL SECURITY;

-- Admins can manage all deadline categories
CREATE POLICY "Admins manage deadline categories"
ON public.deadline_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Clients can view deadline categories for deadlines they can see
CREATE POLICY "Clients view deadline categories"
ON public.deadline_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deadlines d
    WHERE d.id = deadline_categories.deadline_id
  )
);