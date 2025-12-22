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
    
    console.log(`Sending access code to ${email}`);

    const smtpHostname = Deno.env.get('SMTP_HOSTNAME');
    const smtpUsername = Deno.env.get('SMTP_USERNAME');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpFrom = Deno.env.get('SMTP_FROM');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    
    // Get the site URL from Supabase URL (extract project ref)
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1] || '';
    const siteUrl = `https://${projectRef}.lovableproject.com`;

    if (!smtpHostname || !smtpUsername || !smtpPassword || !smtpFrom) {
      throw new Error('SMTP configuration missing');
    }

    const smtpClient = new SMTPClient({
      connection: {
        hostname: smtpHostname,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUsername,
          password: smtpPassword,
        },
      },
    });

    // Create direct link to auth page with code entry mode
    const authLink = `${siteUrl}/auth?mode=code&email=${encodeURIComponent(email)}`;

    await smtpClient.send({
      from: smtpFrom,
      to: email,
      cc: 'admin@sp-financial.com',
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
            <p style="text-align: center; margin: 25px 0;">
              <a href="${authLink}" style="background-color: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Enter Your Code
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              Or copy this link: <a href="${authLink}">${authLink}</a>
            </p>
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
