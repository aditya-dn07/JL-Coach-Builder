'use client';
import { useEffect, useRef, useState } from 'react';
import { LibraryIcon } from '@/components/shared/library-icon';
import { siteConfig } from '@/config/site';

export function ReviewSlider({ reviews, preserveAuthors = false }: { reviews: { text: string; author: string }[]; preserveAuthors?: boolean }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  function move(direction: number) {
    const element = viewport.current;
    const card = element?.firstElementChild as HTMLElement | null;
    if (!element || !card) return;
    const step = card.getBoundingClientRect().width + 20;
    const maximum = element.scrollWidth - element.clientWidth;
    let next = element.scrollLeft + direction * step;
    if (next > maximum + 2) next = 0;
    if (next < -2) next = maximum;
    element.scrollTo({ left: next, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (hovered || focused) return;
    const timer = window.setInterval(() => { if (!reduced.matches) move(1); }, 4000);
    return () => window.clearInterval(timer);
  }, [hovered, focused]);

  return <div className="review-slider" role="region" aria-roledescription="carousel" aria-label={siteConfig.ui.reviewRegion} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div ref={viewport} id="home-review-slides" className="review-slider-viewport" tabIndex={0} aria-label={siteConfig.ui.reviewScroll} onScroll={() => {
      const element = viewport.current;
      const card = element?.firstElementChild;
      if (element && card) setIndex(Math.round(element.scrollLeft / (card.getBoundingClientRect().width + 20)));
    }}>
      {reviews.map((review, position) => <blockquote key={review.author} role="group" aria-roledescription="slide" aria-label={`${position + 1} of ${reviews.length}`}>
        <span className="review-card-stars" aria-label={siteConfig.ui.reviewStarsAria}>{siteConfig.ui.googleStars}</span><p>{review.text}</p>
        <footer><span className="review-avatar">{review.author[0]}</span><div><strong>{preserveAuthors ? review.author : review.author.split(',')[0]}</strong>{!preserveAuthors && <span>{siteConfig.ui.reviewLocation}</span>}</div><span className="review-google" aria-label={siteConfig.ui.reviewSource}>{siteConfig.ui.reviewSourceMark}</span></footer>
      </blockquote>)}
    </div>
    <div className="review-slider-controls">
      <button type="button" aria-label={siteConfig.ui.reviewPrevious} aria-controls="home-review-slides" onClick={() => move(-1)}><LibraryIcon name="chevron-left" /></button>
      <span>{siteConfig.ui.reviewPositionPrefix}{index + 1}{siteConfig.ui.reviewPositionJoin}{reviews.length}</span>
      <button type="button" aria-label={siteConfig.ui.reviewNext} aria-controls="home-review-slides" onClick={() => move(1)}><LibraryIcon name="chevron-right" /></button>
    </div>
  </div>;
}
