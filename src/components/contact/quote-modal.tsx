'use client';
import { useSiteContent } from '@/components/providers/site-content';
import { useEffect, useRef, useState } from 'react';
import { LibraryIcon } from '@/components/shared/library-icon';
import { QuoteForm } from '@/components/contact/quote-form';
import { lockBodyScroll } from '@/lib/body-scroll-lock';

export function QuoteModal() {
  const { contentRepository, siteConfig } = useSiteContent();
  const quoteTarget = siteConfig.ui.quoteTarget;
  const ref = useRef<HTMLDialogElement>(null);
  const [formSession, setFormSession] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    let releaseScroll: (() => void) | undefined;
    let opener: HTMLElement | null = null;
    const notify = (open: boolean) =>
      window.dispatchEvent(new CustomEvent('quote-visibility-change', { detail: open }));
    const open = (source?: HTMLElement) => {
      if (dialog.open) return;
      opener =
        source ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      dialog.showModal();
      releaseScroll = lockBodyScroll();
      dialog.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
      notify(true);
    };
    const close = () => {
      releaseScroll?.();
      releaseScroll = undefined;
      opener?.focus({ preventScroll: true });
      notify(false);
    };
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href]')
          : null;
      if (!link || link.getAttribute('href') !== quoteTarget) return;
      event.preventDefault();
      open(link);
    };
    document.addEventListener('click', click);
    dialog.addEventListener('close', close);
    if (window.location.hash === '#quote') open();
    return () => {
      document.removeEventListener('click', click);
      dialog.removeEventListener('close', close);
      if (dialog.open) dialog.close();
      releaseScroll?.();
    };
  }, [quoteTarget]);

  return (
    <dialog
      id="quote"
      ref={ref}
      className="quote-modal"
      aria-label={contentRepository.getQuoteForm().ui.modalTitle}
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close();
      }}
    >
      <div className="quote-modal-content">
        <button
          className="quote-modal-close"
          type="button"
          aria-label={contentRepository.getQuoteForm().ui.modalClose}
          onClick={() => ref.current?.close()}
        >
          <LibraryIcon name="x-lg" />
        </button>
        <QuoteForm key={formSession} onSuccess={() => { ref.current?.close(); setFormSession(session => session + 1); }} />
      </div>
    </dialog>
  );
}
