import Image from 'next/image';
import Link from 'next/link';
import type { ContentPage } from '@/content/schema';
import { imageFor, vehicles } from '@/content/catalog';
import { Photo } from '@/components/shared/photo';
import { phoneHref, siteConfig } from '@/config/site';

export function InteriorHero({ page }: { page: ContentPage }) {
  const legal = page.kind === 'legal';
  const vehicle = vehicles.find((item) => item.image.id === page.image);
  return (
    <section className={`interior-hero interior-banner ${legal ? 'legal-banner' : ''}`} aria-labelledby="interior-title">
      {!legal && <div className="interior-banner-image" aria-hidden="true">
        {page.image === 'workshop'
          ? <Image src="/images/home-workshop-banner.webp" alt="" fill priority sizes="100vw" />
          : <Photo image={imageFor(page.image)} priority sizes="100vw" />}
      </div>}
      <div className="container interior-banner-content">
        <nav className="interior-crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span>{vehicle && <><Link href={vehicle.links[0].href}>{vehicle.label}</Link><span aria-hidden="true">/</span></>}<span>{page.label}</span></nav>
        <p className="interior-eyebrow">{page.eyebrow}</p>
        <h1 id="interior-title">{page.title}</h1>
        <p className="interior-summary">{page.description}</p>
        {page.updatedAt && <p className="policy-date">{page.updatedAt}</p>}
        {!legal && <div className="interior-banner-actions">
          <a className="button primary" href={page.kind === 'contact' ? '#contact-enquiry' : '#quote'}>Get a free quote</a>
          <a className="underlink" href="#page-details">{page.kind === 'gallery' ? 'View workshop projects' : page.kind === 'contact' ? 'Contact details' : 'Explore this page'}</a>
        </div>}
        {!legal && <div className="interior-banner-foot"><span>Christchurch workshop · All makes and models</span><a href={phoneHref}>Talk to our team {siteConfig.business.phone}</a></div>}
      </div>
    </section>
  );
}
