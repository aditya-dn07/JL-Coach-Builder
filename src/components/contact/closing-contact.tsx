import Image from 'next/image';
import { Check, Mail, Phone, MessageSquareText } from 'lucide-react';
import { phoneHref, siteConfig } from '@/config/site';

export function ClosingContact() {
  return (
      <section className="closing-cta contact-cta" aria-labelledby="closing-contact-title">
        <div className="container contact-panel" data-reveal>
          <div className="contact-panel-background" aria-hidden="true">
            <Image src="/images/cta-caravan-lakeside.webp" alt="" fill sizes="(max-width: 800px) 100vw, 1280px" />
          </div>
          <div className="contact-panel-copy">
            <p className="kicker">Your next adventure starts here</p>
            <h2 id="closing-contact-title">
              Let’s get you
              <br />
              <span className="heading-accent">back on the road.</span>
            </h2>
            <p>From a small repair to a complete rebuild, tell us what your vehicle needs. Our Christchurch team can help you take the next step.</p>
            <div className="contact-assurances"><span><Check size={15} aria-hidden="true" /> Free quotes</span><span><Check size={15} aria-hidden="true" /> All makes and models</span><span><Check size={15} aria-hidden="true" /> Straightforward advice</span></div>
          </div>
          <div className="contact-panel-actions">
            <span className="contact-panel-label">Let’s talk about your vehicle</span>
            <a className="button primary" href="#quote"><MessageSquareText size={18} aria-hidden="true" />Request a free quote</a>
            <a className="contact-direct" href={phoneHref}><Phone size={19} aria-hidden="true" /><span>Call the workshop<strong>{siteConfig.business.phone}</strong></span></a>
            <a className="contact-direct" href={`mailto:${siteConfig.business.email}`}><Mail size={19} aria-hidden="true" /><span>Email our team<strong>{siteConfig.business.email}</strong></span></a>
          </div>
        </div>
      </section>
  );
}
