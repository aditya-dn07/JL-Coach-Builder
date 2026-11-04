'use client';
import { useId, useState, type FormEvent } from 'react';
import content from '@/content/quote-form.json';
import Link from 'next/link';
import { siteConfig, phoneHref } from '@/config/site';
import { QuoteSchema } from '@/lib/quote';
import { Send } from 'lucide-react';

export function QuoteForm() {
  const titleId = useId();
  const { labels: l, messages: m } = content.form;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    if (!QuoteSchema.safeParse(payload).success) {
      setStatus('error');
      setFeedback(m.invalid);
      return;
    }
    setStatus('sending');
    setFeedback('');
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || m.error);
      setStatus('success');
      setFeedback(m.success);
      form.reset();
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : m.error);
    }
  }
  return (
    <form className="quote-card" onSubmit={submit} aria-labelledby={titleId}>
      <h2 id={titleId}>{content.title}</h2>
      <div className="form-grid">
        <label>
          {l.name}
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} />
        </label>
        <label>
          {l.phone}
          <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} />
        </label>
        <label>
          {l.email}
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label className="full">
          {l.message}
          <textarea name="message" rows={3} required minLength={10} maxLength={4000} />
        </label>
      </div>
      <label className="honeypot" aria-hidden="true">
        {l.website}
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" className="button primary" disabled={status === 'sending'}>
        <Send size={18} aria-hidden="true" />
        {status === 'sending' ? l.submitting : l.submit}
      </button>
      <p className="form-privacy">
        We use your details to respond to your enquiry.{' '}
        <Link href="/privacy-policy/">Privacy Policy</Link>
      </p>
      <p className="form-feedback" role={status === 'error' ? 'alert' : 'status'}>
        {feedback}
      </p>
      {status === 'error' && (
        <p className="form-contact-alternatives">
          <a href={phoneHref}>{siteConfig.business.phone}</a>
          <a href={`mailto:${siteConfig.business.email}`}>Email the workshop</a>
        </p>
      )}
    </form>
  );
}
