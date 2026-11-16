import { cookies } from "next/headers";

export const SESSION_COOKIE = "sm_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "superior-mail-secure-session-key-2026";

export interface SessionData {
  email: string;
  name: string;
  role: string;
  mailboxId?: string;
  exp?: number;
}

// Convert ArrayBuffer to base64url string
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Convert base64url string to Uint8Array
function base64UrlToBuffer(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates an HMAC SHA-256 signed JWT-like token (Edge & Node compatible).
 */
export async function signToken(data: SessionData): Promise<string> {
  const encoder = new TextEncoder();
  const payload = JSON.stringify({
    ...data,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  });

  const encodedPayload = bufferToBase64Url(encoder.encode(payload).buffer);
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload));
  const signature = bufferToBase64Url(signatureBuffer);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies an HMAC SHA-256 token and returns the parsed SessionData if valid.
 */
export async function verifyToken(token: string): Promise<SessionData | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const encoder = new TextEncoder();
    const key = await getHmacKey();
    const signatureBytes = base64UrlToBuffer(signature);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(encodedPayload)
    );

    if (!isValid) return null;

    const decoder = new TextDecoder();
    const payloadBytes = base64UrlToBuffer(encodedPayload);
    const json = JSON.parse(decoder.decode(payloadBytes)) as SessionData;

    if (json.exp && json.exp < Date.now()) {
      return null; // Expired
    }

    return json;
  } catch {
    return null;
  }
}

/**
 * Server-only helper to set the HTTP-only session cookie.
 */
export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const token = await signToken(data);

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Server-only helper to retrieve the current validated session.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie?.value) return null;

  return verifyToken(cookie.value);
}

/**
 * Server-only helper to delete the session cookie upon logout.
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
