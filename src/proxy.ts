import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Protéger certaines pages
  const protectedRoutes = ["/parts", "/new-part", "/entree-sortie"];

  if (protectedRoutes.some(r => req.nextUrl.pathname.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/parts/:path*",
    "/new-part/:path*",
    "/entree-sortie/:path*",
  ],
};
