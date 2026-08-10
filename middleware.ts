import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Try getting token with secure cookie assumption first (Vercel production)
  let token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "super-secret-key-job-portal-platform",
    secureCookie: process.env.NODE_ENV === "production",
  });

  // Fallback if not found (e.g. local dev or preview environment without HTTPS)
  if (!token) {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "super-secret-key-job-portal-platform",
      secureCookie: false,
    });
  }

  const path = req.nextUrl.pathname;

  // If user is already logged in and tries to access any login/signup page
  if (token) {
    if (path === "/login" || path === "/signup" || path === "/employer/login" || path === "/employer/signup" || path === "/admin/login") {
      if (token.role === "employer") {
        return NextResponse.redirect(new URL("/employer/post-job", req.url));
      } else if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  if (!token) {
    if (path === "/employer/login" || path === "/employer/signup" || path === "/login" || path === "/signup" || path === "/admin/login") {
      return NextResponse.next();
    }

    if (path.startsWith("/employer")) {
      const url = new URL("/employer/login", req.url);
      url.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/admin")) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(url);
    }
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(url);
  }

  const role = token.role;

  // Route guards based on user role
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/employer") && role !== "employer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/candidate") && role !== "candidate") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employer/:path*", "/candidate/:path*", "/login", "/signup"],
};
