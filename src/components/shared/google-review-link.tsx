import { googleReviewHref } from '@/config/site';

export function GoogleReviewLink() {
  return (
    <a
      href={googleReviewHref}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label="Google rating: 4.9 out of 5. Read our Google reviews (opens in a new tab)"
      className="inline-flex items-center gap-3 rounded-[10px] bg-white px-[18px] py-2.5 text-chrome text-[#111] transition-shadow hover:shadow-lg"
    >
      {/* Google's platform mark is served by the supplied review provider. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://cdn.trustindex.io/assets/platform/Google/icon.svg" alt="" width="34" height="34" loading="lazy" className="h-[34px] w-[34px] shrink-0" />
      <span className="grid gap-0.5">
        <strong className="font-semibold">Google rating</strong>
        <span className="flex items-center gap-2.5 font-semibold">4.9 <span aria-hidden="true" className="tracking-[1px] text-[#fbbc04]">★★★★★</span></span>
      </span>
    </a>
  );
}
