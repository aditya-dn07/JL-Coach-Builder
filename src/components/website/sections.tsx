import Link from 'next/link';
import Image from 'next/image';
import galleryPhotos from '@/data/site-gallery.json';
import { TwoToneHeading } from './two-tone-heading';
import { Check, MapPin, Phone, Mail, ShieldCheck, Truck, Wrench } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { imageFor, vehicles } from '@/content/catalog';
import { Photo } from '@/components/photo';
import { QuoteForm } from '@/components/quote-form';
import { site } from '@/data/site.data';
import { siteConfig, phoneHref, fullAddress, directionsHref } from '@/config/site';
import { AnimatedBenefitCard } from './animated-benefit-card';
import { InteriorHero } from './interior-hero';
import { ProjectGallery } from './project-gallery';
import { LibraryIcon } from './library-icon';
import { ServiceMarquee } from './service-marquee';

export function PageHero({ page }: { page: ContentPage }) {
  return page.kind === 'home' ? <HomeBanner page={page} /> : <InteriorHero page={page} />;
}
function HomeBanner({ page }: { page: ContentPage }) {
  return (
    <section className="home-hero home-banner" aria-labelledby="home-banner-title">
      <div className="banner-background" aria-hidden="true">
        <Image src="/images/home-workshop-banner.webp" alt="" fill priority sizes="100vw" />
      </div>
      <div className="container road-banner-inner">
        <div className="road-banner-topline"><span><MapPin size={13} aria-hidden="true" /> Christchurch, New Zealand</span><span>Independent workshop · Since 2016</span></div>
        <div className="road-banner-heading">
          <p className="road-eyebrow">{page.eyebrow}</p>
          <h1 id="home-banner-title"><TwoToneHeading text={page.title} /></h1>
        </div>
        <div className="road-banner-details">
          <div><p>{page.description}</p><ServiceMarquee /></div>
          <Link className="road-experience" href="/about/" aria-label="Meet our team with over 80 years of combined experience"><span>80<small>+</small></span><p>Years of combined<br />craftsmanship</p></Link>
        </div>
        <div className="road-quote-bar">
          <div className="road-quote-title"><span className="road-status-dot" /><div><strong>Trusted Local Specialists</strong><p>All makes and models</p></div></div>
          <a className="road-call" href={phoneHref}><Phone size={18} aria-hidden="true" /><span>Call<strong>{siteConfig.business.phone}</strong></span></a>
          <a href="#quote" className="road-quote-link"><LibraryIcon name="chat-square-text" />Get a free quote</a>
        </div>
      </div>
      <nav className="road-service-ribbon" aria-label="Workshop services">
        <Link href="/caravan-repairs-in-christchurch/"><span>01</span> Repairs &amp; servicing</Link>
        <Link href="/caravan-alterations-and-upgrades-in-christchurch/"><span>02</span> Alterations &amp; upgrades</Link>
        <Link href="/caravan-panel-and-paint-services-in-christchurch/"><span>03</span> Panel &amp; paint</Link>
        <Link href="/insurance/"><span>04</span> Insurance repairs</Link>
      </nav>
    </section>
  );
}
export function TrustStrip() {
  return (
    <section className="trust-strip trust-features" aria-label="Our workshop at a glance">
      <div className="container">
        <div className="trust-feature"><span className="trust-feature-icon"><LibraryIcon name="tools" /></span><div className="trust-feature-copy"><h3>Experienced hands</h3><p>80+ years of combined craftsmanship</p></div></div>
        <div className="trust-feature"><span className="trust-feature-icon"><LibraryIcon name="calendar-check" /></span><div className="trust-feature-copy"><h3>Locally owned</h3><p>Serving Canterbury since 2016</p></div></div>
        <div className="trust-feature"><span className="trust-feature-icon"><LibraryIcon name="truck" /></span><div className="trust-feature-copy"><h3>Every make and model</h3><p>Specialist care for your vehicle</p></div></div>
        <div className="trust-feature"><span className="trust-feature-icon"><LibraryIcon name="people" /></span><div className="trust-feature-copy"><h3>One workshop team</h3><p>Complete support for the whole job</p></div></div>
      </div>
    </section>
  );
}
export function VehicleServices() {
  const summaries = [
    'Repairs, servicing and upgrades to keep your caravan ready for the road.',
    'Body repairs, interior improvements and custom work for your campervan.',
    'Complete motorhome care, from leaks and maintenance to renovations.',
    'Specialist repairs, bodywork and alterations for your fifth wheel.',
    'Coachbuilding, structural repairs and panel and paint for buses.',
  ];
  return (
    <section id="services" className="vehicle-section section-pad container">
      <div className="section-heading" data-reveal>
        <p className="kicker">Find your service</p>
        <h2>
          Start with your vehicle.
          <br />
          <span>Find the right service.</span>
        </h2>
        <p>
          From the smallest fix to a complete rebuild. Specialist care for the vehicles that take
          you places.
        </p>
      </div>
      <div className="vehicle-grid">
        {vehicles.map((v, i) => (
          <article className={`vehicle-card vehicle-${i}`} key={v.label} data-reveal>
            <Link href={v.links[0].href} className="vehicle-photo">
              <Photo image={v.image} sizes="(max-width: 650px) 100vw, 33vw" />
              <span className="vehicle-number">0{i + 1}</span>
              
            </Link>
            <div className="vehicle-card-copy">
              <h3><Link href={v.links[0].href}>{v.label}</Link></h3>
              <p>{summaries[i]}</p>
              <div className="service-links">
                {v.links.map((l) => (
                  <Link href={l.href} key={l.href}>
                    {['All services', 'Repairs', 'Panel & paint', 'Alterations & upgrades'][v.links.indexOf(l)]}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
        <article className="service-help-card">
          <span className="capability-icon"><Phone size={25} aria-hidden="true" /></span>
          <p className="kicker">A good place to start</p>
          <h3>Not sure what<br /><span className="heading-accent">your vehicle needs?</span></h3>
          <p>Tell us what’s happening. Our team can help you work out the next step.</p>
          <a className="button primary" href="#quote">Tell us about your vehicle</a>
          <a className="underlink" href={phoneHref}>Or call {siteConfig.business.phone}</a>
        </article>
      </div>
    </section>
  );
}
function Groups({ blocks, illustrated = false, serviceLinks = [], statementCards = false }: { blocks: ContentPage['sections'][number]['blocks']; illustrated?: boolean; serviceLinks?: { label: string; href: string }[]; statementCards?: boolean }) {
  const icons = [ShieldCheck, Truck, MapPin, Wrench];
  const normalizeService = (text: string) => text.toLowerCase().replace(/&/g, 'and').replace(/alterations?/g, 'alteration').replace(/fifth wheels?/g, 'fifthwheel').replace(/services?|in christchurch/g, '').replace(/[^a-z]/g, '');
  const groups: { title: string; text: string[] }[] = [];
  const leading: string[] = [];
  const presentationBlocks = statementCards ? blocks.flatMap((block) => {
    const colon = block.text.indexOf(':');
    if (block.type === 'paragraph' && colon > 0 && colon < 45) return [
      { type: 'heading' as const, text: block.text.slice(0, colon) },
      { type: 'paragraph' as const, text: block.text.slice(colon + 1).trim() },
    ];
    return [block];
  }) : blocks;
  presentationBlocks.forEach((b) => {
    if (b.type === 'heading') groups.push({ title: b.text, text: [] });
    else if (groups.length) groups[groups.length - 1].text.push(b.text);
    else leading.push(b.text);
  });
  const lastGroup = groups.at(-1);
  const closingParagraph = (illustrated || statementCards) && lastGroup && lastGroup.text.length > 1
    ? lastGroup.text.pop()
    : undefined;
  const backgroundPool = ['insurance', 'models', 'canterbury', 'maintenance-v2'];
  const usedBackgrounds = new Set<string>();
  const backgrounds = groups.map((group, index) => {
    const preferred = /all makes|models/i.test(group.title) ? 'models'
      : /local|trusted|canterbury/i.test(group.title) ? 'canterbury'
      : /maintenance|prevention/i.test(group.title) ? 'maintenance-v2'
      : /insurance|experienced/i.test(group.title) ? 'insurance'
      : backgroundPool[index % backgroundPool.length];
    const chosen = usedBackgrounds.has(preferred)
      ? backgroundPool.find((background) => !usedBackgrounds.has(background)) ?? preferred
      : preferred;
    usedBackgrounds.add(chosen);
    return chosen;
  });
  return (
    <>
      <div className="section-prose">
        {leading.map((p, i) => {
          const short = p.length < 85 && !/[.!?:]$/.test(p);
          if (short && i > 0 && leading[i - 1].length < 85 && !/[.!?:]$/.test(leading[i - 1]))
            return null;
          if (short) {
            const items = leading
              .slice(i)
              .slice(
                0,
                leading.slice(i).findIndex((t) => t.length >= 85 || /[.!?:]$/.test(t)) < 0
                  ? undefined
                  : leading.slice(i).findIndex((t) => t.length >= 85 || /[.!?:]$/.test(t))
              );
            return (
              <ul key={i}>
                {items.map((item, j) => {
                  const destination = serviceLinks.find((link) => normalizeService(link.label) === normalizeService(item));
                  return <li key={j}>{destination
                    ? <Link className="list-service-button" href={destination.href}><Check className="list-check" size={16} aria-hidden="true" /><span>{item}</span></Link>
                    : <><Check className="list-check" size={16} aria-hidden="true" /><span>{item}</span></>}</li>;
                })}
              </ul>
            );
          }
          return <p key={i}>{p}</p>;
        })}
      </div>
      {groups.length > 0 && (
        <div className="detail-grid">
          {groups.map((g, i) => {
            const Icon = icons[i % icons.length];
            const cardContent = <>
              {illustrated && <Image className="benefit-background" src={`/images/why-choose/${backgrounds[i]}.webp`} alt="" fill sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 30vw" />}
              {illustrated && <span className="capability-icon"><Icon size={25} aria-hidden="true" /></span>}
              <span className="detail-index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{g.title}</h3>
              {g.text.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </>;
            return illustrated
              ? <AnimatedBenefitCard key={g.title} index={i}>{cardContent}</AnimatedBenefitCard>
              : <article className={g.text.length ? undefined : 'compact-detail'} key={g.title}>{cardContent}</article>;
          })}
        </div>
      )}
      {closingParagraph && <p className="capability-note">{closingParagraph}</p>}
    </>
  );
}
export function DocumentSections({ page, sectionIds }: { page: ContentPage; sectionIds?: string[] }) {
  const sections = page.sections.filter(
    (s) =>
      sectionIds ? sectionIds.includes(s.id) : (page.kind !== 'home' ||
      !/Experience That Shows|Specialist Repairs, Servicing|Over 100 Five-Star/.test(s.title))
  );
  return (
    <div
      id={sectionIds ? `page-details-${sectionIds[0]}` : 'page-details'}
      className={page.kind === 'legal' ? 'legal-content container' : 'document-sections'}
    >
      {!sectionIds && page.intro.length > 1 && (
        <section
          className={
            page.kind === 'legal' ? 'content-section' : 'container content-section section-pad'
          }
        >
          <div className="intro-prose">
            {page.intro.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}
      {sections.map((s, i) =>
        /Common Questions/.test(s.title) ? (
          <section id={s.id} className="faq-block section-pad" key={s.id}>
            <div className="container faq-layout" data-reveal>
              <div>
                <p className="kicker">{page.kind === 'home' ? 'FAQs' : 'A little clarity'}</p>
                <h2><TwoToneHeading text={s.title} /></h2>
                <p>
                  {page.kind === 'home' ? '' : 'Have a different question?'}
                  <br />
                  <a className="underlink" href={page.kind === 'home' ? '#quote' : phoneHref}>
                    <LibraryIcon name={page.kind === 'home' ? 'chat-square-text' : 'telephone'} />{page.kind === 'home' ? 'Get a free quote' : 'Talk to our team'}
                  </a>
                </p>
              </div>
              <div className="faq-questions">
                {page.faqs.map((f, index) => (
                  <details key={f.question} name={`faq-${page.slug || 'home'}-${s.id}`} open={index === 0}>
                    <summary>
                      {f.question}
                      <span className="faq-toggle-icon" aria-hidden="true"><LibraryIcon name="plus-lg" className="faq-plus" /><LibraryIcon name="x-lg" className="faq-close" /></span>
                    </summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section
            key={s.id}
            id={s.id}
            data-section-layout={page.kind === 'legal' ? 'legal' : /Why Choose/.test(s.title) ? 'benefits' : s.blocks.some((block) => block.type === 'heading' && /^1[.)]/.test(block.text)) ? 'process' : i === 0 ? 'intro' : s.blocks.filter((block) => block.type === 'heading').length > 5 ? 'coverage' : i === sections.length - 1 ? 'closing' : 'standard'}
            className={`content-section ${page.kind === 'legal' ? '' : 'section-pad'} ${i % 3 === 1 ? 'tinted' : ''} ${page.kind === 'home' ? `home-content-${s.id}` : ''}`}
          >
            <div className={page.kind === 'legal' ? '' : page.kind === 'home' ? 'container' : 'container editorial-layout'} data-reveal>
              <div className="content-section-header">
                {page.kind !== 'legal' && (
                  <p className="kicker">
                    {page.kind === 'home' ? ({'section-3': 'Common Problems We Fix', 'section-5': 'Why Choose Us', 'section-6': 'Insurance Repairs'}[s.id] ?? '') : `${String(i + 1).padStart(2, '0')} / Expertise & care`}
                  </p>
                )}
                <h2><TwoToneHeading text={s.title} /></h2>
                {page.kind === 'home' && s.id === 'section-3' && (
                  <a className="underlink section-link" href="#quote"><LibraryIcon name="chat-square-text" />Get a free quote</a>
                )}
              </div>
              {page.kind === 'home' && s.id === 'section-4' && (
                <div className="capability-photo">
                  <Photo image={vehicles[2].image} sizes="(max-width: 800px) 100vw, 45vw" />
                  <span><MapPin size={15} aria-hidden="true" /> Christchurch, Canterbury</span>
                </div>
              )}
              {i === 0 && page.kind !== 'home' && page.kind !== 'legal' && <div className="section-context-photo"><Photo image={imageFor(page.image)} sizes="(max-width: 800px) 100vw, 40vw" /><span>Specialist care at our Christchurch workshop</span></div>}
              <div className={page.kind !== 'home' && page.kind !== 'legal' ? 'editorial-body' : 'section-body'}>
              <Groups blocks={s.blocks} illustrated={(page.kind === 'home' && s.id === 'section-5') || (page.kind === 'service' && /Why Choose/.test(s.title))} serviceLinks={page.kind === 'service' ? vehicles.find((vehicle) => vehicle.image.id === page.image)?.links : undefined} statementCards={page.kind === 'about' && s.id === 'section-2'} />
              {page.kind !== 'legal' && !(page.kind === 'home' && s.id === 'section-3') && (
                <a className="underlink section-link" href="#quote">
                  <LibraryIcon name="chat-square-text" />{page.kind === 'home' ? 'Get a free quote' : 'Let’s discuss your vehicle'}
                </a>
              )}
              </div>
            </div>
          </section>
        )
      )}
    </div>
  );
}
export function WorkshopFeature() {
  return (
    <section className="workshop-feature">
      <div className="feature-image">
        <Photo image={site.hero.image} sizes="(max-width: 800px) 100vw, 50vw" />
        <div className="workshop-stamp"><strong>80<span>+</span></strong><span>Years of combined<br />craftsmanship</span></div>
      </div>
      <div className="feature-copy" data-reveal>
        <p className="kicker">More than a repair workshop</p>
        <h2>
          Good people.
          <br />
          <span className="heading-accent">Proper workmanship.</span>
        </h2>
        <p>
          Founded in 2016 by trade-qualified coachbuilder Jamie Lewis, our Christchurch workshop
          brings coachbuilders, spray painters, panel beaters, RV technicians and a qualified
          mechanic together.
        </p>
        <p>
          One team to look after the whole job, with the experience to see what others might miss.
        </p>
        <ul>
          <li>
            <Check size={18} />
            80+ years of combined experience
          </li>
          <li>
            <Check size={18} />
            Structural, interior, panel and paint expertise
          </li>
          <li>
            <Check size={18} />A purpose-built 14-metre spray booth
          </li>
        </ul>
        <Link href="/about/" className="button light">
          Meet JL Coachbuilders
        </Link>
      </div>
    </section>
  );
}
export function Reviews() {
  const reviews = site.reviews.slice(0, 3);
  return (
    <section className="reviews-block section-pad container">
      <div className="section-heading" data-reveal>
        <p className="kicker">Good words. From good people.</p>
        <h2>
          Trusted with their
          <br />
          <span>home away from home.</span>
        </h2>
        <p className="review-stars">
          ★★★★★ <span>4.9 on Google · 100+ five-star reviews</span>
        </p>
      </div>
      <div className="reviews-grid">
        {reviews.map((r) => (
          <blockquote key={r.author} data-reveal>
            <span className="quote-mark">“</span>
            <p>{r.text}</p>
            <footer>
              <span className="review-avatar">{r.author[0]}</span>
              <div>
                <strong>{r.author}</strong>
                <span>{r.location}</span>
              </div>
              <span className="review-google">G</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
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
export function Gallery() {
  return <ProjectGallery photos={galleryPhotos} />;
}
export function RelatedServices({ page }: { page: ContentPage }) {
  const v = vehicles.find((v) => v.image.id === page.image);
  if (!v) return null;
  return (
    <section className="container section-pad related-services">
      <p className="kicker">Care for the complete vehicle</p>
      <h2><TwoToneHeading text="What else can we help with?" /></h2>
      <div>
        {v.links
          .filter((l) => l.href !== `/${page.slug}/`)
          .map((l) => (
            <Link href={l.href} key={l.href}>
              {l.label}
            </Link>
          ))}
      </div>
    </section>
  );
}
