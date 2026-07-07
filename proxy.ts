import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
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
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/employer/:path*", "/candidate/:path*"],
};
