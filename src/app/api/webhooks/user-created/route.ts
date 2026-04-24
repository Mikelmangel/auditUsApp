import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    // Basic verification: in a real scenario you could check a secret query parameter
    // or verify the payload signature if it comes from a Supabase Webhook.
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    if (secret !== process.env.WEBHOOK_SECRET && process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized webhook access" }, { status: 401 });
    }

    const payload = await req.json();

    // Supabase trigger usually sends { type: 'INSERT', record: { id, email, ... } }
    const record = payload.record || payload; 

    // Adjust based on if the webhook triggers on auth.users or public.profiles
    const email = record.email;
    const username = record.username || record.raw_user_meta_data?.username || "Usuario";

    if (!email) {
      return NextResponse.json({ error: "No email provided in payload" }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Skipping welcome email.", { email, username });
      return NextResponse.json({ success: true, warning: "RESEND_API_KEY not configured, email skipped." });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://auditus.fun";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f6f2; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
        <h1 style="color: #14726e; margin-bottom: 8px;">¡Bienvenido/a a AuditUs, ${username}! 🎉</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.5;">Nos alegra muchísimo que te hayas unido a la plataforma. AuditUs es el lugar perfecto para crear encuestas sociales y divertirte con tus amigos.</p>
        
        <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f36b2d;">
          <p style="margin: 0; color: #111827; font-weight: bold;">Tu siguiente paso:</p>
          <p style="margin: 4px 0 0; color: #4b5563;">Crea un grupo, invita a tus amigos con el código y ¡empieza a votar!</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${siteUrl}" style="background-color: #f36b2d; color: white; text-decoration: none; padding: 12px 24px; border-radius: 99px; font-weight: bold; font-size: 16px; display: inline-block;">Entrar a AuditUs</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #d1d5db; margin: 30px 0 20px;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 AuditUs. Todos los derechos reservados.</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "AuditUs <hola@auditus.fun>",
        to: email,
        subject: "¡Bienvenido a AuditUs! 🚀",
        html: htmlContent
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }

    return NextResponse.json({ success: true, message: "Welcome email sent" });

  } catch (error: any) {
    console.error("Welcome email webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
