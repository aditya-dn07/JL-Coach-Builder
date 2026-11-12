import Image from 'next/image';
import { siteConfig } from '@/config/site';

export function GoogleReviewBadge() {
  return <span className="review-source-badge" role="img" aria-label={siteConfig.ui.reviewSource}>
    <Image src={siteConfig.images.googleIcon.src} alt="" width={32} height={32} />
  </span>;
}
