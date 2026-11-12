import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { QuoteForm } from './quote-form';
import { siteConfig, phoneHref, fullAddress, directionsHref, mapEmbedSrc } from '@/config/site';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { InteriorReveal } from '@/components/content/animated-benefit-card';
import { LinkedText } from '@/components/content/related-services';
import { OpeningHours } from '@/components/shared/opening-hours';

export function ContactSection({ page }: { page: ContentPage }) {
  const [location, enquiry] = page.sections;
  const contactClass = 'flex min-h-11 items-center gap-4 py-2 text-left [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0 [&>svg]:text-[#ff9aa2]';
  return <InteriorSectionFrame id="page-details">
    <div className="experience-layout !items-start">
      <InteriorReveal className="experience-intro">
        <div id={location.id}>
          <InteriorSectionHeader><p className="kicker">{location.eyebrow}</p>
            <h2><TwoToneHeading text={location.title} /></h2>
            <p><LinkedText text={location.description ?? ''} links={location.descriptionLinks} /></p>
          </InteriorSectionHeader>
          <address className="not-italic">
            <a className={contactClass} href={directionsHref}><MapPin aria-hidden="true" /><span>{fullAddress}</span></a>
            <a className={contactClass} href={phoneHref}><Phone aria-hidden="true" /><span>{siteConfig.business.phone}</span></a>
            <a className={contactClass} href={'mailto:' + siteConfig.business.email}><Mail aria-hidden="true" /><span className="min-w-0 [overflow-wrap:anywhere]">{siteConfig.business.email}</span></a>
          </address>
          <OpeningHours showExceptions={false} />
        </div>
      </InteriorReveal>
      <InteriorReveal delay={0.07} className="experience-proof contact-enquiry"><div id={enquiry.id}><div id="contact-enquiry"><QuoteForm /></div></div></InteriorReveal>
    </div>
    <InteriorReveal><iframe className="contact-map" title={siteConfig.ui.footerMapTitle} src={mapEmbedSrc} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></InteriorReveal>
  </InteriorSectionFrame>;
}
