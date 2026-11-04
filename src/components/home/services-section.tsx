import Link from 'next/link';
import type { ContentPage } from '@/content/schema';
import { vehicles } from '@/content/catalog';
import { Photo } from '@/components/shared/photo';
import { phoneHref, siteConfig } from '@/config/site';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection } from './home-content';

type Props = { page: ContentPage };

export function HomeServices({ page }: Props) {
  const content = getHomeSection(page, 2);
  return <section id="services" className="vehicle-section section-pad container [--home-radius:12px] [--home-control-radius:6px]">
    <div className="section-heading" data-reveal>
      <p className="kicker">Our Services</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
    </div>
    <div className="vehicle-grid classic-service-grid">
      {vehicles.map((vehicle, i) => <article className={`vehicle-card vehicle-${i}`} key={vehicle.label} data-reveal>
        <Link href={vehicle.links[0].href} className="vehicle-photo"><Photo image={vehicle.image} sizes="(max-width: 650px) 100vw, 33vw" /></Link>
        <div className="vehicle-card-copy">
          <h3><Link href={vehicle.links[0].href}>{content.blocks[1 + i * 2].text}</Link></h3>
          <p>{content.blocks[2 + i * 2].text}</p>
          <div className="service-links">{vehicle.links.map((link, index) => <Link href={link.href} key={link.href}><LibraryIcon name={(["grid", "tools", "paint-bucket", "sliders"] as const)[index]} />{['All services', 'Repairs', 'Panel & paint', 'Alterations & upgrades'][index]}</Link>)}</div>
        </div>
      </article>)}
      <article className="service-help-card" data-reveal>
        <span className="capability-icon"><LibraryIcon name="chat-square-text" /></span>
        <p className="kicker">Insurance Repairs</p>
        <h3><TwoToneHeading text={getHomeSection(page, 6).title} /></h3>
        <p>{getHomeSection(page, 6).blocks[0].text}</p>
        <a className="button primary" href={phoneHref}><LibraryIcon name="telephone" />Call {siteConfig.business.phone}</a>
      </article>
    </div>
  </section>;
}
