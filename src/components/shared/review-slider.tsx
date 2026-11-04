'use client';
import { useEffect, useRef, useState } from 'react';
import { LibraryIcon } from '@/components/shared/library-icon';

export function ReviewSlider({ reviews }: { reviews: { text: string; author: string }[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);

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
    if (paused || interacting) return;
    const timer = window.setInterval(() => { if (!reduced.matches) move(1); }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, interacting]);

  return <div className="review-slider" role="region" aria-roledescription="carousel" aria-label="Customer reviews" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
    <div ref={viewport} id="home-review-slides" className="review-slider-viewport" tabIndex={0} aria-label="Scroll customer reviews" onScroll={() => {
      const element = viewport.current;
      const card = element?.firstElementChild;
      if (element && card) setIndex(Math.round(element.scrollLeft / (card.getBoundingClientRect().width + 20)));
    }}>
      {reviews.map((review, position) => <blockquote key={review.author} role="group" aria-roledescription="slide" aria-label={`${position + 1} of ${reviews.length}`}>
        <span className="review-card-stars" aria-label="5 out of 5 stars">★★★★★</span><p>{review.text}</p>
        <footer><span className="review-avatar">{review.author[0]}</span><div><strong>{review.author.split(',')[0]}</strong><span>Christchurch</span></div><span className="review-google" aria-label="Google review">G</span></footer>
      </blockquote>)}
    </div>
    <div className="review-slider-controls">
      <button type="button" aria-label="Previous review" aria-controls="home-review-slides" onClick={() => move(-1)}><LibraryIcon name="chevron-left" /></button>
      <span>Review {index + 1} of {reviews.length}</span>
      <button type="button" aria-label="Next review" aria-controls="home-review-slides" onClick={() => move(1)}><LibraryIcon name="chevron-right" /></button>
      <button type="button" aria-label={paused ? 'Play review slider' : 'Pause review slider'} aria-pressed={paused} onClick={() => setPaused(!paused)}><LibraryIcon name={paused ? 'play-fill' : 'pause-fill'} /></button>
    </div>
  </div>;
}
