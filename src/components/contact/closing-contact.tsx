'use client';
import Image from 'next/image';
import { Check, Mail, Phone, MessageSquareText } from 'lucide-react';
import { phoneHref, siteConfig } from '@/config/site';
import { usePathname } from 'next/navigation';

export function ClosingContact() {
  const path = usePathname();
  if (path !== '/') return null;
  return (
      <section className="closing-cta contact-cta" aria-labelledby="closing-contact-title">
        <div className="container contact-panel" data-reveal>
          <div className="contact-panel-background" aria-hidden="true">
            <Image src={siteConfig.images.closing.src} alt={siteConfig.images.closing.alt} fill sizes="(max-width: 800px) 100vw, 1280px" />
          </div>
          <div className="contact-panel-copy">
            <p className="kicker">{siteConfig.ui.closingEyebrow}</p>
            <h2 id="closing-contact-title">
              {siteConfig.ui.closingLine1}
              <br />
              <span className="heading-accent">{siteConfig.ui.closingLine2}</span>
            </h2>
            <p>{siteConfig.ui.closingDescription}</p>
            <div className="contact-assurances"><span><Check size={15} aria-hidden="true" /> {siteConfig.ui.closingAssurance1}</span><span><Check size={15} aria-hidden="true" /> {siteConfig.ui.closingAssurance2}</span><span><Check size={15} aria-hidden="true" /> {siteConfig.ui.closingAssurance3}</span></div>
          </div>
          <div className="contact-panel-actions">
            <span className="contact-panel-label">{siteConfig.ui.closingLabel}</span>
            <a className="button primary" href="#quote"><MessageSquareText size={18} aria-hidden="true" />{siteConfig.ui.closingQuote}</a>
            <a className="contact-direct" href={phoneHref}><Phone size={19} aria-hidden="true" /><span>{siteConfig.ui.closingCall}<strong>{siteConfig.business.phone}</strong></span></a>
            <a className="contact-direct" href={`mailto:${siteConfig.business.email}`}><Mail size={19} aria-hidden="true" /><span>{siteConfig.ui.closingEmail}<strong>{siteConfig.business.email}</strong></span></a>
          </div>
        </div>
      </section>
  );
}
