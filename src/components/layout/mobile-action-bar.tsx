'use client';
import { useSiteContent } from '@/components/providers/site-content';
import { useEffect, useRef } from 'react';
import { LibraryIcon } from '@/components/shared/library-icon';

export function MobileActionBar() {
  const { phoneHref, siteConfig, editorial } = useSiteContent();
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
    <nav ref={barRef} className="mobile-action-bar" aria-label={editorial.interface.copy.quickContact}>
      <a className="mobile-action-button mobile-action-call" href={phoneHref}>
        <LibraryIcon name="telephone" />{editorial.interface.copy.callNow}
      </a>
      <a className="mobile-action-button mobile-action-quote" href={siteConfig.ui.quoteTarget}>
        <LibraryIcon name="chat-square-text" />{siteConfig.ui.quote}
      </a>
    </nav>
  );
}
