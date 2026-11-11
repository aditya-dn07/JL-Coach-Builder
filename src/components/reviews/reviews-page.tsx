import { contentRepository } from '@/content/repository';
import { getCustomerReviews } from '@/content/feedback';
import { ResourcePage } from '@/components/shared/resource-page';
import { InteriorClosing } from '@/components/content/interior-sections';
import { InteriorReveal } from '@/components/content/animated-benefit-card';
import { ReviewCard } from '@/components/shared/review-card';
import { HomeReviews } from '@/components/home/reviews-section';

export async function CustomerReviewsPage() {
  const home = await contentRepository.getPage('');
  const page = await contentRepository.getPage('reviews');
  if (!page) return null;
  const reviews = home ? getCustomerReviews(home) : [];
  return <ResourcePage page={page}>
    <HomeReviews page={page} interior={{ section: { id: 'customer-reviews', title: page.title, blocks: [] }, intro: null, children: <InteriorReveal><div className="review-grid" aria-label="Customer reviews">{reviews.map(review => <ReviewCard key={review.author} review={review} preserveAuthor />)}</div></InteriorReveal> }} />
    <InteriorClosing page={page} />
  </ResourcePage>;
}
