import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const safeUrl = (targetPath: string, req: NextRequest) => {
  try {
    const origin = req.nextUrl?.origin || (req.url ? new URL(req.url).origin : "https://tejomargjobs.com");
    return new URL(targetPath, origin);
  } catch (e) {
    try {
      const base = process.env.NEXTAUTH_URL || "https://tejomargjobs.com";
      const cleanBase = base.startsWith("http") ? base : `https://${base}`;
      return new URL(targetPath, cleanBase);
    } catch (err) {
      return new URL(targetPath, "https://tejomargjobs.com");
    }
  }
};

export async function proxy(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || "super-secret-key-job-portal-platform";
  const path = req.nextUrl.pathname;

  // Get token with fallback for secure/unsecure cookies
  let token = await getToken({ req, secret, secureCookie: process.env.NODE_ENV === "production" });
  if (!token) {
    token = await getToken({ req, secret, secureCookie: false });
  }

  const isAuthPage =
    path === "/login" ||
    path === "/signup" ||
    path === "/employer/login" ||
    path === "/employer/signup" ||
    path === "/admin/login";

  // If user has a valid active session and visits an auth page
  if (token && isAuthPage) {
    if (token.role === "employer") {
      return NextResponse.redirect(safeUrl("/employer/manage-jobs", req));
    } else if (token.role === "admin") {
      return NextResponse.redirect(safeUrl("/admin", req));
    } else if (token.role === "candidate") {
      return NextResponse.redirect(safeUrl("/candidate/profile", req));
    }
    return NextResponse.next();
  }

  // If user is NOT logged in
  if (!token) {
    if (isAuthPage) return NextResponse.next();

    if (path.startsWith("/employer")) {
      const url = safeUrl("/employer/login", req);
      url.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/admin")) {
      const url = safeUrl("/admin/login", req);
      url.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/candidate")) {
      const url = safeUrl("/login", req);
      url.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const role = token.role;

  // Role guards
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(safeUrl("/admin/login", req));
  }

  if (path.startsWith("/employer") && role !== "employer") {
    return NextResponse.redirect(safeUrl("/employer/login", req));
  }

  if (path.startsWith("/candidate") && role !== "candidate") {
    return NextResponse.redirect(safeUrl("/login", req));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employer/:path*", "/candidate/:path*", "/login", "/signup"],
};
