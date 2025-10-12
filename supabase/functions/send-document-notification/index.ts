import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentNotificationRequest {
  clientEmail: string;
  clientName: string;
  documentName: string;
  category?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientEmail, clientName, documentName, category }: DocumentNotificationRequest = await req.json();

    // DEVELOPMENT: Override recipient email
    const recipientEmail = 'rpittman3@gmail.com';
    
    console.log('Original client email:', clientEmail);
    console.log('Sending document notification to (DEV):', recipientEmail);

    // Initialize SMTP client with environment variables or defaults
    const smtpClient = new SMTPClient({
      connection: {
        hostname: Deno.env.get('SMTP_HOSTNAME') || 'mail.rlp-associates.com',
        port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
        tls: true,
        auth: {
          username: Deno.env.get('SMTP_USERNAME') || 'appsend@rlp-associates.com',
          password: Deno.env.get('SMTP_PASSWORD') || '',
        },
      },
    });

    const clientPortalUrl = `${Deno.env.get('VITE_SUPABASE_URL')?.replace('.supabase.co', '.lovable.app') || 'https://your-app.lovable.app'}/auth`;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Document Available</h2>
        <p>Dear ${clientName},</p>
        <p>A new document has been uploaded to your account:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Document:</strong> ${documentName}</p>
          ${category ? `<p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>` : ''}
        </div>
        <p>Please log in to your client portal to view this document:</p>
        <p style="margin: 25px 0;">
          <a href="${clientPortalUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Access Client Portal
          </a>
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you have any questions, please don't hesitate to contact us.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          SP Financial<br>
          This is an automated notification. Please do not reply to this email.
        </p>
      </div>
    `;

    await smtpClient.send({
      from: Deno.env.get('SMTP_FROM') || 'appsend@rlp-associates.com',
      to: recipientEmail,
      subject: 'New Document Available - SP Financial',
      content: 'A new document has been uploaded to your account. Please log in to view it.',
      html: emailBody,
    });

    await smtpClient.close();

    console.log('Document notification sent successfully to:', recipientEmail);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending document notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
