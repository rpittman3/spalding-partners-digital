import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  notificationId: string;
  title: string;
  body: string;
  categoryIds: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notificationId, title, body, categoryIds }: NotificationRequest = await req.json();
    
    console.log('Processing notification emails for categories:', categoryIds);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if "ALL" category is included
    const { data: allCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', 'ALL')
      .single();

    const includesAll = allCategory && categoryIds.includes(allCategory.id);
    let userIds: string[] = [];

    if (includesAll) {
      // If ALL category is selected, get all active client users
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_active', true)
        .eq('is_main_user', true);

      if (allProfilesError) throw allProfilesError;
      userIds = allProfiles?.map(p => p.id) || [];
    } else {
      // Get users in the selected categories
      const { data: userCategories, error: userError } = await supabase
        .from('user_categories')
        .select('user_id')
        .in('category_id', categoryIds);

      if (userError) throw userError;
      userIds = [...new Set(userCategories?.map(uc => uc.user_id) || [])];
    }

    console.log('Found users:', userIds.length);

    if (userIds.length === 0) {
      // Still create empty notification status table entry for tracking
      console.log('No users found in selected categories');
    }

    // Create notification status entries for each user (do this before checking for empty userIds)
    if (userIds.length > 0) {
      const statusEntries = userIds.map(userId => ({
        notification_id: notificationId,
        user_id: userId,
        is_seen: false,
        is_archived: false,
      }));

      const { error: statusError } = await supabase
        .from('notification_status')
        .insert(statusEntries);

      if (statusError) {
        console.error('Error creating notification status:', statusError);
      }
    }

    if (userIds.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found in selected categories' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get user profiles with emails
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .in('id', userIds)
      .eq('is_active', true);

    if (profileError) throw profileError;

    console.log('Found active profiles:', profiles?.length);

    // Initialize SMTP client
    const smtpClient = new SMTPClient({
      connection: {
        hostname: Deno.env.get('SMTP_HOSTNAME')!,
        port: Number(Deno.env.get('SMTP_PORT')),
        tls: true,
        auth: {
          username: Deno.env.get('SMTP_USERNAME')!,
          password: Deno.env.get('SMTP_PASSWORD')!,
        },
      },
    });

    const emailOverride = Deno.env.get('EMAIL_OVERRIDE');
    const fromEmail = Deno.env.get('SMTP_FROM')!;

    // Send emails
    let successCount = 0;
    let failCount = 0;

    for (const profile of profiles || []) {
      try {
        const recipientEmail = emailOverride || profile.email;
        
        // Strip HTML tags for plain text version
        const plainTextBody = body.replace(/<[^>]*>/g, '');

        await smtpClient.send({
          from: fromEmail,
          to: recipientEmail,
          subject: title,
          content: `You have received an important notification from Spalding & Partners Financial\n\n${plainTextBody}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
                <strong>You have received an important notification from Spalding & Partners Financial</strong>
              </p>
              <h2 style="color: #333;">${title}</h2>
              <div style="margin: 20px 0;">
                ${body}
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="color: #666; font-size: 14px;">
                <a href="${supabaseUrl.replace('https://', 'https://').split('.')[0]}.lovable.app/portal" 
                   style="color: #0066cc; text-decoration: none;">
                  View in Client Portal
                </a>
              </p>
            </div>
          `,
        });

        successCount++;
        console.log(`Email sent to ${recipientEmail}`);
      } catch (emailError) {
        failCount++;
        console.error(`Failed to send email to ${profile.email}:`, emailError);
      }
    }

    await smtpClient.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${successCount} emails, ${failCount} failed`,
        successCount,
        failCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in send-notification-emails:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
