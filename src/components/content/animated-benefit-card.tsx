'use client';
import { motion, useReducedMotion } from 'motion/react';
import { type CSSProperties, type ReactNode } from 'react';
import { LibraryIcon } from '@/components/shared/library-icon';
import { interiorMotion } from '@/lib/motion';

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
export function InteriorReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={`[--interior-reveal-distance:6px] md:[--interior-reveal-distance:12px] ${className}`} initial={false} whileInView={reduced ? undefined : { opacity: [0.88, 1], y: ['var(--interior-reveal-distance)', '0px'] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduced ? 0 : interiorMotion.reveal, delay: reduced ? 0 : delay, ease: interiorMotion.ease }}>{children}</motion.div>;
}
export function InteriorListItem({ children, index, className = '', style }: { children: ReactNode; index: number; className?: string; style?: CSSProperties }) {
  const reduced = useReducedMotion();
  return <motion.li style={style} className={`[--interior-list-distance:4px] md:[--interior-list-distance:8px] ${className}`} initial={false} whileInView={reduced ? undefined : { opacity: [0.88, 1], y: ['var(--interior-list-distance)', '0px'] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduced ? 0 : interiorMotion.reveal, delay: reduced ? 0 : Math.min(index, 6) * interiorMotion.stagger, ease: interiorMotion.ease }}>{children}</motion.li>;
}

export function InteriorCard({ children, index, className = '', style }: { children: ReactNode; index: number; className?: string; style?: CSSProperties }) {
  const reduced = useReducedMotion();
  return <motion.article style={style} className={className} initial={false} whileInView={reduced ? undefined : { opacity: [0.88, 1], y: [6, 0] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: reduced ? 0 : interiorMotion.reveal, delay: reduced ? 0 : Math.min(index, 6) * interiorMotion.stagger, ease: interiorMotion.ease }}>{children}</motion.article>;
}

export function InteriorFaq({ question, children, id }: { question: string; children: ReactNode; id: string }) {
  return <details id={id} name={id.replace(/-\d+$/, '')}>
    <summary>{question}<span className="faq-toggle-icon" aria-hidden="true"><LibraryIcon name="plus-lg" className="faq-plus" /><LibraryIcon name="x-lg" className="faq-close" /></span></summary>
    <p className="motion-safe:animate-interior-faq">{children}</p>
  </details>;
}

export function InteriorTimelineLine() {
  const reduced = useReducedMotion();
  return <motion.div aria-hidden="true" className="interior-timeline-line" initial={false} whileInView={reduced ? undefined : { scaleY: [0.01, 1], opacity: [0.5, 1] }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: reduced ? 0 : interiorMotion.hero, ease: interiorMotion.ease }} />;
}
