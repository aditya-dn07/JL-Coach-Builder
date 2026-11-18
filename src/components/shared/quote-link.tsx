import { getSiteContent } from '@/lib/sanity/site-content';
import { LibraryIcon } from '@/components/shared/library-icon';

export async function QuoteLink({ label, href }: { label?: string; href?: string }) {
  const { contentRepository, siteConfig } = await getSiteContent();
  return <a className="button primary" href={href || siteConfig.ui.quoteTarget}><LibraryIcon name="chat-square-text" />{label ?? contentRepository.getSiteSettings().ui.quote}</a>;
}
