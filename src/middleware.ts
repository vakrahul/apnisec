import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. ALLOW all API routes (issues, users, auth, etc.) to bypass login check
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Default behavior for other pages
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to everything EXCEPT static files and images
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};