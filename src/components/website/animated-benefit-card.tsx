'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function AnimatedBenefitCard({ children, index }: { children: ReactNode; index: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className="benefit-photo-card"
      initial={false}
      whileInView={reduced ? undefined : { opacity: [0.8, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
    >
      {children}
    </motion.article>
  );
}
