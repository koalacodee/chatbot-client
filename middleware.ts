// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inject custom header in all requests
  const headers = new Headers(request.headers);
  console.log(headers.get("accept-language"));
  const lang = headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  headers.set("x-lang", lang || "en");
  headers.set("x-current-path", pathname);

  return NextResponse.next({ headers });
}

export const config = {
  // Apply on all routes except api, _next, and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
