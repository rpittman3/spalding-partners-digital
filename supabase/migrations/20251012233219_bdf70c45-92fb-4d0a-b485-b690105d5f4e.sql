-- Add RLS policies for resource_categories table
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;

-- Admins can manage resource categories
CREATE POLICY "Admins can manage resource categories"
ON resource_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Clients can view resource categories based on their user categories
CREATE POLICY "Clients can view resource categories"
ON resource_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_categories uc
    WHERE uc.user_id = auth.uid()
    AND uc.category_id = resource_categories.category_id
  )
  OR EXISTS (
    SELECT 1 FROM categories c
    WHERE c.id = resource_categories.category_id
    AND c.name = 'ALL'
  )
);