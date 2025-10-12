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
    
    const smtpHostname = Deno.env.get('SMTP_HOSTNAME') || 'mail.rlp-associates.com';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465');
    const smtpUsername = Deno.env.get('SMTP_USERNAME') || 'appsend@rlp-associates.com';
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    
    console.log('SMTP Config:', {
      hostname: smtpHostname,
      port: smtpPort,
      username: smtpUsername,
      hasPassword: !!smtpPassword
    });

    if (!smtpPassword) {
      throw new Error('SMTP_PASSWORD environment variable is not set');
    }

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

    const fromAddress = Deno.env.get('SMTP_FROM') || 'appsend@rlp-associates.com';

    const trySend = async (opts: { hostname: string; port: number; tls: boolean; noStartTLS?: boolean }) => {
      console.log('Attempting SMTP send with:', opts);
      const client = new SMTPClient({
        connection: {
          hostname: opts.hostname,
          port: opts.port,
          tls: opts.tls,
          auth: {
            username: smtpUsername,
            password: smtpPassword,
          },
        },
        debug: {
          log: true,
          allowUnsecure: false,
          noStartTLS: opts.noStartTLS ?? false,
        },
      });
      try {
        await client.send({
          from: fromAddress,
          to,
          subject,
          content: body,
          html: emailBody,
        });
      } finally {
        try { await client.close(); } catch (_) { /* ignore */ }
      }
    };

    if (smtpPort === 465) {
      await trySend({ hostname: smtpHostname, port: smtpPort, tls: true });
    } else {
      try {
        // Try STARTTLS on 587
        await trySend({ hostname: smtpHostname, port: smtpPort, tls: false, noStartTLS: false });
      } catch (e1: any) {
        console.error('STARTTLS attempt failed:', e1?.message || String(e1));
        // Fallback: implicit TLS on 465
        try {
          await trySend({ hostname: smtpHostname, port: 465, tls: true });
        } catch (e2: any) {
          console.error('TLS:465 fallback failed:', e2?.message || String(e2));
          throw e2;
        }
      }
    }

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
