import Link from 'next/link';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import type { ContentPage } from '@/content/schema';
import { vehicles } from '@/content/catalog';

export function RelatedServices({ page }: { page: ContentPage }) {
  const v = vehicles.find((v) => v.image.id === page.image);
  if (!v) return null;
  return (
    <section className="container section-pad related-services">
      <p className="kicker">Care for the complete vehicle</p>
      <h2><TwoToneHeading text="What else can we help with?" /></h2>
      <div>
        {v.links
          .filter((l) => l.href !== `/${page.slug}/`)
          .map((l) => (
            <Link href={l.href} key={l.href}>
              {l.label}
            </Link>
          ))}
      </div>
    </section>
  );
}
