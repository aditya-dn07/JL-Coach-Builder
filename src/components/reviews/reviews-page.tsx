import { getSiteContent } from '@/lib/sanity/site-content';

import { getCustomerReviews } from '@/content/feedback';
import { ResourcePage } from '@/components/shared/resource-page';
import { InteriorClosing } from '@/components/content/interior-sections';
import { InteriorReveal } from '@/components/content/animated-benefit-card';
import { ReviewCard } from '@/components/shared/review-card';
import { HomeReviews } from '@/components/home/reviews-section';

export async function CustomerReviewsPage() {
  const { contentRepository, editorial } = await getSiteContent();
  const home = await contentRepository.getPage('');
  const page = await contentRepository.getPage('reviews');
  if (!page) return null;
  const source = home ? getCustomerReviews(home) : [];
  const shared = (await getSiteContent()).testimonials;
  const reviews = page.reviewIds?.length ? page.reviewIds.flatMap(id => shared.find(review => review.id === id) ?? []) : source;
  return <ResourcePage page={page}>
    <HomeReviews page={page} interior={{ section: { id: 'customer-reviews', title: page.title, blocks: [] }, intro: null, children: <InteriorReveal><div className="review-grid" aria-label={page.reviewAriaLabel ?? editorial.interface.copy.customerReviews}>{reviews.map(review => <ReviewCard key={review.author} review={review} preserveAuthor />)}</div></InteriorReveal> }} />
    <InteriorClosing page={page} />
  </ResourcePage>;
}
