import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
import { getSiteContent } from '@/lib/sanity/site-content';
export async function generateMetadata() {
  const { editorial, siteConfig } = await getSiteContent();
  return pageMetadata({ ...editorial.statusSeo, title: editorial.statusSeo?.title || editorial.status.seoTitle, description: editorial.statusSeo?.description || editorial.status.seoDescription, path: '/quote-result/', index: false, settings: siteConfig });
}
export default async function QuoteResult({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { editorial, quoteForm, phoneHref, siteConfig } = await getSiteContent();
  const copy = editorial.status;
  const success = (await searchParams).state === 'success';
  return <section className="container section-pad">
    <p className="kicker">{copy.eyebrow}</p>
    <h1>{success ? copy.successTitle : copy.errorTitle}</h1>
    <p className="my-6" role={success ? 'status' : 'alert'}>{success ? quoteForm.form.messages.success : quoteForm.form.messages.error}</p>
    <div className="flex flex-wrap gap-5">
      <Link className="button primary" href={copy.backHref}>{copy.backLabel}</Link>
      <a className="button" href={phoneHref}>{copy.callLabel} {siteConfig.business.phone}</a>
      <a className="button" href={'mailto:' + siteConfig.business.email}>{copy.emailLabel}</a>
    </div>
  </section>;
}
