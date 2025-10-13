-- Fix recursion by removing deadlines reference from deadline_categories SELECT policy
DROP POLICY IF EXISTS "Clients view deadline categories" ON public.deadline_categories;

CREATE POLICY "Clients view own or ALL deadline categories"
ON public.deadline_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_categories uc
    WHERE uc.category_id = deadline_categories.category_id
      AND uc.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM categories c
    WHERE c.id = deadline_categories.category_id
      AND c.name = 'ALL'
  )
);
