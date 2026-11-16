import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { currentUser } from "@/lib/mock-data";

export async function GET() {
  const session = await getSession();

  if (!session) {
    // If no active session, return default currentUser preview
    return NextResponse.json({
      authenticated: false,
      user: currentUser,
    });
  }

  // Attempt to enrich with database profile
  try {
    const supabase = await createClient();
    const { data: mailbox } = await supabase
      .from("mailboxes")
      .select("*")
      .eq("email", session.email)
      .single();

    if (mailbox) {
      return NextResponse.json({
        authenticated: true,
        user: {
          name: mailbox.display_name,
          role: mailbox.role,
          email: mailbox.email,
          initials: mailbox.initials,
          color: mailbox.avatar_color || "bg-[#0b3d2a]",
          addresses: mailbox.aliases && mailbox.aliases.length > 0 ? mailbox.aliases : [mailbox.email],
        },
      });
    }
  } catch {
    // Fallback to session data
  }

  const initials = session.name
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .join("")
    .slice(0, 2) || "SM";

  return NextResponse.json({
    authenticated: true,
    user: {
      name: session.name,
      role: session.role || "Staff Member",
      email: session.email,
      initials,
      color: "bg-[#0b3d2a]",
      addresses: [session.email],
    },
  });
}
