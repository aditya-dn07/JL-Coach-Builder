import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import type { ContentPage } from '@/content/schema';
import Link from 'next/link';
// import { GoogleReviewLink } from '@/components/shared/google-review-link';
import { getCustomerReviews } from '@/content/feedback';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { ReviewSlider } from '@/components/shared/review-slider';
import { getHomeSection, getHomeUi } from './home-content';

type Props = { page: ContentPage; interior?: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode } };

export function HomeReviews({ page, interior }: Props) {
  if (interior) return <InteriorSectionFrame id={interior.section.id} className="home-document-reviews">{interior.intro && <InteriorSectionHeader>{interior.intro}</InteriorSectionHeader>}{interior.children}</InteriorSectionFrame>;
  const content = getHomeSection(page, 7);
  const reviews = getCustomerReviews(page);
  return <section className="reviews-block section-pad container home-document-reviews">
    <div className="section-heading" data-reveal>
      <p className="kicker">{getHomeUi(page, 'reviews')}</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p className="col-start-1 row-start-3 mt-4 max-w-[78ch] text-[15px] leading-[1.85] text-[#b9c6d5]">{getHomeUi(page, 'reviewIntro')}</p>
      <div className="self-end justify-self-start min-[801px]:col-start-2 min-[801px]:row-start-3 min-[801px]:justify-self-end">
        {/* <GoogleReviewLink /> */}
        <Link href="/reviews/" className="underlink !mt-0">{getHomeUi(page, 'viewReviews')}</Link>
      </div>
    </div>
    <ReviewSlider reviews={reviews} />
  </section>;
}
