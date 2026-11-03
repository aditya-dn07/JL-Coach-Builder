'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
export function MotionEffects() {
  const path = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!reduced.matches) {
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('revealed');
              observer.unobserve(e.target);
            }
          }),
        { threshold: 0.08 }
      );
      elements.forEach((el) => {
        el.classList.add('will-reveal');
        observer.observe(el);
      });
      const scroll = () => {
        const total = document.documentElement.scrollHeight - innerHeight;
        if (progress.current)
          progress.current.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
      };
      window.addEventListener('scroll', scroll, { passive: true });
      scroll();
      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', scroll);
        elements.forEach((el) => el.classList.remove('will-reveal'));
      };
    }
  }, [path]);
  return <div className="reading-progress" ref={progress} aria-hidden="true" />;
}
