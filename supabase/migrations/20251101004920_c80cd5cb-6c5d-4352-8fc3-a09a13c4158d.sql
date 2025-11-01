-- Create rate limiting infrastructure for public endpoints

-- Table to track rate limits by IP address
CREATE TABLE IF NOT EXISTS public.rate_limits (
  ip_address TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (only Edge Functions with service role can access)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service can manage rate limits"
ON public.rate_limits
FOR ALL
USING (false);

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _ip_address TEXT,
  _max_requests INTEGER,
  _window_minutes INTEGER
)
RETURNS TABLE(allowed BOOLEAN, requests_remaining INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count INTEGER;
  v_window_start TIMESTAMPTZ;
  v_window_expired BOOLEAN;
BEGIN
  -- Get existing rate limit record
  SELECT request_count, window_start, 
         (NOW() - window_start) > INTERVAL '1 minute' * _window_minutes
  INTO v_current_count, v_window_start, v_window_expired
  FROM rate_limits
  WHERE ip_address = _ip_address;

  -- If no record exists or window expired, start new window
  IF NOT FOUND OR v_window_expired THEN
    INSERT INTO rate_limits (ip_address, request_count, window_start)
    VALUES (_ip_address, 1, NOW())
    ON CONFLICT (ip_address) 
    DO UPDATE SET 
      request_count = 1, 
      window_start = NOW();
    
    RETURN QUERY SELECT TRUE, _max_requests - 1;
    RETURN;
  END IF;

  -- Check if limit exceeded
  IF v_current_count >= _max_requests THEN
    RETURN QUERY SELECT FALSE, 0;
    RETURN;
  END IF;

  -- Increment counter
  UPDATE rate_limits
  SET request_count = request_count + 1
  WHERE ip_address = _ip_address;

  RETURN QUERY SELECT TRUE, _max_requests - v_current_count - 1;
END;
$$;

-- Cleanup function to remove old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$;