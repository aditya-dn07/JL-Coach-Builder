import { googleReviewHref } from '@/config/site';
import { contentRepository } from '@/content/repository';
const ui = contentRepository.getSiteSettings().ui;

export function GoogleReviewLink() {
  return (
    <a
      href={googleReviewHref}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={ui.googleRatingAria}
      className="google-review-link text-chrome"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={contentRepository.getSiteSettings().images.googleIcon.src} alt={contentRepository.getSiteSettings().images.googleIcon.alt} width="24" height="24" loading="lazy" className="h-6 w-6 shrink-0" />
      <span className="grid text-left leading-[15px]">
        <strong className="font-semibold">{ui.googleRatingLabel}</strong>
        <span className="flex items-center gap-2.5 font-semibold">4.9 <span aria-hidden="true" className="tracking-[1px] text-[#fbbc04]">{ui.googleStars}</span></span>
      </span>
    </a>
  );
}
