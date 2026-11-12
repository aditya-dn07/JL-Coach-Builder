import { NextResponse, type NextRequest } from 'next/server';
import site from '@/config/site.json';

// Also protect production aliases (including the production *.vercel.app URL).
// Preview access stays available; indexing permission belongs to the canonical host.
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const hostname = request.headers.get('host')?.split(':')[0] ?? request.nextUrl.hostname;
  if (process.env.VERCEL_ENV !== 'production' || hostname !== new URL(site.url).hostname) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
