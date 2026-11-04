import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
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
