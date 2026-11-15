import { NextResponse } from "next/server";
import { verifyHostingerMailbox } from "@/lib/email/imap-client";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email address and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Verify credentials against Hostinger IMAP server
    let imapVerified = false;
    let authError = "";

    try {
      imapVerified = await verifyHostingerMailbox({ email: cleanEmail, password });
    } catch (err: unknown) {
      const e = err as Error;
      authError = e.message;
      // In development / demo preview, allow sign-in with mock accounts if hostinger connection fails
      if (process.env.NODE_ENV !== "production" && cleanEmail.endsWith("@superiorcollegemc.com")) {
        imapVerified = true;
      }
    }

    if (!imapVerified) {
      return NextResponse.json(
        {
          error: "Invalid email or mailbox password. Please check your Hostinger credentials.",
          details: authError,
        },
        { status: 401 }
      );
    }

    // 2. Query / create staff profile in Supabase
    let mailboxData = null;
    try {
      const supabase = await createClient();
      const { data: existing } = await supabase
        .from("mailboxes")
        .select("*")
        .eq("email", cleanEmail)
        .single();

      if (existing) {
        mailboxData = existing;
      } else {
        const initials = cleanEmail
          .split("@")[0]
          .split(".")
          .map((s: string) => s[0]?.toUpperCase())
          .join("") || "SM";

        const { data: created } = await supabase
          .from("mailboxes")
          .insert({
            email: cleanEmail,
            display_name: cleanEmail.split("@")[0].replace(".", " "),
            initials,
            default_from: cleanEmail,
            aliases: [cleanEmail],
          })
          .select("*")
          .single();

        mailboxData = created;
      }
    } catch {
      // Graceful fallback if database tables have not yet been migrated
    }

    // 3. Create secure HTTP-only session
    await createSession({
      email: cleanEmail,
      name: mailboxData?.display_name || cleanEmail.split("@")[0],
      role: mailboxData?.role || "Staff Member",
      mailboxId: mailboxData?.id,
    });

    return NextResponse.json({
      success: true,
      user: {
        email: cleanEmail,
        name: mailboxData?.display_name || cleanEmail.split("@")[0],
        role: mailboxData?.role || "Staff Member",
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
