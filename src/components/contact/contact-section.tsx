import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { QuoteForm } from '@/components/contact/quote-form';
import { siteConfig, phoneHref, fullAddress, directionsHref, mapEmbedSrc } from '@/config/site';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { InteriorReveal } from '@/components/content/animated-benefit-card';
import { LinkedText } from '@/components/content/related-services';

export function ContactSection({ page }: { page: ContentPage }) {
  const address = fullAddress;
  return (
    <InteriorSectionFrame id="page-details">
      <div className="experience-layout">
        <InteriorReveal className="experience-intro">
          <InteriorSectionHeader><p className="kicker">{page.sections[0]?.eyebrow}</p>
          <h2><TwoToneHeading text={page.sections[0]?.title ?? page.title} /></h2>
          <p className="text-base leading-7"><LinkedText text={page.sections[0]?.description ?? ''} links={page.sections[0]?.descriptionLinks} /></p></InteriorSectionHeader>
          {page.intro.slice(1).map((text, index) => <p key={text} className="text-base leading-7"><LinkedText text={text} links={page.introLinks?.find(item => item.index === index + 1)?.links} /></p>)}
          <InteriorSectionHeader><p className="kicker">{page.sections[1]?.eyebrow}</p>
          <h3 className="text-[clamp(24px,3vw,36px)]"><TwoToneHeading text={page.sections[1]?.title ?? ''} /></h3>
          <p className="text-base leading-7"><LinkedText text={page.sections[1]?.description ?? ''} links={page.sections[1]?.descriptionLinks} /></p></InteriorSectionHeader>
          <div className="contact-methods service-links">
            <a href={phoneHref}>
              <Phone />
              <span>
                <small>{page.sections[1]?.blocks.find(block => block.text.startsWith('Phone:'))?.text.split(':')[0]}</small>
                {siteConfig.business.phone}
              </span>
            </a>
            <a href={`mailto:${siteConfig.business.email}`}>
              <Mail />
              <span>
                <small>{page.sections[1]?.blocks.find(block => block.text.startsWith('Email:'))?.text.split(':')[0]}</small>
                {siteConfig.business.email}
              </span>
            </a>
            <a href={directionsHref}>
              <MapPin />
              <span>
                <small>{page.sections[1]?.blocks.find(block => block.text.startsWith('Address:'))?.text.split(':')[0]}</small>
                {address}
              </span>
            </a>
          </div>
        </InteriorReveal>
        <InteriorReveal delay={0.07} className="experience-proof contact-enquiry"><div id="contact-enquiry"><QuoteForm /></div></InteriorReveal>
      </div>
      <InteriorReveal><iframe
        className="contact-map"
        title={siteConfig.ui.footerMapTitle}
        src={mapEmbedSrc}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      /></InteriorReveal>
    </InteriorSectionFrame>
  );
}
