import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow unauthenticated access to login and signup pages
    if (path === "/employer/login" || path === "/employer/signup") {
      // If they are already logged in as employer, redirect to dashboard
      if (token?.role === "employer") {
        return NextResponse.redirect(new URL("/employer/post-job", req.url));
      }
      return NextResponse.next();
    }

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
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path === "/employer/login" || path === "/employer/signup") {
          return true; // Always allow these routes
        }
        return !!token; // Require token for everything else matched
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/employer/:path*", "/candidate/:path*"],
};
