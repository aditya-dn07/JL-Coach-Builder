import { CustomerReviewsPage } from '@/components/reviews/reviews-page';
import { reviewsPage } from '@/content/resource-pages';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({ ...reviewsPage.seo, path: '/reviews/' });
export default CustomerReviewsPage;
