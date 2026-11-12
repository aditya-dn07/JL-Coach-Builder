import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
import { phoneHref, siteConfig } from '@/config/site';
import content from '@/content/quote-form.json';

export const metadata = pageMetadata({ title: 'Quote request status', description: 'The status of your enquiry to JL Coachbuilders.', path: '/quote-result/', index: false });

export default async function QuoteResult({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const success = (await searchParams).state === 'success';
  return <section className="container section-pad">
    <p className="kicker">Your enquiry</p>
    <h1>{success ? 'Thank you' : 'Your request could not be sent'}</h1>
    <p className="my-6" role={success ? 'status' : 'alert'}>{success ? content.form.messages.success : content.form.messages.error}</p>
    <div className="flex flex-wrap gap-5">
      <Link className="button primary" href="/contact/#workshop-enquiry">Back to contact</Link>
      <a className="button" href={phoneHref}>Call {siteConfig.business.phone}</a>
      <a className="button" href={'mailto:' + siteConfig.business.email}>Email our team</a>
    </div>
  </section>;
}
