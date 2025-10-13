-- Enable pg_cron and pg_net extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule the deadline reminders to run daily at 9 AM UTC
SELECT cron.schedule(
  'send-deadline-reminders-daily',
  '0 9 * * *', -- Run at 9 AM UTC every day
  $$
  SELECT
    net.http_post(
        url:='https://dxbdoqzwcyfivgblwsds.supabase.co/functions/v1/send-deadline-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YmRvcXp3Y3lmaXZnYmx3c2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjc5MDUsImV4cCI6MjA3NTgwMzkwNX0.R6M3LqbvOj7G-MVGz25iPkPoVKZAmUUvwPCjM-gSz-4"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);