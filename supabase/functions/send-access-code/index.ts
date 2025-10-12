import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, accessCode } = await req.json();

    const smtpClient = new SMTPClient({
      connection: {
        hostname: Deno.env.get('SMTP_SERVER') || 'mail.rlp-associates.com',
        port: 587,
        tls: true,
        auth: {
          username: Deno.env.get('SMTP_USER') || 'appsend@rlp-associates.com',
          password: Deno.env.get('SMTP_PASSWORD') || '9hyStS%tXPO4',
        },
      },
    });

    await smtpClient.send({
      from: Deno.env.get('SMTP_USER') || 'appsend@rlp-associates.com',
      to: email,
      subject: 'Your Access Code - SP Financial',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Your Access Code</h2>
            <p>Thank you for requesting access to the SP Financial client portal.</p>
            <p>Your access code is:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
              ${accessCode}
            </div>
            <p>This code will expire in 30 minutes.</p>
            <p>Please enter this code on the access request page to set up your account.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </body>
        </html>
      `,
    });

    await smtpClient.close();

    console.log(`Access code email sent to ${email}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
