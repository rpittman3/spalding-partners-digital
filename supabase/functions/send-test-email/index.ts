import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  to: string;
  subject: string;
  body: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, body }: TestEmailRequest = await req.json();

    console.log('Sending test email to:', to);
    console.log('Subject:', subject);

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

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Test Email</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="white-space: pre-wrap;">${body}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          SP Financial<br>
          This is a test email.
        </p>
      </div>
    `;

    await smtpClient.send({
      from: Deno.env.get('SMTP_FROM') || 'appsend@rlp-associates.com',
      to: to,
      subject: subject,
      content: body,
      html: emailBody,
    });

    await smtpClient.close();

    console.log('Test email sent successfully to:', to);

    return new Response(
      JSON.stringify({ success: true, message: 'Test email sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
