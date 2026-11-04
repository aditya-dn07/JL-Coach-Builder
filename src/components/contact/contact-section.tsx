import { MapPin, Phone, Mail } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { QuoteForm } from '@/components/contact/quote-form';
import { siteConfig, phoneHref, fullAddress, directionsHref } from '@/config/site';

export function ContactSection({ page }: { page: ContentPage }) {
  const address = fullAddress;
  return (
    <section id="page-details" className="section-pad container">
      <div className="contact-layout">
        <div data-reveal>
          <p className="kicker">A conversation is a good start</p>
          <h2>
            Tell us what
            <br />
            <span className="heading-accent">you have in mind.</span>
          </h2>
          <p>
            Describe your vehicle and the work you need. Our team will help you understand the next
            step.
          </p>
          <p>{page.sections.flatMap((section) => section.blocks).filter((block) => block.type === 'paragraph')[1]?.text}</p>
          <div className="contact-methods">
            <a href={phoneHref}>
              <Phone />
              <span>
                <small>Give us a call</small>
                {siteConfig.business.phone}
              </span>
            </a>
            <a href={`mailto:${siteConfig.business.email}`}>
              <Mail />
              <span>
                <small>Drop us a line</small>
                {siteConfig.business.email}
              </span>
            </a>
            <a href={directionsHref}>
              <MapPin />
              <span>
                <small>Visit the workshop</small>
                {address}
              </span>
            </a>
          </div>
        </div>
        <div id="contact-enquiry" className="contact-enquiry"><QuoteForm /></div>
      </div>
      <iframe
        className="contact-map"
        title="JL Coachbuilders Christchurch workshop location"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
