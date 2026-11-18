import Link from 'next/link';

export function RelatedPages({ links, title }: { links?: { label: string; href: string }[]; title?: string }) {
  if (!links?.length) return null;
  const heading = title?.trim() || 'Related pages';
  return <nav className="container section-pad" aria-label={heading}>
    <h2>{heading}</h2>
    <ul className="mt-6 flex flex-wrap gap-6">{links.map(link => <li key={link.href}><Link className="underlink" href={link.href}>{link.label}</Link></li>)}</ul>
  </nav>;
}
