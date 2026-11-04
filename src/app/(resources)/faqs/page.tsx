import { AllFaqsPage } from '@/components/faq/faq-page';
import { faqsPage } from '@/content/resource-pages';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({ ...faqsPage.seo, path: '/faqs/' });
export default AllFaqsPage;
