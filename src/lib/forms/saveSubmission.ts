import 'server-only';
import { getWriteClient } from '../../../sanity/lib/writeClient';
import { FORMS } from './config';
import { submittedDate } from './date';
export type SubmissionInput = {
  formType?: string; name?: unknown; email?: unknown; phone?: unknown; message?: unknown; sourcePage?: unknown;
  extraFields?: { label?: unknown; value?: unknown }[];
  [key: string]: unknown;
};
const trim = (value: unknown, length: number) => typeof value === 'string' ? value.trim().slice(0, length) : typeof value === 'number' || typeof value === 'boolean' ? String(value).slice(0, length) : '';
const excluded = new Set(['formType', 'name', 'email', 'phone', 'message', 'sourcePage', 'extraFields', 'website', 'honeypot', '_gotcha', 'idempotencyToken'].map(key => key.toLowerCase()));
function source(value: unknown): string {
  const text = trim(value, 2048);
  try { const url = new URL(text); return (url.origin + url.pathname).slice(0, 2048); }
  catch { return text.startsWith('/') && !text.startsWith('//') ? text.split(/[?#]/)[0].slice(0, 2048) : ''; }
}
export async function saveSubmission(input: SubmissionInput): Promise<void> {
  try {
    const client = getWriteClient(); if (!client) return;
    const formType = FORMS.find(form => form.id === input.formType)?.id ?? FORMS[0].id;
    const now = new Date();
    const extras = [
      ...(Array.isArray(input.extraFields) ? input.extraFields : []),
      ...Object.entries(input).filter(([key]) => !excluded.has(key.toLowerCase())).map(([label, value]) => ({ label, value })),
    ].filter(item => !excluded.has(trim(item.label, 100).toLowerCase())).slice(0, 50).map((item, index) => ({
      _key: 'extra-' + index, label: trim(item.label, 100), value: trim(item.value, 4000),
    })).filter(item => item.label);
    await client.create({
      _type: 'formSubmission', formType,
      name: trim(input.name, 200), email: trim(input.email, 320), phone: trim(input.phone, 100),
      message: trim(input.message, 10000), sourcePage: source(input.sourcePage),
      extraFields: extras, status: 'new', submittedAt: now.toISOString(), submittedDate: submittedDate(now),
    });
  } catch {
    // Do not log provider request objects, credentials, personal data or response bodies.
    console.error('[forms] save failed');
  }
}
