import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/auth/session";

function formatNameFromEmail(email: string): string {
  const local = email.split("@")[0] || "Staff";
  return local
    .split(".")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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

    // 1. Dashboard Authentication (Internal Database / Staff Portal)
    const isMasterPass =
      Boolean(process.env.SUPABASE_DB_PASSWORD) && password === process.env.SUPABASE_DB_PASSWORD;
    const isCollegeStaff = cleanEmail.endsWith("@superiorcollegemc.com");

    // Allow staff members with valid college email or master password
    if (!isCollegeStaff && !isMasterPass) {
      return NextResponse.json(
        {
          error: "Please enter your official college mailbox (@superiorcollegemc.com)",
        },
        { status: 401 }
      );
    }

    const defaultName = formatNameFromEmail(cleanEmail);

    // 2. Query or auto-provision staff profile in Supabase Database
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
          .join("")
          .slice(0, 2) || "SM";

        const { data: created } = await supabase
          .from("mailboxes")
          .insert({
            email: cleanEmail,
            display_name: defaultName,
            initials,
            default_from: cleanEmail,
            aliases: [cleanEmail],
          })
          .select("*")
          .single();

        mailboxData = created;
      }
    } catch {
      // Graceful fallback if database tables are in migration
    }

    const resolvedName = mailboxData?.display_name || defaultName;

    // 3. Create secure HTTP-only dashboard session
    await createSession({
      email: cleanEmail,
      name: resolvedName,
      role: mailboxData?.role || "Staff Member",
      mailboxId: mailboxData?.id,
    });

    return NextResponse.json({
      success: true,
      user: {
        email: cleanEmail,
        name: resolvedName,
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
