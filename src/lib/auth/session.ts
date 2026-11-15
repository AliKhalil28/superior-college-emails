import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "sm_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "superior-mail-secure-session-key-2026";

export interface SessionData {
  email: string;
  name: string;
  role: string;
  mailboxId?: string;
}

function sign(payload: string): string {
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  return hmac.digest("base64url");
}

export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const payload = JSON.stringify({ ...data, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = sign(encoded);
  const token = `${encoded}.${signature}`;

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;

  try {
    const [encoded, signature] = cookie.value.split(".");
    if (!encoded || !signature) return null;

    const expectedSig = sign(encoded);
    if (signature !== expectedSig) return null;

    const json = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (json.exp && json.exp < Date.now()) {
      return null;
    }
    return json;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
