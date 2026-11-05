import Link from 'next/link';

type Props = { title: string; links: { label: string; href: string }[] };

export function FooterLinks({ title, links }: Props) {
  return (
    <div className="min-w-0">
      <h2 className="mb-6 font-sans text-chrome uppercase leading-snug tracking-normal">{title}</h2>
      <ul className="m-0 grid list-none gap-3 p-0">
        {links.map(link => <li key={link.href}><Link href={link.href} className="flex min-h-11 -my-2.5 items-center py-2.5 transition-colors hover:text-[#ff9aa2]">{link.label}</Link></li>)}
      </ul>
    </div>
  );
}
