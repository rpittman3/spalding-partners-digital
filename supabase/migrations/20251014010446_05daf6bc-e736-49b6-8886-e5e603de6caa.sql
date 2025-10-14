-- Fix existing meeting request times by adding 4 hours
-- This corrects the timezone offset issue for requests submitted before the fix
UPDATE public.meeting_requests
SET 
  option_1 = option_1 + interval '4 hours',
  option_2 = CASE WHEN option_2 IS NOT NULL THEN option_2 + interval '4 hours' ELSE NULL END,
  option_3 = CASE WHEN option_3 IS NOT NULL THEN option_3 + interval '4 hours' ELSE NULL END
WHERE requested_at < NOW();