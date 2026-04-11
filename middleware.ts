import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  EMBED_SESSION_COOKIE,
  EMBED_TOKEN_TTL_SECONDS,
} from "@/lib/embed/session";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname !== "/embed") {
    return NextResponse.next();
  }

  const token = searchParams.get("token");

  if (!token) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.delete(EMBED_SESSION_COOKIE);
    return response;
  }

  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set({
    name: EMBED_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: EMBED_TOKEN_TTL_SECONDS,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/embed"],
};
