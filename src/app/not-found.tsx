import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="recovery-panel container section-pad">
      <p className="kicker">404 / A different direction</p>
      <h1>
        Let’s get you
        <br />
        back on track.
      </h1>
      <p>We couldn’t find that page. Our workshop team and vehicle services are right here.</p>
      <div className="recovery-actions">
        <Link className="button primary" href="/">
          Back to home
        </Link>
        <Link className="underlink" href="/#services">
          Explore vehicle services
        </Link>
        <Link className="underlink" href="/contact/">
          Contact the workshop
        </Link>
      </div>
    </section>
  );
}
