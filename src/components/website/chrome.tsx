import Image from 'next/image';
import Link from 'next/link';
import { vehicles } from '@/content/catalog';
import { siteConfig, phoneHref, fullAddress, directionsHref } from '@/config/site';
import manifest from '@/data/image-manifest.json';
import { HeaderNavigation } from './header-navigation';
import { Phone, Mail, Check } from 'lucide-react';
export function Header() {
  return (
    <HeaderNavigation
      groups={vehicles.map(({ label, links }) => ({ label, links }))}
      logo={manifest.logo}
    />
  );
}
export function Footer() {
  return (
    <>
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
            <a className="button primary" href="#quote">Request a free quote</a>
            <a className="contact-direct" href={phoneHref}><Phone size={19} aria-hidden="true" /><span>Call the workshop<strong>{siteConfig.business.phone}</strong></span></a>
            <a className="contact-direct" href={`mailto:${siteConfig.business.email}`}><Mail size={19} aria-hidden="true" /><span>Email our team<strong>{siteConfig.business.email}</strong></span></a>
          </div>
        </div>
      </section>
      <footer className="new-footer">
        <div className="container footer-top">
          <div>
            <Image
              src={manifest.logo.src}
              alt={siteConfig.business.name}
              width={manifest.logo.width}
              height={manifest.logo.height}
              sizes="280px"
            />
            <p>
              Two workshops. One team.
              <br />
              Complete solutions.
            </p>
            <a href={siteConfig.business.sameAs[0]} className="underlink">
              Follow us on Facebook
            </a>
          </div>
          <div>
            <h2>Explore</h2>
            {[
              { label: 'Our story', href: '/about/' },
              { label: 'Our work', href: '/gallery/' },
              { label: 'Insurance repairs', href: '/insurance/' },
              { label: 'Contact', href: '/contact/' },
            ].map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Our services</h2>
            {vehicles.map((vehicle) => (
              <Link key={vehicle.label} href={vehicle.links[0].href}>
                {vehicle.label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Come and see us</h2>
            <p>{fullAddress}</p>
            <a href={directionsHref} className="underlink">
              Get directions
            </a>
          </div>
        </div>
        <div className="container footer-base">
          <span>
            © {new Date().getFullYear()} {siteConfig.business.name} Ltd.
          </span>
          <div>
            <Link href="/privacy-policy/">Privacy Policy</Link>
            <Link href="/terms-and-conditions/">Terms & Conditions</Link>
          </div>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </>
  );
}
