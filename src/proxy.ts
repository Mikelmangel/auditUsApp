import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth', '/auth/callback'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const hasSession =
    request.cookies.has('sb-liefrrkvcmalbivwwtqy-auth-token') ||
    request.cookies.has('sb-access-token') ||
    [...request.cookies.getAll()].some(c => c.name.startsWith('sb-') && c.name.includes('auth'));

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.ico$|.*\\.webp$|manifest.json).*)'],
};
