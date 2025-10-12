import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ResetPasswordRequest {
  client_id: string
  new_password: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify admin access
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !adminUser) {
      throw new Error('Unauthorized')
    }

    const { data: adminRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', adminUser.id)
      .eq('role', 'admin')
      .single()

    if (!adminRole) {
      throw new Error('Admin access required')
    }

    const body: ResetPasswordRequest = await req.json()
    console.log('Resetting password for client:', body.client_id)

    // Validate required fields
    if (!body.client_id || !body.new_password) {
      return new Response(
        JSON.stringify({ error: 'Client ID and new password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify client exists and is a client
    const { data: clientRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', body.client_id)
      .eq('role', 'client')
      .single()

    if (!clientRole) {
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      body.client_id,
      { password: body.new_password }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Password updated successfully')

    // Log to audit logs
    await supabaseAdmin.from('audit_logs').insert({
      user_id: adminUser.id,
      action_type: 'UPDATE',
      entity_type: 'client_password',
      entity_id: body.client_id,
      details: {
        action: 'password_reset',
      },
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password reset successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error in reset-client-password:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
