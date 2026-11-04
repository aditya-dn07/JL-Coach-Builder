import Image from 'next/image';
import Link from 'next/link';
import { Facebook } from 'lucide-react';
import { vehicles } from '@/content/catalog';
import { footerNavigation } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import manifest from '@/data/image-manifest.json';
import { site } from '@/data/site.data';
import { FooterContact } from './footer/footer-contact';
import { FooterLinks } from './footer/footer-links';
import { GoogleReviewLink } from '@/components/shared/google-review-link';

const serviceNames = ['Caravan', 'Campervan', 'Motorhome', 'Fifth wheel', 'Bus'];

export function Footer() {
  return (
    <footer data-site-footer className="border-t border-line bg-black text-chrome text-white">
      <div className="mx-auto grid w-[calc(100%-40px)] max-w-[1380px] grid-cols-2 gap-x-6 gap-y-8 py-10 sm:w-[calc(100%-64px)] sm:gap-10 sm:py-[60px] nav:grid-cols-[1.25fr_.7fr_.8fr_1.25fr] nav:gap-9 wide:w-[calc(100%-104px)]">
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <Image src={manifest.logo.src} alt={siteConfig.business.name} width={manifest.logo.width} height={manifest.logo.height} sizes="(max-width: 560px) 300px, 340px" className="h-auto w-[300px] max-w-full sm:w-[340px]" />
          <p className="my-[26px] leading-[1.8] text-[#d3d7dc]">{site.copy.footerIntro}</p>
          <a href={siteConfig.business.sameAs[0]} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand px-[18px] py-3 font-semibold text-white transition-colors hover:bg-[#d40000]"><Facebook size={18} aria-hidden="true" />Follow us on Facebook</a>
          <div className="mt-5"><GoogleReviewLink /></div>
        </div>
        <FooterLinks title="Quick links" links={footerNavigation} />
        <FooterLinks title="Our services" links={vehicles.map((vehicle, index) => ({ label: `${serviceNames[index]} services`, href: vehicle.links[0].href }))} />
        <FooterContact />
      </div>
      <div className="mx-auto flex w-[calc(100%-40px)] max-w-[1380px] flex-col gap-x-7 gap-y-[18px] border-t border-line py-[23px] text-xs text-[#b1bac5] sm:w-[calc(100%-64px)] nav:flex-row nav:flex-wrap nav:items-center nav:justify-between wide:w-[calc(100%-104px)]">
        <span>© {new Date().getFullYear()} {siteConfig.business.name} Ltd. All rights reserved.</span>
        <div className="flex flex-wrap gap-x-[25px] gap-y-2"><Link href="/privacy-policy/">Privacy Policy</Link><Link href="/terms-and-conditions/">Terms &amp; Conditions</Link></div>
        <a href="#top">Back to top</a>
        <a href={site.copy.creditUrl}>{site.copy.credit}</a>
      </div>
    </footer>
  );
}
