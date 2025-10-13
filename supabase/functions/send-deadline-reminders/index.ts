import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Checking for deadline reminders...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date();
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);
    const in15Days = new Date(today);
    in15Days.setDate(today.getDate() + 15);

    // Format dates for comparison
    const todayStr = today.toISOString().split('T')[0];
    const in30DaysStr = in30Days.toISOString().split('T')[0];
    const in15DaysStr = in15Days.toISOString().split('T')[0];

    // Get deadlines that need 30-day reminders
    const { data: deadlines30, error: error30 } = await supabase
      .from('deadlines')
      .select('*')
      .eq('due_date', in30DaysStr)
      .eq('reminder_30_days_sent', false);

    // Get deadlines that need 15-day reminders
    const { data: deadlines15, error: error15 } = await supabase
      .from('deadlines')
      .select('*')
      .eq('due_date', in15DaysStr)
      .eq('reminder_15_days_sent', false);

    if (error30 || error15) {
      throw new Error('Failed to fetch deadlines');
    }

    const allDeadlines = [
      ...(deadlines30 || []).map(d => ({ ...d, reminderType: '30' })),
      ...(deadlines15 || []).map(d => ({ ...d, reminderType: '15' })),
    ];

    console.log(`Found ${allDeadlines.length} deadlines needing reminders`);

    if (allDeadlines.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No reminders to send' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

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

    let totalSent = 0;

    for (const deadline of allDeadlines) {
      try {
        // Get categories for this deadline
        const { data: deadlineCategories } = await supabase
          .from('deadline_categories')
          .select('category_id')
          .eq('deadline_id', deadline.id);

        const categoryIds = deadlineCategories?.map(dc => dc.category_id) || [];

        if (categoryIds.length === 0) continue;

        // Check if "ALL" category is included
        const { data: allCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('name', 'ALL')
          .single();

        const includesAll = allCategory && categoryIds.includes(allCategory.id);
        let userIds: string[] = [];

        if (includesAll) {
          // Get all active client users
          const { data: allProfiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('is_active', true)
            .eq('is_main_user', true);

          userIds = allProfiles?.map(p => p.id) || [];
        } else {
          // Get users in the selected categories
          const { data: userCategories } = await supabase
            .from('user_categories')
            .select('user_id')
            .in('category_id', categoryIds);

          userIds = [...new Set(userCategories?.map(uc => uc.user_id) || [])];
        }

        if (userIds.length === 0) continue;

        // Get user profiles with emails
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .in('id', userIds)
          .eq('is_active', true);

        // Send emails
        for (const profile of profiles || []) {
          try {
            const recipientEmail = emailOverride || profile.email;
            
            await smtpClient.send({
              from: fromEmail,
              to: recipientEmail,
              subject: `Reminder: ${deadline.title} - Due in ${deadline.reminderType} Days`,
              content: `Dear ${profile.first_name || 'Valued Client'},

This is a reminder that the following deadline is approaching:

${deadline.title}
Due Date: ${new Date(deadline.due_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}

${deadline.description || ''}

Please ensure all necessary preparations are completed before this date.

Best regards,
Spalding & Partners Financial`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
                    <strong>You have received an important reminder from Spalding & Partners Financial</strong>
                  </p>
                  <h2 style="color: #333;">Deadline Reminder: Due in ${deadline.reminderType} Days</h2>
                  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">${deadline.title}</h3>
                    <p style="color: #666; font-size: 16px; margin: 10px 0;">
                      <strong>Due Date:</strong> ${new Date(deadline.due_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    ${deadline.description ? `<p style="color: #666;">${deadline.description}</p>` : ''}
                  </div>
                  <p style="color: #666;">
                    Please ensure all necessary preparations are completed before this date.
                  </p>
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

            totalSent++;
            console.log(`Reminder sent to ${recipientEmail} for deadline: ${deadline.title}`);
          } catch (emailError) {
            console.error(`Failed to send email to ${profile.email}:`, emailError);
          }
        }

        // Mark reminder as sent
        const updateField = deadline.reminderType === '30' 
          ? 'reminder_30_days_sent' 
          : 'reminder_15_days_sent';

        await supabase
          .from('deadlines')
          .update({ [updateField]: true })
          .eq('id', deadline.id);

      } catch (deadlineError) {
        console.error(`Error processing deadline ${deadline.id}:`, deadlineError);
      }
    }

    await smtpClient.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${totalSent} reminder emails`,
        totalSent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in send-deadline-reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
