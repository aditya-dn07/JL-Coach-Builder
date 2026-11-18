import { getSiteContent } from '@/lib/sanity/site-content';
import Link from 'next/link';
import { GoogleReviewLink } from '@/components/shared/google-review-link';
import { HomeBanner, HomeBannerActions } from '@/components/home/banner';
import type { ContentPage } from '@/content/schema';
import { InteriorReveal } from './animated-benefit-card';
import { LinkedText } from './related-services';

export async function InteriorHero({ page }: { page: ContentPage }) {
  const { contentRepository, vehicles, editorial } = await getSiteContent();
  const settings = contentRepository.getSiteSettings();
  const vehicle = vehicles.find(item => item.image.id === page.image);
  const trust = page.kind === 'service' ? page.sections[0] : undefined;
  const metrics = trust?.metrics ?? [];
  return <HomeBanner page={page} interior={{
    before: <nav className="mb-6 flex min-h-11 flex-wrap items-center gap-2 text-xs" aria-label={editorial.interface.copy.breadcrumb}><Link href="/">{settings.ui.headerHome}</Link><span aria-hidden="true">/</span>{vehicle && <><Link href={vehicle.links[0].href}>{vehicle.label}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{page.label}</span></nav>,
    description: <LinkedText text={page.description} links={page.descriptionLinks} richText={page.descriptionRichText} />,
    actions: <HomeBannerActions quoteLabel={page.bannerActions?.quoteLabel ?? page.closingCta!.quoteLabel} callLabel={page.bannerActions?.callLabel ?? page.closingCta!.callLabel} quoteHref={page.bannerActions?.quoteHref} callHref={page.bannerActions?.callHref} afterQuote={page.slug === 'reviews' ? <GoogleReviewLink /> : undefined} />,
    metrics: metrics.length > 0 && <InteriorReveal className="mt-[38px] flex flex-wrap gap-[30px] text-[10px] leading-[1.7] text-[#c5cfd9] [&>div]:max-w-[140px] [&_strong]:block [&_strong]:text-[32px] [&_strong]:font-medium [&_strong]:text-white">{metrics.slice(0, 2).map(metric => { return <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>; })}</InteriorReveal>,
    trust: trust && <><span className="text-[11px] text-brand">{trust.eyebrow}</span><strong className="mb-[23px] mt-3.5 block text-[22px] font-medium leading-[1.25] min-[801px]:text-[25px]">{trust.title}</strong></>,
    after: page.updatedAt && <p className="policy-date">{page.updatedAt}</p>,
  }} />;
}
