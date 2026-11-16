import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { emails as seedEmails } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "inbox";
  const session = await getSession();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("folder", folder)
      .order("received_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Map database schema to frontend Email format
      const formatted = data.map((row) => ({
        id: row.id,
        folder: row.folder,
        from: {
          name: row.from_name,
          email: row.from_email,
          initials: row.from_initials || row.from_name.slice(0, 2).toUpperCase(),
          color: row.from_color || "bg-[#0b3d2a]",
        },
        to: row.to_address,
        subject: row.subject,
        preview: row.snippet || (row.body?.[0] ? row.body[0].slice(0, 110) : "…"),
        body: Array.isArray(row.body) ? row.body : [row.body || ""],
        date: row.date_label || "Today",
        time: row.time_label || new Date(row.received_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        unread: row.unread ?? false,
        starred: row.starred ?? false,
        hasAttachment: row.has_attachment ?? false,
        attachments: row.attachments || [],
        labels: row.labels || [],
        category: row.category || "primary",
      }));

      return NextResponse.json({ emails: formatted, source: "database" });
    }
  } catch {
    // If table not yet created or connection offline, return seed data
  }

  // Filter seed emails by requested folder
  const filtered = seedEmails.filter((e) => (folder === "starred" ? e.starred : e.folder === folder));
  return NextResponse.json({ emails: filtered, source: "seed", sessionUser: session });
}
