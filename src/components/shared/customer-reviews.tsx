import { site } from '@/data/site.data';
import { GoogleReviewBadge } from '@/components/shared/google-review-badge';

export function Reviews() {
  const reviews = site.reviews.slice(0, 3);
  return (
    <section className="reviews-block section-pad container">
      <div className="section-heading" data-reveal>
        <p className="kicker">Good words. From good people.</p>
        <h2>
          Trusted with their
          <br />
          <span>home away from home.</span>
        </h2>
        <p className="review-stars">
          ★★★★★ <span>4.9 on Google · 100+ five-star reviews</span>
        </p>
      </div>
      <div className="reviews-grid">
        {reviews.map((r) => (
          <blockquote key={r.author} data-reveal>
            <span className="quote-mark">“</span>
            <p>{r.text}</p>
            <footer>
              <span className="review-avatar">{r.author[0]}</span>
              <div>
                <strong>{r.author}</strong>
                <span>{r.location}</span>
              </div>
              <GoogleReviewBadge />
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
