'use client';
import { useEffect, useRef } from 'react';
import { phoneHref, siteConfig } from '@/config/site';
import { LibraryIcon } from '@/components/shared/library-icon';

export function MobileActionBar() {
  const barRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const measure = () => {
      const style = getComputedStyle(bar);
      if (style.display === 'none') return;
      // The variable excludes the safe-area inset, which CSS adds to both consumers.
      const base = bar.getBoundingClientRect().height - (parseFloat(style.paddingBottom) - 12);
      if (base > 0) document.documentElement.style.setProperty('--sticky-bar-h', `${base}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    measure();
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--sticky-bar-h'); };
  }, []);
  return (
    <nav ref={barRef} className="mobile-action-bar" aria-label="Quick contact">
      <a className="mobile-action-button mobile-action-call" href={phoneHref}>
        <LibraryIcon name="telephone" />Call Now
      </a>
      <a className="mobile-action-button mobile-action-quote" href="#quote">
        <LibraryIcon name="chat-square-text" />{siteConfig.ui.quote}
      </a>
    </nav>
  );
}
