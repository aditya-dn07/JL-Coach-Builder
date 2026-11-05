import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ContentImage, ContentPage } from '@/content/schema';
import type { CSSProperties, ReactNode } from 'react';

type TextLink = { label: string; href: string };

export function LinkedText({ text, links, className = '' }: { text: string; links?: TextLink[]; className?: string }) {
  if (!links?.length) return <>{text}</>;
  const pieces: ReactNode[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const next = links.map(link => ({ link, start: text.toLowerCase().indexOf(link.label.toLowerCase(), cursor) })).filter(item => item.start >= 0).sort((a, b) => a.start - b.start || b.link.label.length - a.link.label.length)[0];
    if (!next) break;
    const { link, start } = next;
    if (start > cursor) pieces.push(text.slice(cursor, start));
    pieces.push(<Link className={`interior-inline-link ${className}`} href={link.href} key={`${link.href}-${start}`}>{text.slice(start, start + link.label.length)}</Link>);
    cursor = start + link.label.length;
  }
  pieces.push(text.slice(cursor));
  return <>{pieces}</>;
}

export function RelatedServices({ page, images }: { page: ContentPage; images: Record<string, ContentImage> }) {
  if (!page.relatedServices?.length) return null;
  return <nav className="interior-related-services" style={{ '--interior-columns': page.relatedServices.length } as CSSProperties} aria-label={page.sections.find(section => section.id === 'section-5')?.title ?? page.title}>
    {page.relatedServices.map(link => <Link className="interior-related-card" href={link.href} key={link.href}><span className="interior-related-card-photo">{images[link.href] && <Image src={images[link.href].src} alt={images[link.href].alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" className="object-cover" />}</span><span className="interior-related-card-label"><span>{link.label}</span><span className="interior-related-arrow"><ArrowRight size={18} aria-hidden="true" /></span></span></Link>)}
  </nav>;
}
