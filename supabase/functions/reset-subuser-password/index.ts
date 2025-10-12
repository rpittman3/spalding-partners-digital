import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResetPasswordRequest {
  sub_user_id: string;
  new_password: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Check if user is admin or parent of the sub-user
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError) {
      console.error('Error fetching user role:', roleError);
      throw new Error('Error verifying permissions');
    }

    const isAdmin = userRole?.role === 'admin';
    console.log('Is admin:', isAdmin);

    // Parse request body
    const { sub_user_id, new_password }: ResetPasswordRequest = await req.json();

    if (!sub_user_id || !new_password) {
      throw new Error('sub_user_id and new_password are required');
    }

    // Verify the target user is a sub-user
    const { data: subUserProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, is_main_user, parent_user_id, first_name, last_name')
      .eq('id', sub_user_id)
      .single();

    if (profileError || !subUserProfile) {
      console.error('Error fetching sub-user profile:', profileError);
      throw new Error('Sub-user not found');
    }

    if (subUserProfile.is_main_user) {
      throw new Error('Cannot reset password for main users through this endpoint');
    }

    // Check if user has permission (admin or parent user)
    if (!isAdmin && subUserProfile.parent_user_id !== user.id) {
      throw new Error('You do not have permission to reset this user\'s password');
    }

    console.log('Resetting password for sub-user:', sub_user_id);

    // Reset the password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      sub_user_id,
      { password: new_password }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      throw new Error('Failed to reset password');
    }

    // Log the action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      action_type: 'password_reset',
      entity_type: 'sub_user',
      entity_id: sub_user_id,
      details: {
        sub_user_name: `${subUserProfile.first_name} ${subUserProfile.last_name}`,
        reset_by: isAdmin ? 'admin' : 'parent_user'
      }
    });

    console.log('Password reset successful');

    return new Response(
      JSON.stringify({ success: true, message: 'Password reset successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in reset-subuser-password function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});