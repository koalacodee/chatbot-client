// middleware.ts
import { env } from "next-runtime-env";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const excludedRoutes = [
  "/login",
  "/register",
  "/login/verify",
  "/register/verify",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inject custom header in all requests
  const headers = new Headers(request.headers);
  headers.set("x-current-path", pathname);

  // // Skip auth check for login page
  // if (!excludedRoutes.includes(pathname)) {
  //   const url = `${env("NEXT_PUBLIC_API_URL")}/auth/guest/check`;
  //   const cookie = request.headers.get("cookie");

  //   // fetch response
  //   const apiResponse = await fetch(url, {
  //     method: "POST",
  //     headers: cookie ? { cookie } : {},
  //   });

  //   if (!apiResponse.ok) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  return NextResponse.next({ headers });
}

export const config = {
  // Apply on all routes except api, _next, and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
