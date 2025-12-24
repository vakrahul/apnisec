import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Bypass Auth for API routes so Postman works
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Keep your existing logic here (if any)
  // If you are using Clerk/NextAuth, their matcher usually handles the rest.
  
  return NextResponse.next();
}

export const config = {
  // This matcher ensures middleware runs on all routes except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};