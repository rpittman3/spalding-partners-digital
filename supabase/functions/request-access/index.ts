import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, lastName } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email and last name match in client_imports
    const { data: importedClient, error: importError } = await supabase
      .from('client_imports')
      .select('*')
      .eq('email', email.toLowerCase())
      .ilike('last_name', lastName)
      .single();

    if (importError || !importedClient) {
      return new Response(
        JSON.stringify({ pending: true }),
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

    // TODO: Send email with access code
    // For now, log it (in production, use email service)
    console.log(`Access code for ${email}: ${accessCode}`);

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
