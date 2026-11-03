'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { phoneHref, siteConfig } from '@/config/site';

const designs = [
  { id: 'original', label: 'Panoramic classic' },
  { id: 'editorial', label: 'Rounded studio' },
] as const;

type SectionName = 'trust' | 'services' | 'repairs' | 'workshop' | 'benefits' | 'insurance' | 'reviews' | 'faq' | 'closing';
const sectionOrders: Record<(typeof designs)[number]['id'], SectionName[]> = {
  original: ['trust', 'services', 'repairs', 'workshop', 'benefits', 'insurance', 'reviews', 'faq', 'closing'],
  editorial: ['trust', 'services', 'workshop', 'repairs', 'benefits', 'insurance', 'reviews', 'faq', 'closing'],
};

export function HomeDesigns({ currentHero, sections, title, eyebrow, description }: {
  currentHero: ReactNode;
  sections: Record<SectionName, ReactNode>;
  title: string;
  eyebrow: string;
  description: string;
}) {
  const [design, setDesign] = useState<(typeof designs)[number]['id']>('original');
  const reduced = useReducedMotion();
  return (
    <div className="home-designs" data-home-design={design}>
      <div className="design-picker" role="group" aria-label="Homepage design options">
        <span>Choose your homepage layout</span>
        <div>{designs.map((option, i) => (
          <button key={option.id} type="button" aria-pressed={design === option.id} onClick={() => setDesign(option.id)}>
            <span>0{i + 1}</span> {option.label}
          </button>
        ))}</div>
      </div>
      {design === 'original' ? currentHero : (
        <section className={`home-hero alternate-hero design-${design}`} aria-labelledby="alternate-hero-title">
          <div className="alternate-photo">
            <Image src="/images/home-workshop-banner.webp" alt="Caravans and motorhomes outside the JL Coachbuilders workshop in Christchurch" fill priority sizes="100vw" />
          </div>
          <div className="alternate-copy">
            <p className="alternate-eyebrow">{eyebrow}</p>
            <h1 id="alternate-hero-title">{title}</h1>
            <p className="alternate-description">{description}</p>
            <p className="home-service-summary">Repairs · Upgrades · Servicing · Panel &amp; Paint · Self Containment</p>
            <div className="alternate-actions"><a href="#quote">Get a free quote</a><a href={phoneHref}>Call {siteConfig.business.phone}</a></div>
            <div className="alternate-proof"><span><strong>80+</strong> Years of combined experience</span><span><strong>2016</strong> Locally owned since</span></div>
          </div>
          <div className="studio-hero-note"><span>Trusted Local Specialists</span><strong>Experience That Shows<br />in the Finished Job</strong><a href="#quote">Get a free quote</a></div>
          <div className="alternate-bottom"><span>Caravans · Motorhomes · Campervans · Fifth wheels · Buses</span><a href={phoneHref}>Talk to the team {siteConfig.business.phone}</a></div>
        </section>
      )}
      <div className="home-layout-sections">
        {sectionOrders[design].map((name) => <motion.div className={`layout-slot slot-${name}`} key={`${design}-${name}`} initial={false} whileInView={reduced ? undefined : { opacity: [0.72, 1] }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.6, ease: 'easeOut' }}>{sections[name]}</motion.div>)}
      </div>
    </div>
  );
}
