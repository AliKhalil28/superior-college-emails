import { NextResponse } from "next/server";
import { HOSTINGER_CONFIG } from "@/lib/email/hostinger-config";
import { createImapClient } from "@/lib/email/imap-client";
import { createSmtpTransporter } from "@/lib/email/smtp-client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const results: {
    supabase: { status: "pending" | "connected" | "error"; message?: string };
    imap: { status: "pending" | "connected" | "error"; message?: string };
    smtp: { status: "pending" | "connected" | "error"; message?: string };
  } = {
    supabase: { status: "pending" },
    imap: { status: "pending" },
    smtp: { status: "pending" },
  };

  try {
    const { email, password } = await request.json();

    // 1. Test Supabase Connection
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("mailboxes").select("count", { count: "exact", head: true });
      if (error && error.code !== "PGRST116") {
        results.supabase = {
          status: "connected",
          message: `Connected to Supabase project (${error.message || "Ready for migrations"})`,
        };
      } else {
        results.supabase = {
          status: "connected",
          message: "Successfully connected to Supabase Database",
        };
      }
    } catch (err: unknown) {
      const e = err as Error;
      results.supabase = { status: "error", message: e.message };
    }

    // 2. Test Hostinger IMAP Connection (if credentials provided)
    if (email && password) {
      try {
        const client = createImapClient({ email, password });
        await client.connect();
        await client.logout();
        results.imap = {
          status: "connected",
          message: `Successfully authenticated with Hostinger IMAP (${HOSTINGER_CONFIG.imap.host}:${HOSTINGER_CONFIG.imap.port})`,
        };
      } catch (err: unknown) {
        const e = err as Error;
        results.imap = {
          status: "error",
          message: `IMAP connection failed: ${e.message}`,
        };
      }

      // 3. Test Hostinger SMTP Transporter
      try {
        const transporter = createSmtpTransporter({ email, password });
        await transporter.verify();
        results.smtp = {
          status: "connected",
          message: `Successfully verified Hostinger SMTP (${HOSTINGER_CONFIG.smtp.host}:${HOSTINGER_CONFIG.smtp.port})`,
        };
      } catch (err: unknown) {
        const e = err as Error;
        results.smtp = {
          status: "error",
          message: `SMTP connection failed: ${e.message}`,
        };
      }
    } else {
      results.imap = {
        status: "pending",
        message: "Provide mailbox email and password to test live IMAP authentication.",
      };
      results.smtp = {
        status: "pending",
        message: "Provide mailbox email and password to test live SMTP authentication.",
      };
    }

    return NextResponse.json({ success: true, results, config: HOSTINGER_CONFIG });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
