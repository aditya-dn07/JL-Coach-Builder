'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import type { ImageRef } from '@/data/site.schema';
import { Photo } from '@/components/photo';
import { phoneHref, siteConfig } from '@/config/site';
import { LibraryIcon } from './library-icon';

type Service = { label: string; title: string; description: string; image: ImageRef; links: { label: string; href: string }[] };

export function StudioServices({ services, insuranceTitle, insuranceDescription }: { services: Service[]; insuranceTitle: string; insuranceDescription: string }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  return <div className="studio-service-browser">
    <div className="studio-service-sidebar">
      <div className="studio-service-tabs" role="tablist" aria-label="Choose your vehicle" aria-orientation="vertical">
        {services.map((service, index) => <button key={service.label} ref={element => { buttons.current[index] = element; }} type="button" role="tab" id={`studio-tab-${index}`} aria-controls={`studio-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
          let next = active;
          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (active + 1) % services.length;
          else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (active + services.length - 1) % services.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = services.length - 1;
          else return;
          event.preventDefault(); setActive(next); buttons.current[next]?.focus();
        }}><span className="studio-tab-number">0{index + 1}</span><span>{service.label}</span><span className="studio-tab-status" aria-hidden="true" /></button>)}
      </div>
      <aside className="studio-service-help"><LibraryIcon name="chat-square-text" /><h3>{insuranceTitle}</h3><p>{insuranceDescription}</p><a className="button primary" href={phoneHref}>Call {siteConfig.business.phone}</a></aside>
    </div>
    <div className="studio-service-stage">
      {services.map((service, index) => <div key={service.label} role="tabpanel" id={`studio-panel-${index}`} aria-labelledby={`studio-tab-${index}`} tabIndex={0} hidden={index !== active}>
        {active === index && <motion.div key={index} initial={reduced ? false : { opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="studio-service-photo"><Photo image={service.image} sizes="(max-width: 700px) 100vw, 65vw" /><span>0{index + 1} / 0{services.length}</span></div>
          <div className="studio-service-content"><h3>{service.title}</h3><p>{service.description}</p><div className="service-links">{service.links.map((link, linkIndex) => <Link key={link.href} href={link.href}>{['All services', 'Repairs', 'Panel & paint', 'Alterations & upgrades'][linkIndex]}</Link>)}</div></div>
        </motion.div>}
      </div>)}
    </div>
  </div>;
}
