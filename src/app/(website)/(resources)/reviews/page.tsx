import { CustomerReviewsPage } from '@/components/reviews/reviews-page';
import { getSiteContent } from '@/lib/sanity/site-content';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  const { contentRepository, siteConfig } = await getSiteContent(); const page = await contentRepository.getPage('reviews'); return pageMetadata({ settings: siteConfig,  ...page!.seo, path: '/reviews/' }); }
export default CustomerReviewsPage;
