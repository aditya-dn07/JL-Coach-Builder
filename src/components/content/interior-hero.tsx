import Link from 'next/link';
import { HomeBanner, HomeBannerActions } from '@/components/home/banner';
import type { ContentPage } from '@/content/schema';
import { contentRepository } from '@/content/repository';
import { vehicles } from '@/content/catalog';
import { InteriorReveal } from './animated-benefit-card';
import { LinkedText } from './related-services';

export function InteriorHero({ page }: { page: ContentPage }) {
  const settings = contentRepository.getSiteSettings();
  const vehicle = vehicles.find(item => item.image.id === page.image);
  const trust = page.kind === 'service' ? page.sections[0] : undefined;
  const metrics = trust?.blocks.filter(block => /^80\+|^100\+|^4\.9/.test(block.text)) ?? [];
  return <HomeBanner page={page} interior={{
    before: <nav className="mb-6 flex min-h-11 flex-wrap items-center gap-2 text-xs" aria-label="Breadcrumb"><Link href="/">{settings.ui.headerHome}</Link><span aria-hidden="true">/</span>{vehicle && <><Link href={vehicle.links[0].href}>{vehicle.label}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{page.label}</span></nav>,
    description: <LinkedText text={page.description} links={page.descriptionLinks} />,
    actions: <HomeBannerActions quoteLabel={page.closingCta!.quoteLabel} callLabel={page.closingCta!.callLabel} />,
    metrics: metrics.length > 0 && <InteriorReveal className="mt-[38px] flex flex-wrap gap-[30px] text-[10px] leading-[1.7] text-[#c5cfd9] [&>div]:max-w-[140px] [&_strong]:block [&_strong]:text-[32px] [&_strong]:font-medium [&_strong]:text-white">{metrics.slice(0, 2).map(metric => { const [value, ...label] = metric.text.split(' '); return <div key={metric.text}><strong>{value}</strong><span>{label.join(' ')}</span></div>; })}</InteriorReveal>,
    trust: trust && <><span className="text-[11px] text-brand">{trust.eyebrow}</span><strong className="mb-[23px] mt-3.5 block text-[22px] font-medium leading-[1.25] min-[801px]:text-[25px]">{trust.title}</strong></>,
    after: page.updatedAt && <p className="policy-date">{page.updatedAt}</p>,
  }} />;
}
