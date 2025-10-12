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
    const { email, code, password } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      return new Response(
        JSON.stringify({ error: 'Invalid or expired code' }),
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
      return new Response(
        JSON.stringify({ error: 'Client data not found' }),
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
      throw new Error('Failed to create user account');
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
