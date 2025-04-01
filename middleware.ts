import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Get the token from cookies
  const token = request.cookies.get('token')?.value
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/forgot-password', '/reset-password']
  if (publicPaths.includes(path)) {
    if (token) {
      // If user is logged in, redirect based on role
      if (user.role === 'Administrator') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/user/dashboard', request.url))
      }
    }
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin paths
  const adminPaths = ['/dashboard', '/calendar', '/settings', '/users']
  // User paths
  const userPaths = ['/user/dashboard', '/user/calendar', '/user/settings']

  // Handle admin routes
  if (adminPaths.some(p => path.startsWith(p))) {
    if (user.role !== 'Administrator') {
      return NextResponse.redirect(new URL('/user/dashboard', request.url))
    }
  }

  // Handle user routes
  if (userPaths.some(p => path.startsWith(p))) {
    if (user.role === 'Administrator') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 