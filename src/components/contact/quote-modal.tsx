'use client';
import { useEffect, useRef } from 'react';
import { LibraryIcon } from '@/components/shared/library-icon';
import { QuoteForm } from '@/components/contact/quote-form';

export function QuoteModal() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    let previousOverflow: string | null = null;
    let opener: HTMLElement | null = null;
    const notify = (open: boolean) =>
      window.dispatchEvent(new CustomEvent('quote-visibility-change', { detail: open }));
    const open = (source?: HTMLElement) => {
      if (dialog.open) return;
      opener =
        source ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      dialog.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
      notify(true);
    };
    const close = () => {
      if (previousOverflow !== null) document.body.style.overflow = previousOverflow;
      previousOverflow = null;
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
          ? event.target.closest<HTMLAnchorElement>('a[href="#quote"]')
          : null;
      if (!link) return;
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
      if (previousOverflow !== null) document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      id="quote"
      ref={ref}
      className="quote-modal"
      aria-label="Request a free quote"
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close();
      }}
    >
      <div className="quote-modal-content">
        <button
          className="quote-modal-close"
          type="button"
          aria-label="Close quote form"
          onClick={() => ref.current?.close()}
        >
          <LibraryIcon name="x-lg" />
        </button>
        <QuoteForm />
      </div>
    </dialog>
  );
}
