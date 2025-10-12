-- Add RLS policies for user_categories table so admins can manage user category assignments

-- Admins can view all user categories
CREATE POLICY "Admins can view all user categories"
ON public.user_categories
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert user categories
CREATE POLICY "Admins can insert user categories"
ON public.user_categories
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update user categories
CREATE POLICY "Admins can update user categories"
ON public.user_categories
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete user categories
CREATE POLICY "Admins can delete user categories"
ON public.user_categories
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Users can view their own categories
CREATE POLICY "Users can view their own categories"
ON public.user_categories
FOR SELECT
USING (auth.uid() = user_id);