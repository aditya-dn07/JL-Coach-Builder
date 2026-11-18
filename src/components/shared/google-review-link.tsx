import { ContentImage as Image } from '../shared/content-image';
import { getSiteContent } from '@/lib/sanity/site-content';


export async function GoogleReviewLink() {
  const { googleReviewHref, contentRepository, editorial, siteConfig } = await getSiteContent();
  const ui = contentRepository.getSiteSettings().ui;
  const Tag = googleReviewHref ? 'a' : 'span';
  return (
    <Tag
      href={googleReviewHref}
      target={googleReviewHref ? '_blank' : undefined}
      rel={googleReviewHref ? 'noopener noreferrer nofollow' : undefined}
      aria-label={googleReviewHref ? ui.googleRatingAria : 'Google rating: 4.9 out of 5'}
      className="google-review-link text-chrome"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image src={contentRepository.getSiteSettings().images.googleIcon.src} caption={contentRepository.getSiteSettings().images.googleIcon.caption} decorative={contentRepository.getSiteSettings().images.googleIcon.decorative} focalPoint={contentRepository.getSiteSettings().images.googleIcon.focalPoint} alt={contentRepository.getSiteSettings().images.googleIcon.alt} width="24" height="24" loading="lazy" className="h-6 w-6 shrink-0" />
      <span className="grid text-left leading-[15px]">
        <strong className="font-semibold">{ui.googleRatingLabel}</strong>
        <span className="flex items-center gap-2.5 font-semibold">{siteConfig.business.googleRating.value} <span aria-hidden="true" className="tracking-[1px] text-[#fbbc04]">{ui.googleStars}</span></span>
      </span>
    </Tag>
  );
}
