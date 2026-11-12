import { siteConfig } from '@/config/site';
import { GoogleReviewBadge } from '@/components/shared/google-review-badge';

export type CustomerReview = { text: string; author: string };

export function ReviewCard({ review, preserveAuthor = false, position, total }: {
  review: CustomerReview;
  preserveAuthor?: boolean;
  position?: number;
  total?: number;
}) {
  return <blockquote role={position === undefined ? undefined : 'group'} aria-roledescription={position === undefined ? undefined : 'slide'} aria-label={position === undefined ? undefined : `${position + 1} of ${total}`}>
    <span className="review-card-stars" aria-label={siteConfig.ui.reviewStarsAria}>{siteConfig.ui.googleStars}</span>
    <p>{review.text}</p>
    <footer>
      <span className="review-avatar">{review.author[0]}</span>
      <div><strong>{preserveAuthor ? review.author : review.author.split(',')[0]}</strong>{!preserveAuthor && <span>{siteConfig.ui.reviewLocation}</span>}</div>
      <GoogleReviewBadge />
    </footer>
  </blockquote>;
}
