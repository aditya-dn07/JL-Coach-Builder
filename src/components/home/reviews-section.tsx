import type { ContentPage } from '@/content/schema';
import Link from 'next/link';
// import { GoogleReviewLink } from '@/components/shared/google-review-link';
import { getCustomerReviews } from '@/content/feedback';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { ReviewSlider } from '@/components/shared/review-slider';
import { getHomeSection } from './home-content';

type Props = { page: ContentPage };

export function HomeReviews({ page }: Props) {
  const content = getHomeSection(page, 7);
  const reviews = getCustomerReviews(page);
  return <section className="reviews-block section-pad container home-document-reviews">
    <div className="section-heading" data-reveal>
      <p className="kicker">Customer Reviews</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p className="col-start-1 row-start-3 mt-4 max-w-[78ch] text-[15px] leading-[1.85] text-[#b9c6d5]">Our customers trust JL Coachbuilders for quality workmanship, honest advice and reliable service. Read what they say about their experience with our team.</p>
      <div className="self-end justify-self-start min-[801px]:col-start-2 min-[801px]:row-start-3 min-[801px]:justify-self-end">
        {/* <GoogleReviewLink /> */}
        <Link href="/reviews/" className="underlink !mt-0">View All Reviews</Link>
      </div>
    </div>
    <ReviewSlider reviews={reviews} />
  </section>;
}
