
import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import { readFileSync } from 'node:fs';

export default function config(phase: string): NextConfig {
  if (process.env.CONTENT_STRICT === '1') {
    const content = readFileSync('src/content/pages.json', 'utf8');
    const remaining = content.match(/\[(?:Description|Subheading|Heading) needed\]/g) ?? [];
    if (remaining.length) throw new Error(`Content has ${remaining.length} unresolved placeholders.`);
  }
  const isVercel = process.env.VERCEL === '1';
  return {
    // Vercel's Next.js adapter expects .next; isolate only local production builds.
    distDir: isVercel || phase === PHASE_DEVELOPMENT_SERVER ? '.next' : '.next-production',
    poweredByHeader: false,
    // Middleware adds slashes only to public pages; resource/Studio URLs stay unchanged.
    trailingSlash: false,
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
    // Keep route metadata in the initial head for browsers and all crawlers.
    htmlLimitedBots: /.*/,
    // Freeze the non-secret deployment tier into both server and edge bundles.
    // Local edge workers otherwise omit VERCEL_ENV even when next start has it.
    env: { VERCEL_ENV: process.env.VERCEL_ENV ?? 'development', SITE_ENVIRONMENT: process.env.SITE_ENVIRONMENT ?? 'staging' },

    images: {
      remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' }],
      formats: ['image/avif', 'image/webp'],
    },

    output:
      process.env.BUILD_STANDALONE === '1'
        ? 'standalone'
        : undefined,

    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            ...(!(process.env.VERCEL_ENV === 'production' && process.env.SITE_ENVIRONMENT === 'production')
              ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
              : []),
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
          ],
        },
      ];
    },
  };
}
