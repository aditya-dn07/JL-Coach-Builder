import { AllFaqsPage } from '@/components/faq/faq-page';
import { contentRepository } from '@/content/repository';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata() { const page = await contentRepository.getPage('faqs'); return pageMetadata({ ...page!.seo, path: '/faqs/' }); }
export default AllFaqsPage;
