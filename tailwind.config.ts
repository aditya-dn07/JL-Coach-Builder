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
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
