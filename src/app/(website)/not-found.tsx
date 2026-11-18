import Link from 'next/link';
import { getPublicContent } from '@/lib/sanity/public-content';
export default async function NotFound() {
 const { editorial } = await getPublicContent();
 const copy = editorial.interface.recovery;
  return (
    <section className="recovery-panel container section-pad">
      <p className="kicker">{copy.notFoundEyebrow}</p>
      <h1>
        {copy.notFoundTitle}
        <br />
        {copy.notFoundTitleLine2}
      </h1>
      <p>{copy.notFoundDescription}</p>
      <div className="recovery-actions">
        <Link className="button primary" href={copy.homeHref}>
          {copy.home}
        </Link>
        <Link className="underlink" href={copy.servicesHref}>
          {copy.services}
        </Link>
        <Link className="underlink" href={copy.contactHref}>
          {copy.contact}
        </Link>
      </div>
    </section>
  );
}
