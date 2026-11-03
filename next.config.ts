import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
export default function config(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next' : '.next-production',
    output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
    poweredByHeader: false,
    images: { formats: ['image/avif', 'image/webp'] },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          ],
        },
      ];
    },
  };
}
