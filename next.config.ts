
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
    // Freeze the non-secret deployment tier into both server and edge bundles.
    // Local edge workers otherwise omit VERCEL_ENV even when next start has it.
    env: { VERCEL_ENV: process.env.VERCEL_ENV ?? 'development' },

    images: {
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
            ...(process.env.VERCEL_ENV !== 'production'
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
