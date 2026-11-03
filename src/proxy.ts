import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// private routes guard
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const cs_loginUrl = new URL("/login", request.url);
  cs_loginUrl.searchParams.set("redirect", `${pathname}${search}`);
  return NextResponse.redirect(cs_loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/studios/edit/:path*",
    "/wishlist/:path*",
  ],
};
