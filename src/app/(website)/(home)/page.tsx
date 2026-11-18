import type { Metadata } from 'next';
import { brandFontVariables } from '@/lib/brand-fonts';
import { getSiteContent } from '@/lib/sanity/site-content';
import { pageMetadata } from '@/lib/metadata';
import { HomeBanner } from '@/components/home/banner';
import { DocumentSections } from '@/components/content/document-sections';
import { HomeTrust } from '@/components/home/trust-section';
import { HomeServices } from '@/components/home/services-section';
import { HomeWorkshop } from '@/components/home/workshop-section';
import { HomeProblems } from '@/components/home/problems-section';
import { HomeReviews } from '@/components/home/reviews-section';
import { HomeClosing } from '@/components/home/closing-section';
import { PageStructuredData } from '@/components/seo/page-structured-data';
import { SectionDivider } from '@/components/shared/section-divider';
import { RelatedPages } from '@/components/shared/related-pages';
import '@/components/home/home.css';

export async function generateMetadata(): Promise<Metadata> {
  const { contentRepository, siteConfig } = await getSiteContent();
  const page = (await contentRepository.getPage(''))!;
  return pageMetadata({ settings: siteConfig,  ...page.seo });
}
export default async function Home() {
  const { contentRepository, siteConfig } = await getSiteContent();
  const page = (await contentRepository.getPage(''))!;
  return (
    <>
      <style>{`body:has(.home-hero) { ${brandFontVariables} }`}</style>
      <PageStructuredData page={page} />
      <div className="home-page" data-home-page>
        <HomeBanner page={page} />
        <SectionDivider />
        <HomeTrust page={page} />
        <SectionDivider />
        <HomeServices page={page} />
        <SectionDivider />
        <HomeWorkshop page={page} />
        <SectionDivider />
        <HomeProblems page={page} />
        <SectionDivider />
        <DocumentSections page={page} sectionIds={['section-5']} />
        <SectionDivider />
        <DocumentSections page={page} sectionIds={['section-6']} />
        <SectionDivider />
        <HomeReviews page={page} />
        <SectionDivider />
        <DocumentSections page={page} sectionIds={['section-8']} />
        <SectionDivider />
        <HomeClosing page={page} />
        <RelatedPages links={page.relatedLinks} title={page.relatedLinksTitle} />
      </div>
    </>
  );
}
