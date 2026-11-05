import { CustomerReviewsPage } from '@/components/reviews/reviews-page';
import { contentRepository } from '@/content/repository';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata() { const page = await contentRepository.getPage('reviews'); return pageMetadata({ ...page!.seo, path: '/reviews/' }); }
export default CustomerReviewsPage;
