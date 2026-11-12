import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ContentPage } from '@/content/schema';
import { vehicles } from '@/content/catalog';
import { Photo } from '@/components/shared/photo';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection, getHomeUi } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';
import { phoneHref, siteConfig } from '@/config/site';

type Props = { page: ContentPage; interior?: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode } };

export function HomeServices({ page, interior }: Props) {
  if (interior) return <InteriorSectionFrame id={interior.section.id}><InteriorSectionHeader>{interior.intro}</InteriorSectionHeader>{interior.children}</InteriorSectionFrame>;
  const content = getHomeSection(page, 2);
  return <section id="services" className="vehicle-section section-pad container [--home-radius:12px] [--home-control-radius:6px]">
    <div className="section-heading" data-reveal>
      <p className="kicker">{content.eyebrow}</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
    </div>
    <div className="vehicle-grid classic-service-grid">
      {vehicles.map((vehicle, i) => <article className={`vehicle-card vehicle-${i}`} key={vehicle.label} data-reveal>
        <Link href={vehicle.links[0].href} className="vehicle-photo"><Photo image={vehicle.image} sizes="(max-width: 650px) 100vw, 33vw" /></Link>
        <div className="vehicle-card-copy">
          <h3><Link href={vehicle.links[0].href}>{content.blocks[1 + i * 2].text}</Link></h3>
          <p>{content.blocks[2 + i * 2].text}</p>
          <div className="service-links">{vehicle.links.map((link, index) => <Link href={link.href} key={link.href} className="!justify-start !text-left"><LibraryIcon name={(["grid", "tools", "paint-bucket", "sliders"] as const)[index]} />{[getHomeUi(page, 'serviceAll'), getHomeUi(page, 'serviceRepairs'), getHomeUi(page, 'servicePaint'), getHomeUi(page, 'serviceUpgrades')][index]}</Link>)}</div>
        </div>
      </article>)}
      <article className="service-help-card" data-reveal>
        <span className="capability-icon"><LibraryIcon name="chat-square-text" /></span>
        <p className="kicker">{getHomeUi(page, 'insurance')}</p>
        <h3><TwoToneHeading text={getHomeUi(page, 'serviceHelpTitle')} /></h3>
        <p>{getHomeSection(page, 6).blocks[0].text}</p>
        <div className="mt-auto flex flex-wrap gap-3">
          <a className="button primary" href={phoneHref}><LibraryIcon name="telephone" />{getHomeUi(page, 'callPrefix')}{siteConfig.business.phone}</a>
          <QuoteLink />
        </div>
      </article>
    </div>
  </section>;
}
