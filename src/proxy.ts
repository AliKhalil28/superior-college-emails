import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;

  const session = sessionCookie ? await verifyToken(sessionCookie) : null;
  const isAuthenticated = !!session;

  // 1. Protect mail application routes (/mail, /mail/compose, /mail/settings, etc.)
  if (pathname.startsWith("/mail")) {
    if (!isAuthenticated) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. Redirect already signed-in staff away from /login back to /mail
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/mail", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, icon.png, apple-icon.png (static branding assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|icon.png|apple-icon.png).*)",
  ],
};
