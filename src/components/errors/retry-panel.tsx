'use client';
import Link from 'next/link';
export function RetryPanel({ retry, global = false }: { retry: () => void; global?: boolean }) {
  return (
    <section className="recovery-panel container section-pad" role="alert">
      <p className="kicker">A small detour</p>
      <h1>
        Something needs
        <br />a second look.
      </h1>
      <p>
        {global
          ? 'The website couldn’t finish loading. Please try again in a moment.'
          : 'We couldn’t load this page. Please retry, or contact our Christchurch workshop for help.'}
      </p>
      <div className="recovery-actions">
        <button className="button primary" onClick={retry}>
          Try again
        </button>
        <Link href="/" className="underlink">
          Back to home
        </Link>
        <Link href="/contact/" className="underlink">
          Contact the workshop
        </Link>
      </div>
    </section>
  );
}
