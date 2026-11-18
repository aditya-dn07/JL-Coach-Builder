import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSiteContent } from '@/lib/sanity/site-content';
import { pageMetadata } from '@/lib/metadata';
import { InteriorHero } from '@/components/content/interior-hero';
import { InteriorClosing, InteriorSections } from '@/components/content/interior-sections';
import { ContactSection } from '@/components/contact/contact-section';
import { ProjectGallery } from '@/components/gallery/project-gallery';
import { PageStructuredData } from '@/components/seo/page-structured-data';
import { brandFontVariables } from '@/lib/brand-fonts';
import '@/components/home/home.css';
import '@/components/content/content.css';
import { interiorMotionStyle } from '@/lib/motion';
import { RelatedPages } from '@/components/shared/related-pages';
// Unknown slugs must reach this layout's styled not-found boundary.
export const dynamicParams = true;
export async function generateStaticParams() {
  const { contentRepository, siteConfig } = await getSiteContent();
  return (await contentRepository.getPages()).filter((p) => p.slug && !['reviews', 'faqs'].includes(p.slug)).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { contentRepository, siteConfig } = await getSiteContent();
  const { slug } = await params;
  const page = await contentRepository.getPage(slug);
  if (!page)
    return pageMetadata({ settings: siteConfig, 
      title: 'Page not found',
      description:
        'Find your way back to JL Coachbuilders services or contact our Christchurch workshop.',
      path: `/${slug}/`,
      index: false,
    });
  return pageMetadata({ settings: siteConfig, 
    ...page.seo,
    path: `/${slug}/`,
  });
}
export default async function ContentRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { contentRepository, siteConfig } = await getSiteContent();
  const { slug } = await params;
  const page = await contentRepository.getPage(slug);
  if (!page) notFound();
  return (
    <>
      <style>{`body:has(.interior-shell) { ${brandFontVariables} }`}</style>
      <PageStructuredData page={page} />
      <div className={`home-page interior-shell interior-${page.kind}`} data-home-page style={interiorMotionStyle}>
      <InteriorHero page={page} />
      {page.kind === 'contact' ? (
        <ContactSection page={page} />
      ) : page.kind === 'gallery' ? (
        <ProjectGallery page={page} photos={contentRepository.getGalleryImages()} ui={contentRepository.getSiteSettings().ui} />
      ) : (
        <InteriorSections page={page} />
      )}{' '}
      <InteriorClosing page={page} />
      <RelatedPages links={page.relatedLinks} title={page.relatedLinksTitle} />
      </div>
    </>
  );
}
