import localFont from 'next/font/local';

export const headingFont = localFont({
  src: '../../public/fonts/outfit-variable.ttf',
  weight: '100 900',
  variable: '--font-display',
  display: 'swap',
});

export const bodyFont = localFont({
  src: '../../public/fonts/inter-latin.woff2',
  weight: '100 900',
  variable: '--font-body',
  display: 'swap',
});

export const brandFontVariables = `--font-home-heading: ${headingFont.style.fontFamily}; --font-home-body: ${bodyFont.style.fontFamily};`;
