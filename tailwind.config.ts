import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'banner-photo': 'banner-photo 1.2s ease-out both',
        'banner-copy': 'banner-copy .7s ease-out both',
        'services-scroll': 'services-scroll 20s linear infinite',
      },
      keyframes: {
        'banner-photo': { from: { transform: 'scale(1.035)' }, to: { transform: 'scale(1)' } },
        'banner-copy': { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'services-scroll': { to: { transform: 'translateX(-50%)' } },
      },
      colors: {
        brand: 'var(--red)',
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        surface: '#171d24',
        line: '#36414e',
      },
      fontSize: { chrome: ['15px', '1.6'] },
      screens: { nav: '1001px', wide: '1401px' },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
