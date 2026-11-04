'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { LibraryIcon } from '@/components/shared/library-icon';
import { QuoteModal } from '@/components/contact/quote-modal';
import { mainNavigation } from '@/config/navigation';
import { siteConfig, phoneHref } from '@/config/site';
type NavigationGroup = { label: string; links: { label: string; href: string }[] };
export function HeaderNavigation({
  groups,
  logo,
}: {
  groups: NavigationGroup[];
  logo: { src: string; width: number; height: number };
}) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isCurrent = (href: string) =>
    path === href.replace(/\/$/, '') || (href === '/' && path === '/');
  function close() {
    setOpen(false);
    headerRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((el) => {
      el.open = false;
    });
  }
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) close();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
      const summary = headerRef.current?.querySelector<HTMLElement>('details[open] summary');
      if (open) toggleRef.current?.focus();
      else summary?.focus();
      close();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  const servicesActive = groups.some(group => group.links.some(link => isCurrent(link.href)));
  const navItemClass = 'relative whitespace-nowrap py-3 transition-colors hover:text-brand aria-[current=page]:text-brand nav:py-2 nav:after:absolute nav:after:inset-x-0 nav:after:bottom-0 nav:after:h-0.5 nav:after:origin-left nav:after:scale-x-0 nav:after:bg-brand nav:after:transition-transform nav:after:duration-200 nav:hover:after:scale-x-100 nav:focus-visible:after:scale-x-100 nav:aria-[current=page]:after:scale-x-100 motion-reduce:after:transition-none';
  const navLinkClass = `${navItemClass} block`;
  return (
    <>
      <QuoteModal />
      <a href="#content" className="fixed left-2.5 top-2 z-[1000] -translate-y-[200%] bg-white p-3 text-black focus:translate-y-0">Skip to content</a>
      <div className="flex min-h-10 items-center justify-between gap-4 bg-surface px-5 py-2 text-chrome text-[#b1bac5] nav:px-[52px]">
        <span className="hidden text-xs sm:inline">{siteConfig.business.address.locality}, New Zealand <span className="mx-2.5 text-brand" aria-hidden="true">·</span> Built on experience. Since {siteConfig.business.foundedYear}.</span>
        <span className="text-xs sm:hidden">Christchurch, NZ</span>
        <a href={phoneHref} className="flex shrink-0 items-center gap-2"><Phone size={15} aria-hidden="true" />{siteConfig.business.phone}</a>
      </div>
      <header ref={headerRef} data-site-header className="sticky top-0 z-50 flex h-[77px] items-center justify-between gap-3 border-b border-line bg-black px-5 text-chrome text-white shadow-lg sm:h-[82px] nav:h-[100px] nav:gap-[18px] nav:px-6 wide:gap-6 wide:px-[52px]">
        <Link href="/" className="block w-[min(230px,calc(100vw-100px))] shrink-0 sm:w-[280px] wide:w-[340px]" aria-label={
          `${siteConfig.business.name} home`
        } onClick={close}>
          <Image src={logo.src} alt={siteConfig.business.name} width={logo.width} height={logo.height} sizes="(max-width: 560px) 230px, (max-width: 1400px) 280px, 340px" priority className="block h-auto w-full" />
        </Link>
        <nav id="main-navigation" aria-label="Main navigation" className={
          `${open ? 'grid' : 'hidden'} absolute inset-x-0 top-full max-h-[calc(100dvh-82px)] gap-x-4 overflow-y-auto border-b border-line bg-surface px-8 py-5 font-medium nav:static nav:flex nav:max-h-none nav:items-center nav:overflow-visible nav:border-0 nav:bg-transparent nav:p-0 wide:gap-x-[26px]`
        } onClick={(event) => { if ((event.target as Element).closest('a')) close(); }}>
          <Link href="/" className={navLinkClass} aria-current={isCurrent('/') ? 'page' : undefined}>Home</Link>
          <details className="group [&>summary::-webkit-details-marker]:hidden">
            <summary data-active={servicesActive} className={`${navItemClass} flex list-none items-center gap-2 data-[active=true]:text-brand nav:data-[active=true]:after:scale-x-100`}>Our services <ChevronDown size={12} aria-hidden="true" className="transition-transform group-open:rotate-180" /></summary>
            <div className="grid gap-6 border-line bg-surface py-5 sm:grid-cols-2 nav:absolute nav:inset-x-0 nav:top-full nav:grid-cols-5 nav:border-b nav:px-[52px] nav:py-10 nav:shadow-xl">
              {groups.map(group => <div key={group.label}>
                <strong className="mb-4 block font-semibold">{group.label}</strong>
                {group.links.map(link => <Link key={link.href} href={link.href} className="block border-t border-line py-2.5 hover:text-brand aria-[current=page]:text-brand" aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label.replace(/^(Caravan|Campervan|Motorhome|Fifth Wheel|Bus) /, '')}</Link>)}
              </div>)}
            </div>
          </details>
          {mainNavigation.map(link => <Link key={link.href} href={link.href} className={navLinkClass} aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label}</Link>)}
        </nav>
        <a href="#quote" className="hidden min-h-[49px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-brand px-4 py-3 font-semibold transition-colors hover:bg-[#d40000] sm:flex nav:hidden min-[1201px]:flex" onClick={close}><LibraryIcon name="chat-square-text" />Let’s talk</a>
        <button ref={toggleRef} type="button" className="ml-auto grid h-[42px] w-[42px] shrink-0 place-items-center border-0 bg-transparent p-0 nav:hidden" onClick={() => setOpen(!open)} aria-controls="main-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}</button>
      </header>
    </>
  );
}
