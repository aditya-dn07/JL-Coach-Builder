import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { phoneHref, siteConfig } from '@/config/site';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection, getHomeUi } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';

type Props = { page: ContentPage; interior?: { copy: ReactNode; actions: ReactNode; contact?: ReactNode } };

export function HomeClosing({ page, interior }: Props) {
  if (interior) return <InteriorSectionFrame className="home-document-closing interior-closing"><div data-interior-closing className="contact-cta"><div className={`contact-panel ${page.closingImage ? '' : 'interior-closing-plain'}`}>{page.closingImage && <div className="contact-panel-background" aria-hidden="true"><Image src={page.closingImage.src} alt={page.closingImage.alt} fill sizes="100vw" /></div>}<div className="contact-panel-copy"><InteriorSectionHeader>{interior.copy}</InteriorSectionHeader></div><div className="contact-panel-actions">{interior.actions}</div>{interior.contact}</div></div></InteriorSectionFrame>;
  const content = getHomeSection(page, 9);
  return <section className="closing-cta contact-cta home-document-closing" aria-labelledby="home-closing-title">
    <div className="container contact-panel" data-reveal>
      <div className="contact-panel-background" aria-hidden="true"><Image src={page.closingImage!.src} alt={page.closingImage!.alt} fill sizes="100vw" /></div>
      <div className="contact-panel-copy"><p className="kicker">{getHomeUi(page, 'ready')}</p><h2 id="home-closing-title"><TwoToneHeading text={content.title} /></h2><p>{content.blocks[0].text}</p></div>
      <div className="contact-panel-actions"><QuoteLink /><a className="contact-direct" href={phoneHref}><Phone size={19} aria-hidden="true" /><span>{getHomeUi(page, 'call')}<strong>{siteConfig.business.phone}</strong></span></a></div>
    </div>
  </section>;
}
