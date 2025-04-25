import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

// List of paths that don't require authentication
const publicPaths = ["/", "/api/auth"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is public
  if (publicPaths.some((publicPath) => path === publicPath || path.startsWith(publicPath))) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("token")?.value

  // If no token, redirect to auth page
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    // Verify token without database access
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
    jwt.verify(token, JWT_SECRET)

    // Token is valid, proceed
    return NextResponse.next()
  } catch (error) {
    // Error verifying token, redirect to auth page
    const response = NextResponse.redirect(new URL("/", request.url))
    response.cookies.delete("token")
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
