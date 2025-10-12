import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateClientRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  company_name?: string
  address?: string
  cell_phone?: string
  work_phone?: string
  category_ids?: string[]
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

    const body: CreateClientRequest = await req.json()
    console.log('Creating client:', { email: body.email, first_name: body.first_name, last_name: body.last_name })

    // Validate required fields
    if (!body.email || !body.password || !body.first_name || !body.last_name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, first name, and last name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create auth user with auto-confirm
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    })

    if (createUserError) {
      console.error('Error creating user:', createUserError)
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User created:', newUser.user.id)

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        company_name: body.company_name || null,
        address: body.address || null,
        cell_phone: body.cell_phone || null,
        work_phone: body.work_phone || null,
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Rollback: delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      throw profileError
    }

    console.log('Profile created')

    // Assign client role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'client',
      })

    if (roleError) {
      console.error('Error assigning role:', roleError)
      // Rollback: delete profile and auth user
      await supabaseAdmin.from('profiles').delete().eq('id', newUser.user.id)
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      throw roleError
    }

    console.log('Role assigned')

    // Assign categories
    if (body.category_ids && body.category_ids.length > 0) {
      const categoryInserts = body.category_ids.map(category_id => ({
        user_id: newUser.user.id,
        category_id,
      }))

      const { error: categoryError } = await supabaseAdmin
        .from('user_categories')
        .insert(categoryInserts)

      if (categoryError) {
        console.error('Error assigning categories:', categoryError)
        // Continue anyway - categories are optional
      } else {
        console.log('Categories assigned:', body.category_ids.length)
      }
    }

    // Log to audit logs
    await supabaseAdmin.from('audit_logs').insert({
      user_id: adminUser.id,
      action_type: 'CREATE',
      entity_type: 'client',
      entity_id: newUser.user.id,
      details: {
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
      },
    })

    console.log('Client created successfully:', newUser.user.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: newUser.user.id,
        message: 'Client created successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error in create-client:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
