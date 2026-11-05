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
      className="inline-flex items-center gap-3 rounded-[10px] bg-white px-[18px] py-2.5 text-chrome text-[#111] transition-shadow hover:shadow-lg"
    >
      {/* Google's platform mark is served by the supplied review provider. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={contentRepository.getSiteSettings().images.googleIcon.src} alt={contentRepository.getSiteSettings().images.googleIcon.alt} width="34" height="34" loading="lazy" className="h-[34px] w-[34px] shrink-0" />
      <span className="grid gap-0.5">
        <strong className="font-semibold">{ui.googleRatingLabel}</strong>
        <span className="flex items-center gap-2.5 font-semibold">4.9 <span aria-hidden="true" className="tracking-[1px] text-[#fbbc04]">{ui.googleStars}</span></span>
      </span>
    </a>
  );
}
