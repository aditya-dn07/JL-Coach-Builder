import Image from 'next/image';
import { Phone } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { phoneHref, siteConfig } from '@/config/site';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';

type Props = { page: ContentPage };

export function HomeClosing({ page }: Props) {
  const content = getHomeSection(page, 9);
  return <section className="closing-cta contact-cta home-document-closing" aria-labelledby="home-closing-title">
    <div className="container contact-panel" data-reveal>
      <div className="contact-panel-background" aria-hidden="true"><Image src="/images/cta-caravan-lakeside.webp" alt="" fill sizes="100vw" /></div>
      <div className="contact-panel-copy"><p className="kicker">Ready to Book?</p><h2 id="home-closing-title"><TwoToneHeading text={content.title} /></h2><p>{content.blocks[0].text}</p></div>
      <div className="contact-panel-actions"><QuoteLink /><a className="contact-direct" href={phoneHref}><Phone size={19} aria-hidden="true" /><span>Call<strong>{siteConfig.business.phone}</strong></span></a></div>
    </div>
  </section>;
}
