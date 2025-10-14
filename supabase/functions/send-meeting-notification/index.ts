import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingNotificationRequest {
  requestId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId }: MeetingNotificationRequest = await req.json();

    if (!requestId) {
      throw new Error("Meeting request ID is required");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch meeting request details with profile info
    const { data: request, error: fetchError } = await supabase
      .from("meeting_requests")
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          email,
          cell_phone,
          work_phone,
          company_name
        )
      `)
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      throw new Error(`Failed to fetch meeting request: ${fetchError?.message}`);
    }

    // Format the meeting times in Eastern Time
    const formatDateTime = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
        timeZoneName: "short"
      });
    };

    // Initialize SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOSTNAME") || "smtp.gmail.com",
        port: Number(Deno.env.get("SMTP_PORT")) || 587,
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USERNAME")!,
          password: Deno.env.get("SMTP_PASSWORD")!,
        },
      },
    });

    const adminEmail = Deno.env.get("SMTP_FROM") || Deno.env.get("SMTP_USERNAME");
    const profile = request.profiles;

    // Compose email
    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">New Meeting Request</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Client Information</h3>
            <p><strong>Name:</strong> ${profile.first_name} ${profile.last_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${profile.email}">${profile.email}</a></p>
            ${profile.cell_phone ? `<p><strong>Cell Phone:</strong> ${profile.cell_phone}</p>` : ""}
            ${profile.work_phone ? `<p><strong>Work Phone:</strong> ${profile.work_phone}</p>` : ""}
            ${profile.company_name ? `<p><strong>Company:</strong> ${profile.company_name}</p>` : ""}
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Meeting Details</h3>
            <p><strong>Subject:</strong></p>
            <p style="margin-left: 20px;">${request.subject}</p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Preferred Date & Time Options</h3>
            <ol style="margin-left: 20px;">
              <li style="margin-bottom: 10px;">${formatDateTime(request.option_1)}</li>
              ${request.option_2 ? `<li style="margin-bottom: 10px;">${formatDateTime(request.option_2)}</li>` : ""}
              ${request.option_3 ? `<li style="margin-bottom: 10px;">${formatDateTime(request.option_3)}</li>` : ""}
            </ol>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This request was submitted on ${new Date(request.requested_at).toLocaleString()}.
          </p>
        </body>
      </html>
    `;

    await client.send({
      from: Deno.env.get("SMTP_FROM")!,
      to: adminEmail!,
      subject: `New Meeting Request from ${profile.first_name} ${profile.last_name}`,
      content: "Please enable HTML to view this email.",
      html: emailHtml,
    });

    await client.close();

    console.log(`Meeting notification email sent for request ${requestId}`);

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-meeting-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
