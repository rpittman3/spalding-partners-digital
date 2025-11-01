import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const RequestAccessSchema = z.object({
  email: z.string().trim().email('Invalid email format').max(255, 'Email too long'),
  lastName: z.string().trim().min(1, 'Last name required').max(100, 'Last name too long'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let body: z.infer<typeof RequestAccessSchema>;
    try {
      body = RequestAccessSchema.parse(await req.json());
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return new Response(
          JSON.stringify({ error: 'Invalid request data' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }
    
    const { email, lastName } = body;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP address for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit: 5 requests per 15 minutes
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _ip_address: clientIP,
        _max_requests: 5,
        _window_minutes: 15
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (rateLimitCheck && rateLimitCheck.length > 0 && !rateLimitCheck[0].allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again in a few minutes.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user already has an account
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      console.log('Account already exists for email');
      return new Response(
        JSON.stringify({ error: 'An account already exists for this email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email and last name match in client_imports
    const { data: importedClient, error: importError } = await supabase
      .from('client_imports')
      .select('*')
      .eq('email', email.toLowerCase())
      .ilike('last_name', lastName)
      .single();

    if (importError || !importedClient) {
      console.log('Client lookup failed or no match found');
      return new Response(
        JSON.stringify({ pending: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if there's already a pending request
    const { data: existingRequest } = await supabase
      .from('access_requests')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')
      .gt('code_expires_at', new Date().toISOString())
      .single();

    // If there's a valid pending request, resend the code
    if (existingRequest) {
      try {
        await supabase.functions.invoke('send-access-code', {
          body: { email: email.toLowerCase(), accessCode: existingRequest.access_code },
        });
      } catch (emailError) {
        console.error('Error resending access code:', emailError);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Access code resent to your email' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 6-digit code
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Store access request
    const { error: requestError } = await supabase.from('access_requests').insert({
      email: email.toLowerCase(),
      last_name: lastName,
      access_code: accessCode,
      code_expires_at: codeExpiresAt,
      status: 'pending',
    });

    if (requestError) {
      throw new Error('Failed to create access request');
    }

    // Send email with access code
    try {
      const emailResponse = await supabase.functions.invoke('send-access-code', {
        body: { email: email.toLowerCase(), accessCode },
      });

      if (emailResponse.error) {
        console.error('Failed to send email:', emailResponse.error);
        // Don't fail the request if email fails, just log it
      } else {
        console.log(`Access code email sent to ${email}`);
      }
    } catch (emailError) {
      console.error('Error sending access code email:', emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in request-access:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
