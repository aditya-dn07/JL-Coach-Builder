import { phoneHref } from '@/config/site';
import { LibraryIcon } from '@/components/shared/library-icon';

export function MobileActionBar() {
  return (
    <nav className="mobile-action-bar" aria-label="Quick contact">
      <a className="mobile-action-button mobile-action-call" href={phoneHref}>
        <LibraryIcon name="telephone" />Call Now
      </a>
      <a className="mobile-action-button mobile-action-quote" href="#quote">
        <LibraryIcon name="chat-square-text" />Get a Quote
      </a>
    </nav>
  );
}
