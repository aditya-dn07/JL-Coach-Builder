'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { LibraryIcon } from './library-icon';
import { QuoteModal } from '@/components/quote-modal';
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
  return (
    <>
      <QuoteModal />
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <div className="topline">
        <span>
          {siteConfig.business.address.locality}, New Zealand{' '}
          <span className="topline-dot" aria-hidden="true">
            ●
          </span>{' '}
          Built on experience. Since {siteConfig.business.foundedYear}.
        </span>
        <a href={phoneHref}>
          <Phone size={12} aria-hidden="true" />
          {siteConfig.business.phone}
        </a>
      </div>
      <header ref={headerRef} className="main-header">
        <Link
          href="/"
          className="wordmark"
          aria-label={`${siteConfig.business.name} home`}
          onClick={close}
        >
          <Image
            src={logo.src}
            alt={siteConfig.business.name}
            width={logo.width}
            height={logo.height}
            sizes="(max-width: 760px) 190px, (max-width: 1200px) 215px, 260px"
            priority
          />
        </Link>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? 'main-nav open' : 'main-nav'}
          onClick={(event) => {
            if ((event.target as Element).closest('a')) close();
          }}
        >
          <Link href="/" aria-current={isCurrent('/') ? 'page' : undefined}>
            <span className="nav-label">Home</span>
          </Link>
          <details className="vehicle-menu">
            <summary>
              Our services <ChevronDown size={12} aria-hidden="true" />
            </summary>
            <div className="mega-menu">
              {groups.map((group) => (
                <div key={group.label}>
                  <strong>{group.label}</strong>
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isCurrent(link.href) ? 'page' : undefined}
                    >
                      {link.label.replace(/^(Caravan|Campervan|Motorhome|Fifth Wheel|Bus) /, '')}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </details>
          {[
            { label: 'Our story', href: '/about/' },
            { label: 'Our work', href: '/gallery/' },
            { label: 'Insurance repairs', href: '/insurance/' },
            { label: 'Contact', href: '/contact/' },
          ].map((link) => (
            <Link
              href={link.href}
              key={link.href}
              aria-current={isCurrent(link.href) ? 'page' : undefined}
            >
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </nav>
        <a href="#quote" className="button primary header-cta" onClick={close}>
          <LibraryIcon name="chat-square-text" />Let’s talk
        </a>
        <button
          ref={toggleRef}
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-controls="main-navigation"
          aria-expanded={open}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
        >
          <LibraryIcon name={open ? 'x-lg' : 'list'} />
        </button>
      </header>
    </>
  );
}
