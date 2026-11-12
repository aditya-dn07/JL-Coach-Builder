'use client';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { contentRepository } from '@/content/repository';
import Link from 'next/link';
import { siteConfig, phoneHref } from '@/config/site';
import { QuoteSchema } from '@/lib/quote';
import { Send } from 'lucide-react';
import { quoteConversionTracker } from '@/lib/quote-conversion';

const trackConversion = quoteConversionTracker(event => {
  const target = window as Window & { dataLayer?: object[] };
  target.dataLayer = target.dataLayer ?? [];
  target.dataLayer.push(event);
});

export function QuoteForm() {
  const content = contentRepository.getQuoteForm();
  const titleId = useId();
  const { labels: l, messages: m } = content.form;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const pending = useRef(false);
  const token = useRef('');
  const tokenInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    token.current = crypto.randomUUID();
    if (tokenInput.current) tokenInput.current.value = token.current;
  }, []);
  useEffect(() => { if (feedback) feedbackRef.current?.focus(); }, [feedback]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || status === 'success') return;
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    if (!QuoteSchema.safeParse(payload).success) {
      setStatus('error');
      setFeedback(m.invalid);
      return;
    }
    setStatus('sending');
    pending.current = true;
    setFeedback('');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error(data.error || m.error);
      setStatus('success');
      setFeedback(m.success);
      form.reset();
      trackConversion(token.current);
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : m.error);
    } finally {
      pending.current = false;
    }
  }
  return (
    <form className="quote-card" method="post" action="/api/quote" onSubmit={submit} aria-labelledby={titleId} aria-busy={status === 'sending'}>
      <input ref={tokenInput} type="hidden" name="idempotencyToken" defaultValue="" />
      <h2 id={titleId}>{content.title}</h2>
      <div className="form-grid">
        <label>
          <span>{l.name} <span className="text-brand" aria-hidden="true">*</span></span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          <span>{l.phone} <span className="text-brand" aria-hidden="true">*</span></span>
          <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} />
        </label>
        <label>
          <span>{l.email} <span className="text-brand" aria-hidden="true">*</span></span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label className="full">
          <span>{l.message}</span>
          <textarea name="message" rows={3} minLength={10} maxLength={4000} />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="button primary" disabled={status === 'sending' || status === 'success'}>
        <Send size={18} aria-hidden="true" />
        {status === 'sending' ? l.submitting : l.submit}
      </button>
      <p className="form-privacy">
        {content.ui.privacy}{' '}
        <Link href="/privacy-policy/" className="underline underline-offset-2">{content.ui.privacyLink}</Link>
      </p>
      <p ref={feedbackRef} tabIndex={-1} className="form-feedback" role={status === 'error' ? 'alert' : 'status'}>
        {feedback}
      </p>
      {status === 'error' && (
        <p className="form-contact-alternatives">
          <a href={phoneHref}>{siteConfig.business.phone}</a>
          <a href={`mailto:${siteConfig.business.email}`}>{content.ui.emailWorkshop}</a>
        </p>
      )}
    </form>
  );
}
