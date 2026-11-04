'use client';
import { useState } from 'react';
import { LibraryIcon } from '@/components/shared/library-icon';

const services = 'Repairs · Upgrades · Servicing · Panel & Paint · Self Containment';

export function ServiceMarquee() {
  const [paused, setPaused] = useState(false);
  return <div className="service-marquee" data-paused={paused}>
    <div className="service-marquee-window">
      <span className="sr-only">{services}</span>
      <div className="service-marquee-track" aria-hidden="true">
        {[0, 1].map(copy => <span key={copy}>{services} ·&nbsp;</span>)}
      </div>
    </div>
    <button type="button" aria-label={paused ? 'Play service marquee' : 'Pause service marquee'} onClick={() => setPaused(!paused)}><LibraryIcon name={paused ? 'play-fill' : 'pause-fill'} /></button>
  </div>;
}
