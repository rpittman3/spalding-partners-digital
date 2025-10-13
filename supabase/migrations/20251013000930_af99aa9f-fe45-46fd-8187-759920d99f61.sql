-- Backfill missing notification_status entries for existing notifications
-- This ensures users in categories can see notifications that were created before the fix

INSERT INTO public.notification_status (notification_id, user_id, is_seen, is_archived)
SELECT DISTINCT 
  nc.notification_id,
  uc.user_id,
  false as is_seen,
  false as is_archived
FROM public.notification_categories nc
JOIN public.user_categories uc ON nc.category_id = uc.category_id
LEFT JOIN public.notification_status ns ON ns.notification_id = nc.notification_id AND ns.user_id = uc.user_id
WHERE ns.id IS NULL
ON CONFLICT DO NOTHING;