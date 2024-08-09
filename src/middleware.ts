import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.nextUrl);
  const _rid = url.searchParams.get("_rid");

  if (_rid) {
    const expires = new Date();
    const expireDays = 2;
    expires.setDate(expires.getDate() + expireDays);
    const response = NextResponse.next();
    response.cookies.set("_rid", _rid, {
      expires
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // All pages but ignoring `/_next/`, `/api/` '/images' and '/public' subpaths
  matcher: [
    "/((?!_next/static|_next/image|robots.txt|public|images|manifest.json|sw.js|favicon.ico|workbox-*).*)",
    "/"
  ]
};
