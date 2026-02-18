import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Example: token from cookies
  const token = request.cookies.get("auth_token")?.value

  const protectedRoutes = [
    "/dashboard",
    "/community",
    "/profile",
    // "/admin",
  ]

  const authRoutes = ["/login", "/register"]

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  const isAuthRoute = authRoutes.includes(pathname)

  // 🚫 Not logged in → redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 🔁 Logged in → prevent access to login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}
