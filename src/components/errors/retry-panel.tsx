'use client';
import Link from 'next/link';
import { useRecoveryCopy } from '../providers/site-content';
export function RetryPanel({ retry, global = false }: { retry: () => void; global?: boolean }) {
  const copy = useRecoveryCopy();
  return (
    <section className="recovery-panel container section-pad" role="alert">
      <p className="kicker">{copy.eyebrow}</p>
      <h1>
        {copy.title}
        <br />{copy.titleLine2}
      </h1>
      <p>
        {global
          ? copy.globalDescription
          : copy.description}
      </p>
      <div className="recovery-actions">
        <button className="button primary" onClick={retry}>
          {copy.retry}
        </button>
        <Link href={copy.homeHref} className="underlink">
          {copy.home}
        </Link>
        <Link href={copy.contactHref} className="underlink">
          {copy.contact}
        </Link>
      </div>
    </section>
  );
}
