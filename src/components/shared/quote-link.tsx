import { LibraryIcon } from '@/components/shared/library-icon';
import { contentRepository } from '@/content/repository';

export function QuoteLink({ label = contentRepository.getSiteSettings().ui.quote }: { label?: string }) {
  return <a className="button primary" href="#quote"><LibraryIcon name="chat-square-text" />{label}</a>;
}
