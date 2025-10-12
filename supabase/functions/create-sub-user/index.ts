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
    const { email, password, firstName, lastName, parentUserId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header to verify the caller
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the caller is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !caller) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if caller is admin or the parent user
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: caller.id,
      _role: 'admin'
    });

    if (!isAdmin && caller.id !== parentUserId) {
      return new Response(
        JSON.stringify({ error: 'Only admins or the parent user can create sub-users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify parent user exists and is a main client user
    const { data: parentProfile, error: parentError } = await supabase
      .from('profiles')
      .select('*, user_roles!inner(role)')
      .eq('id', parentUserId)
      .eq('is_main_user', true)
      .maybeSingle();

    if (parentError || !parentProfile) {
      return new Response(
        JSON.stringify({ error: 'Parent user not found or is not a main user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create auth user
    const { data: authData, error: authCreateError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
    });

    if (authCreateError || !authData.user) {
      console.error('Failed to create sub-user auth:', authCreateError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user account: ' + authCreateError?.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create profile with parent link
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email: email.toLowerCase(),
      first_name: firstName,
      last_name: lastName,
      parent_user_id: parentUserId,
      is_main_user: false,
      company_name: parentProfile.company_name,
      address: parentProfile.address,
    });

    // Create sub_user role
    await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'sub_user',
    });

    // Copy parent user's categories to sub-user
    const { data: parentCategories } = await supabase
      .from('user_categories')
      .select('category_id')
      .eq('user_id', parentUserId);

    if (parentCategories && parentCategories.length > 0) {
      const categoryLinks = parentCategories.map((cat) => ({
        user_id: authData.user.id,
        category_id: cat.category_id,
      }));
      await supabase.from('user_categories').insert(categoryLinks);
    }

    console.log('Sub-user created successfully:', { userId: authData.user.id, parentUserId });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sub-user created successfully',
        userId: authData.user.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-sub-user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
