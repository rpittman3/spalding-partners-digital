import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (existingAdmin) {
      console.log('Admin account already exists');
      return new Response(
        JSON.stringify({ message: 'Admin account already exists' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create admin auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@sp-financial.com',
      password: 'admin123!',
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error('Failed to create admin account: ' + authError?.message);
    }

    // Create profile
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email: 'admin@sp-financial.com',
      first_name: 'Admin',
      last_name: 'User',
      is_main_user: true,
    });

    // Create admin role
    await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'admin',
    });

    console.log('Admin account created successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Admin account created' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
