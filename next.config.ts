
import type { NextConfig } from 'next';

export default function config(): NextConfig {
  return {
    // Use Next.js default build directory (.next)
    poweredByHeader: false,

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
