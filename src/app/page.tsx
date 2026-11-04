import type { Metadata } from 'next';
import { brandFontVariables } from '@/lib/brand-fonts';
import { contentRepository } from '@/content/repository';
import { pageMetadata } from '@/lib/metadata';
import {
  PageHero,
  DocumentSections,
} from '@/components/website/sections';
import { HomeTrust, HomeServices, HomeWorkshop, HomeReviews, HomeClosing } from '@/components/website/home-document-content';
import { PageStructuredData } from '@/components/website/structured-data';
import { HomeDesigns } from '@/components/website/home-designs';
import './home.css';
import './home-sections.css';
import './home-banner.css';
import './home-designs.css';
import './home-document-content.css';
import './rounded-services.css';
import './homepage-refinements.css';


export async function generateMetadata(): Promise<Metadata> {
  const page = (await contentRepository.getPage(''))!;
  return pageMetadata({ title: page.seo.title, description: page.seo.description });
}
export default async function Home() {
  const page = (await contentRepository.getPage(''))!;
  return (
    <>
      <style>{`body:has(.home-hero) { ${brandFontVariables} }`}</style>
      <PageStructuredData page={page} />
      <HomeDesigns
        currentHero={<PageHero page={page} />}
        title={page.title}
        eyebrow={page.eyebrow}
        description={page.description}
        sections={{
          trust: <HomeTrust page={page} />,
          services: <HomeServices page={page} />,
          repairs: <DocumentSections page={page} sectionIds={['section-3']} />,
          workshop: <HomeWorkshop page={page} />,
          benefits: <DocumentSections page={page} sectionIds={['section-5']} />,
          insurance: <DocumentSections page={page} sectionIds={['section-6']} />,
          reviews: <HomeReviews page={page} />,
          faq: <DocumentSections page={page} sectionIds={['section-8']} />,
          closing: <HomeClosing page={page} />,
        }}
      />
    </>
  );
}
