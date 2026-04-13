import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createHmac, timingSafeEqual } from 'crypto';

/** Verify an HMAC-signed token using Node.js crypto */
function verifyToken(token: string, accessCode: string): boolean {
  const dotIndex = token.indexOf('.');
  if (dotIndex === -1) return false;

  const timestamp = token.substring(0, dotIndex);
  const signature = token.substring(dotIndex + 1);

  const expected = createHmac('sha256', accessCode).update(timestamp).digest('hex');

  // Constant-length comparison
  if (signature.length !== expected.length) return false;
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return timingSafeEqual(sigBuffer, expectedBuffer);
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that don't require authentication
  const publicPaths = [
    '/login',
    '/api/auth',           // NextAuth endpoints
    '/api/health',         // Health check
    '/_next',              // Next.js internals
    '/favicon.ico',
    '/logos',              // Static logos
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Check access code authentication (existing logic)
  const accessCode = process.env.ACCESS_CODE;
  let accessCodeValid = false;
  
  if (accessCode) {
    const cookie = request.cookies.get('openmaic_access');
    if (cookie?.value) {
      accessCodeValid = verifyToken(cookie.value, accessCode);
    }
  } else {
    // No access code configured, treat as valid
    accessCodeValid = true;
  }

  // If path is public, allow through
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check NextAuth session
  const session = await auth();

  // If authenticated via NextAuth, allow through
  if (session?.user) {
    return NextResponse.next();
  }

  // If access code is valid (and access code is configured), allow through
  if (accessCodeValid && accessCode) {
    return NextResponse.next();
  }

  // No valid authentication - redirect to login
  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { success: false, errorCode: 'UNAUTHORIZED', error: 'Authentication required' },
      { status: 401 },
    );
  }

  // Redirect to login page for page requests
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

export const runtime = 'nodejs';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logos/).*)'],
};