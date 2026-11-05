import { Mail, MapPin, Phone } from 'lucide-react';
import { directionsHref, fullAddress, mapEmbedSrc, phoneHref, siteConfig } from '@/config/site';

const contactClass = 'mb-3 flex min-h-11 items-center gap-4 break-words py-1.5 transition-colors hover:text-[#ff9aa2] [&>svg]:shrink-0 [&>svg]:text-[#ff3038]';

export function FooterContact() {
  return (
    <div className="col-span-2 min-w-0 sm:col-span-1">
      <h2 className="mb-6 font-sans text-chrome uppercase leading-snug tracking-normal">{siteConfig.ui.footerContact}</h2>
      <a className={contactClass} href={phoneHref}><Phone size={22} aria-hidden="true" /><span>{siteConfig.business.phone}</span></a>
      <a className={contactClass} href={`mailto:${siteConfig.business.email}`}><Mail size={22} aria-hidden="true" /><span className="min-w-0 [overflow-wrap:anywhere]">{siteConfig.business.email}</span></a>
      <a className={contactClass} href={directionsHref} target="_blank" rel="noopener noreferrer"><MapPin size={22} aria-hidden="true" /><span>{fullAddress}</span></a>
      <iframe className="mt-6 block h-[220px] w-full rounded-lg border-0" title={siteConfig.ui.footerMapTitle} src={mapEmbedSrc} width="600" height="450" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </div>
  );
}
