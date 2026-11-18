'use client';
import { useSiteContent } from '@/components/providers/site-content';
import { ContentImage as Image } from '../shared/content-image';

export function GoogleReviewBadge() {
  const { siteConfig } = useSiteContent();
  return <span className="review-source-badge" role="img" aria-label={siteConfig.ui.reviewSource}>
    <Image src={siteConfig.images.googleIcon.src} caption={siteConfig.images.googleIcon.caption} decorative={siteConfig.images.googleIcon.decorative} focalPoint={siteConfig.images.googleIcon.focalPoint} alt={siteConfig.images.googleIcon.alt} width={32} height={32} />
  </span>;
}
