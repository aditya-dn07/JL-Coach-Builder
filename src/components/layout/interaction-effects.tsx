'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { animate } from 'motion';

const actions = '.button, .underlink, .section-link, .road-discover, .road-quote-link, .round-cta, .header-cta, .alternate-actions a, .studio-hero-note a, .alternate-bottom a, .service-links a';

export function InteractionEffects() {
  const path = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Map<Element, ReturnType<typeof animate>>();
    const active = new Set<HTMLElement>();
    const target = (event: PointerEvent) => event.target instanceof Element
      ? event.target.closest<HTMLElement>(actions) : null;
    const scale = (element: HTMLElement, value: number) => {
      animations.get(element)?.stop();
      animations.set(element, animate(element, { scale: value }, { duration: 0.18, ease: 'easeOut' }));
      active.add(element);
    };
    const enter = (event: PointerEvent) => {
      const element = target(event);
      if (!element || reduced.matches || event.pointerType !== 'mouse' || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      scale(element, 1.025);
    };
    const leave = (event: PointerEvent) => {
      const element = target(event);
      if (!element || reduced.matches || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      scale(element, 1);
    };
    const press = (event: PointerEvent) => {
      const element = target(event);
      if (element && !reduced.matches) scale(element, 0.98);
    };
    const release = () => active.forEach((element) => scale(element, 1));
    const reset = () => {
      animations.forEach((animation) => animation.stop());
      active.forEach((element) => {
        element.style.removeProperty('scale');
        element.style.removeProperty('transform');
      });
      animations.clear();
      active.clear();
    };
    document.addEventListener('pointerover', enter);
    document.addEventListener('pointerout', leave);
    document.addEventListener('pointerdown', press);
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    reduced.addEventListener('change', reset);
    return () => {
      document.removeEventListener('pointerover', enter);
      document.removeEventListener('pointerout', leave);
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      reduced.removeEventListener('change', reset);
      reset();
    };
  }, [path]);
  return null;
}
