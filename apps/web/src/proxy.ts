import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/ai',
  '/posts',
  '/analytics',
  '/settings',
  '/accounts',
  '/monetization',
  '/notifications',
  '/admin',
  '/compare',
  '/onboarding',
];

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ['/login', '/signup'];

// Routes that need no redirect logic at all (public or special)
const PUBLIC_ROUTES = ['/', '/auth/google/callback', '/pricing', '/about', '/contact'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('zy_logged_in')?.value === '1';

  // Skip proxy logic for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/signup
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (they have their own auth)
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, public files
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};