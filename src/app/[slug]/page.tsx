import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { contentRepository } from '@/content/repository';
import { pageMetadata } from '@/lib/metadata';
import {
  PageHero,
  TrustStrip,
  DocumentSections,
  ContactSection,
  Gallery,
  RelatedServices,
  Reviews,
} from '@/components/website/sections';
import { PageStructuredData } from '@/components/website/structured-data';
import { brandFontVariables } from '@/lib/brand-fonts';
import { PageContents } from '@/components/website/interior-hero';
import '../interior.css';
import '../interior-finish.css';
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await contentRepository.getPages()).filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await contentRepository.getPage(slug);
  if (!page)
    return pageMetadata({
      title: 'Page not found',
      description:
        'Find your way back to JL Coachbuilders services or contact our Christchurch workshop.',
      path: `/${slug}/`,
      index: false,
    });
  return pageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: `/${slug}/`,
  });
}
export default async function ContentRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await contentRepository.getPage(slug);
  if (!page) notFound();
  return (
    <>
      <style>{`body:has(.interior-hero) { ${brandFontVariables} }`}</style>
      <PageStructuredData page={page} />
      <div className={`interior-shell interior-${page.kind}`}>
      <PageHero page={page} />
      {page.kind === 'service' && <TrustStrip />}
      <PageContents page={page} />
      {page.kind === 'contact' ? (
        <ContactSection page={page} />
      ) : page.kind === 'gallery' ? (
        <Gallery />
      ) : (
        <DocumentSections page={page} />
      )}{' '}
      {page.kind === 'about' && <Reviews />}
      {page.kind === 'service' && <RelatedServices page={page} />}
      </div>
    </>
  );
}
