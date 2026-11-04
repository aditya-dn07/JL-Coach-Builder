import Image from 'next/image';
import type { ContentPage } from '@/content/schema';
import { phoneHref, siteConfig } from '@/config/site';
import { LibraryIcon } from '@/components/shared/library-icon';
import { ServiceMarquee } from './service-marquee';

export function HomeHero({ page }: { page: ContentPage }) {
  return (
    <section className="home-hero alternate-hero studio-hero" aria-labelledby="home-hero-title">
      <div className="alternate-photo">
        <Image
          src="/images/home-workshop-banner.webp"
          alt="Caravans and motorhomes outside the JL Coachbuilders workshop in Christchurch"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="alternate-copy min-w-0">
        <p className="alternate-eyebrow">{page.eyebrow}</p>
        <h1 id="home-hero-title">{page.title}</h1>
        <p className="alternate-description">{page.description}</p>
        <ServiceMarquee />
        <div className="alternate-actions">
          <a href="#quote"><LibraryIcon name="chat-square-text" />Get a free quote</a>
          <a href={phoneHref}><LibraryIcon name="telephone" />Call {siteConfig.business.phone}</a>
        </div>
        <div className="alternate-proof">
          <span><strong>80+</strong> Years of combined experience</span>
          <span><strong>2016</strong> Locally owned since</span>
        </div>
      </div>
      <div className="studio-hero-note">
        <span>Trusted Local Specialists</span>
        <strong>Experience That Shows<br />in the Finished Job</strong>
        <a href="#quote"><LibraryIcon name="chat-square-text" />Get a free quote</a>
      </div>
      <div className="alternate-bottom">
        <span>Caravans · Motorhomes · Campervans · Fifth wheels · Buses</span>
        <a href={phoneHref}><LibraryIcon name="telephone" />Talk to the team {siteConfig.business.phone}</a>
      </div>
    </section>
  );
}
