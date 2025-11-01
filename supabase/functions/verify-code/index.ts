import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const VerifyCodeSchema = z.object({
  email: z.string().trim().email('Invalid email format').max(255, 'Email too long'),
  code: z.string().trim().length(6, 'Code must be 6 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request body
    let body: z.infer<typeof VerifyCodeSchema>;
    try {
      body = VerifyCodeSchema.parse(await req.json());
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
    
    const { email, code, password } = body;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP address for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit: 10 attempts per 15 minutes (more lenient for code verification)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _ip_address: clientIP,
        _max_requests: 10,
        _window_minutes: 15
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (rateLimitCheck && rateLimitCheck.length > 0 && !rateLimitCheck[0].allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many verification attempts. Please try again in a few minutes.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify access code
    const { data: accessRequest, error: requestError } = await supabase
      .from('access_requests')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('access_code', code)
      .eq('status', 'pending')
      .gt('code_expires_at', new Date().toISOString())
      .single();

    if (requestError || !accessRequest) {
      console.error('Access request validation failed:', { email, hasRequest: !!accessRequest, error: requestError });
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client data from imports
    const { data: importedClient } = await supabase
      .from('client_imports')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (!importedClient) {
      console.error('Client import lookup failed for email');
      return new Response(
        JSON.stringify({ error: 'Invalid verification request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('Auth user creation failed:', authError);
      throw new Error('Account creation failed');
    }

    // Create profile
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email: email.toLowerCase(),
      first_name: importedClient.first_name,
      last_name: importedClient.last_name,
      company_name: importedClient.company_name,
      address: importedClient.address,
      work_phone: importedClient.work_phone,
      cell_phone: importedClient.cell_phone,
      is_main_user: true,
    });

    // Create user role
    await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'client',
    });

    // Parse and assign categories
    if (importedClient.categories) {
      const categoryNames = importedClient.categories.split(',').map((c: string) => c.trim());
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .in('name', categoryNames);

      if (categories) {
        const categoryLinks = categories.map((cat) => ({
          user_id: authData.user.id,
          category_id: cat.id,
        }));
        await supabase.from('user_categories').insert(categoryLinks);
      }
    }

    // Mark access request as used
    await supabase
      .from('access_requests')
      .update({ status: 'approved', used_at: new Date().toISOString() })
      .eq('id', accessRequest.id);

    // Mark import as processed
    await supabase
      .from('client_imports')
      .update({ account_created: true, processed_at: new Date().toISOString() })
      .eq('id', importedClient.id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-code:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
