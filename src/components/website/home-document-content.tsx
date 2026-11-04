import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { vehicles } from '@/content/catalog';
import { Photo } from '@/components/photo';
import { site } from '@/data/site.data';
import { phoneHref, siteConfig } from '@/config/site';
import { LibraryIcon } from './library-icon';
import { TwoToneHeading } from './two-tone-heading';
import { StudioServices } from './studio-services';
import { ReviewSlider } from './review-slider';

type Props = { page: ContentPage };
const section = (page: ContentPage, id: number) => page.sections.find(s => s.id === `section-${id}`)!;
const Quote = () => <a className="button primary" href="#quote"><LibraryIcon name="chat-square-text" />Get a free quote</a>;

export function HomeTrust({ page }: Props) {
  const content = section(page, 1);
  return <section className="home-document-trust section-pad">
    <div className="container experience-layout">
    <div className="experience-intro" data-reveal>
      <p className="kicker">Trusted Local Specialists</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
      <Quote />
    </div>
    <div className="experience-proof" data-reveal>
      <div className="experience-metrics">{content.blocks.slice(1, 4).map(block => {
        const space = block.text.indexOf(' ');
        return <div className="experience-metric" key={block.text}><strong>{block.text.slice(0, space)}</strong><span>{block.text.slice(space + 1)}</span></div>;
      })}</div>
      <div className="experience-assurances">{content.blocks.slice(4).map(block => <div key={block.text}><LibraryIcon name="check2-circle" /><span>{block.text}</span></div>)}</div>
    </div>
    </div>
  </section>;
}

export function HomeServices({ page }: Props) {
  const content = section(page, 2);
  return <section id="services" className="vehicle-section section-pad container">
    <div className="section-heading" data-reveal>
      <p className="kicker">Our Services</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
    </div>
    <StudioServices services={vehicles.map((vehicle, i) => ({ ...vehicle, title: content.blocks[1 + i * 2].text, description: content.blocks[2 + i * 2].text }))} insuranceTitle={section(page, 6).title} insuranceDescription={section(page, 6).blocks[0].text} />
    <div className="vehicle-grid classic-service-grid">
      {vehicles.map((vehicle, i) => <article className={`vehicle-card vehicle-${i}`} key={vehicle.label} data-reveal>
        <Link href={vehicle.links[0].href} className="vehicle-photo"><Photo image={vehicle.image} sizes="(max-width: 650px) 100vw, 33vw" /><span className="vehicle-number">0{i + 1}</span></Link>
        <div className="vehicle-card-copy">
          <h3><Link href={vehicle.links[0].href}>{content.blocks[1 + i * 2].text}</Link></h3>
          <p>{content.blocks[2 + i * 2].text}</p>
          <div className="service-links">{vehicle.links.map((link, index) => <Link href={link.href} key={link.href}><LibraryIcon name={(["grid", "tools", "paint-bucket", "sliders"] as const)[index]} />{['All services', 'Repairs', 'Panel & paint', 'Alterations & upgrades'][index]}</Link>)}</div>
        </div>
      </article>)}
      <article className="service-help-card" data-reveal>
        <span className="capability-icon"><LibraryIcon name="chat-square-text" /></span>
        <p className="kicker">Insurance Repairs</p>
        <h3><TwoToneHeading text={section(page, 6).title} /></h3>
        <p>{section(page, 6).blocks[0].text}</p>
        <a className="button primary" href={phoneHref}><LibraryIcon name="telephone" />Call {siteConfig.business.phone}</a>
      </article>
    </div>
  </section>;
}

export function HomeWorkshop({ page }: Props) {
  const content = section(page, 4);
  return <section className="workshop-feature home-workshop">
    <div className="feature-image"><Photo image={site.hero.image} sizes="(max-width: 800px) 100vw, 50vw" /><div className="workshop-stamp"><strong>80<span>+</span></strong><span>Years of combined<br />experience</span></div></div>
    <div className="feature-copy" data-reveal>
      <p className="kicker">Workshop Capability</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
      <p>{content.blocks[1].text}</p>
      <ul className="capability-tiles">{content.blocks.slice(2).map(block => <li key={block.text}><LibraryIcon name="check2-circle" /><span>{block.text}</span></li>)}</ul>
      <Quote />
    </div>
  </section>;
}

export function HomeReviews({ page }: Props) {
  const content = section(page, 7);
  const reviews = content.blocks.filter((_, i) => i % 2 === 0).map((block, i) => ({text: block.text, author: content.blocks[i * 2 + 1].text}));
  return <section className="reviews-block section-pad container home-document-reviews">
    <div className="section-heading" data-reveal><p className="kicker">Customer Reviews</p><h2><TwoToneHeading text={content.title} /></h2><p className="review-stars">★★★★★ <span>4.9 Google rating</span></p></div>
    <ReviewSlider reviews={reviews} />
    <div className="home-section-action"><a className="button primary" href={phoneHref}><LibraryIcon name="telephone" />Call {siteConfig.business.phone}</a></div>
  </section>;
}

export function HomeClosing({ page }: Props) {
  const content = section(page, 9);
  return <section className="closing-cta contact-cta home-document-closing" aria-labelledby="home-closing-title">
    <div className="container contact-panel" data-reveal>
      <div className="contact-panel-background" aria-hidden="true"><Image src="/images/cta-caravan-lakeside.webp" alt="" fill sizes="100vw" /></div>
      <div className="contact-panel-copy"><p className="kicker">Ready to Book?</p><h2 id="home-closing-title"><TwoToneHeading text={content.title} /></h2><p>{content.blocks[0].text}</p></div>
      <div className="contact-panel-actions"><Quote /><a className="contact-direct" href={phoneHref}><Phone size={19} aria-hidden="true" /><span>Call<strong>{siteConfig.business.phone}</strong></span></a></div>
    </div>
  </section>;
}
