import { NextResponse, type NextRequest } from 'next/server';
import { publicPagePath } from '@/lib/seo-targets';
import { productionIndexingEnabled } from '@/lib/indexing';

// Redirect only known public page aliases. API, Studio and resources keep their paths.
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const destination = publicPagePath(path);
  const redirect = destination && destination !== path;
  // Use a standard URL: NextURL retains the old path's slash setting. Host is
  // used only to retain the requesting origin, never to decide indexability.
  const url = new URL(request.url);
  if (redirect) url.pathname = destination;
  const host = request.headers.get('host');
  if (host) url.host = host;
  const response = redirect ? NextResponse.redirect(url, 308) : NextResponse.next();
  if (!productionIndexingEnabled()) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
