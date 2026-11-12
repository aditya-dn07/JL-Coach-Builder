import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import type { ContentPage } from '@/content/schema';
import Link from 'next/link';
import { GoogleReviewLink } from '@/components/shared/google-review-link';
import { getCustomerReviews } from '@/content/feedback';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { ReviewSlider } from '@/components/shared/review-slider';
import { getHomeSection, getHomeUi } from './home-content';

type Props = { page: ContentPage; interior?: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode } };

export function HomeReviews({ page, interior }: Props) {
  if (interior) return <InteriorSectionFrame id={interior.section.id} className="home-document-reviews">
    {page.slug !== 'reviews' && <div className={interior.intro
      ? 'mb-10 flex flex-col items-start gap-6 min-[1001px]:flex-row min-[1001px]:items-end min-[1001px]:justify-between'
      : 'mb-6 flex items-center justify-end'}>
      {interior.intro && <div className="min-w-0 flex-1 [&>.interior-section-header]:!mb-0"><InteriorSectionHeader>{interior.intro}</InteriorSectionHeader></div>}
      <div className="flex shrink-0 flex-col items-stretch gap-3">
        <GoogleReviewLink />
        {page.slug !== 'reviews' && <Link href="/reviews/" className="underlink !mt-0">View All Reviews</Link>}
      </div>
    </div>
    }
    {interior.children}
  </InteriorSectionFrame>;
  const content = getHomeSection(page, 7);
  const reviews = getCustomerReviews(page);
  return <section className="reviews-block section-pad container home-document-reviews">
    <div className="section-heading !mb-7 !gap-y-[15px] min-[801px]:!grid-cols-[minmax(0,1fr)_auto]" data-reveal>
      <p className="kicker min-[801px]:!col-end-2">{getHomeUi(page, 'reviews')}</p>
      <h2 className="!max-w-none"><TwoToneHeading text={content.title} /></h2>
      <p className="col-start-1 row-start-3 max-w-[100ch] text-[15px] leading-[1.85] text-[#b9c6d5]">{getHomeUi(page, 'reviewIntro')}</p>
      <div className="home-review-actions flex flex-row items-center gap-3 self-end justify-self-start min-[801px]:col-start-2 min-[801px]:row-span-3 min-[801px]:row-start-1 min-[801px]:justify-self-end">
        <GoogleReviewLink />
        <Link href="/reviews/" className="underlink !mt-0">{getHomeUi(page, 'viewReviews')}</Link>
      </div>
    </div>
    <ReviewSlider reviews={reviews} />
  </section>;
}
