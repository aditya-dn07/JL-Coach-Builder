import { LinkedText } from '../content/related-services';
import { getSiteContent } from '@/lib/sanity/site-content';
import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ContentPage } from '@/content/schema';
import { Photo } from '@/components/shared/photo';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection, getHomeUi } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';

type Props = { page: ContentPage; interior?: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode } };

export async function HomeServices({ page, interior }: Props) {
  const { vehicles, phoneHref, siteConfig } = await getSiteContent();
  if (interior) return <InteriorSectionFrame id={interior.section.id}><InteriorSectionHeader>{interior.intro}</InteriorSectionHeader>{interior.children}</InteriorSectionFrame>;
  const content = getHomeSection(page, 2);
  const introduction = content.introduction?.[0] ?? content.blocks[0];
  return <section id="services" className="vehicle-section section-pad container [--home-radius:12px] [--home-control-radius:6px]">
    <div className="section-heading" data-reveal>
      <p className="kicker">{content.eyebrow}</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p><LinkedText text={introduction.text} links={introduction.links} richText={content.descriptionRichText ?? introduction.richText} /></p>
    </div>
    <div className="vehicle-grid classic-service-grid">
      {(content.serviceCards ?? []).map((card, i) => { const vehicle = vehicles.find(vehicle => vehicle.image.id === card.vehicleId) ?? vehicles[i % vehicles.length]; return <article className={`vehicle-card vehicle-${i}`} key={vehicle.label} data-reveal>
        <Link href={card.href || vehicle.links[0].href} className="vehicle-photo"><Photo image={vehicle.image} override={card.image} sizes="(max-width: 650px) 100vw, 33vw" /></Link>
        <div className="vehicle-card-copy">
          <h3><Link href={vehicle.links[0].href}>{card.title}</Link></h3>
          <p><LinkedText text={card.description} links={card.descriptionLinks} richText={card.descriptionRichText} /></p>
          <div className="service-links">{(card.links ?? vehicle.links).map((link, index) => <Link href={link.href} key={link.href} className="!justify-start !text-left"><LibraryIcon name={(["grid", "tools", "paint-bucket", "sliders"] as const)[index]} />{card.links ? link.label : [getHomeUi(page, 'serviceAll'), getHomeUi(page, 'serviceRepairs'), getHomeUi(page, 'servicePaint'), getHomeUi(page, 'serviceUpgrades')][index]}</Link>)}</div>
        </div>
      </article>; })}
      <article className="service-help-card" data-reveal>
        <span className="capability-icon"><LibraryIcon name="chat-square-text" /></span>
        <p className="kicker">{content.helpCard?.eyebrow ?? getHomeUi(page, 'insurance')}</p>
        <h3><TwoToneHeading text={content.helpCard?.title ?? getHomeUi(page, 'serviceHelpTitle')} /></h3>
        <p><LinkedText text={content.helpCard?.description ?? getHomeSection(page, 6).blocks[0].text} links={content.helpCard?.descriptionLinks} richText={content.helpCard?.descriptionRichText} /></p>
        <div className="mt-auto flex flex-wrap gap-3">
          <a className="button primary" href={content.actions?.callHref || phoneHref}><LibraryIcon name="telephone" />{getHomeUi(page, 'callPrefix')}{siteConfig.business.phone}</a>
          <QuoteLink label={content.actions?.quoteLabel} href={content.actions?.quoteHref} />
        </div>
      </article>
    </div>
  </section>;
}
