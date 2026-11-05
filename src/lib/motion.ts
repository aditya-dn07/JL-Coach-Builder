import type { CSSProperties } from 'react';

export const interiorMotion = {
  fast: 0.24,
  reveal: 0.42,
  hero: 0.56,
  stagger: 0.07,
  ease: [0.22, 1, 0.36, 1] as const,
} as const;

export const interiorMotionStyle = {
  '--interior-hero': `${interiorMotion.hero}s`,
  '--interior-fast': `${interiorMotion.fast}s`,
  '--interior-ease': `cubic-bezier(${interiorMotion.ease.join(',')})`,
} as CSSProperties;
