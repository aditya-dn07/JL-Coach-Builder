import { AllFaqsPage } from '@/components/faq/faq-page';
import { getSiteContent } from '@/lib/sanity/site-content';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  const { contentRepository, siteConfig } = await getSiteContent(); const page = await contentRepository.getPage('faqs'); return pageMetadata({ settings: siteConfig,  ...page!.seo, path: '/faqs/' }); }
export default AllFaqsPage;
