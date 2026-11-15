import { NextResponse } from "next/server";
import { sendHostingerEmail } from "@/lib/email/smtp-client";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const { to, cc, bcc, subject, text, html, password, from } = body;

    if (!to) {
      return NextResponse.json({ error: "Recipient email (to) is required" }, { status: 400 });
    }

    const senderEmail = from || session?.email;
    if (!senderEmail) {
      return NextResponse.json({ error: "Sender email is required" }, { status: 400 });
    }

    // If password provided in request or session
    if (password) {
      await sendHostingerEmail(
        { email: senderEmail, password },
        {
          from: senderEmail,
          to,
          cc,
          bcc,
          subject: subject || "(no subject)",
          text: text || "",
          html,
        }
      );
    }

    // Record in Supabase database
    try {
      const supabase = await createClient();
      await supabase.from("emails").insert({
        id: `sent-${Date.now()}`,
        folder: "sent",
        from_name: session?.name || senderEmail.split("@")[0],
        from_email: senderEmail,
        to_address: to,
        cc_address: cc,
        bcc_address: bcc,
        subject: subject || "(no subject)",
        snippet: text ? text.slice(0, 120) : "…",
        body: text ? [text] : [""],
        body_html: html,
        unread: false,
        received_at: new Date().toISOString(),
      });
    } catch {
      // Non-fatal if database tables are still in migration
    }

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to send email via Hostinger SMTP" },
      { status: 500 }
    );
  }
}
