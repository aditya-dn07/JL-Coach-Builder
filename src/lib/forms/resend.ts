import 'server-only';
import { Resend } from 'resend';
import { quoteEmail, type QuoteEmailValues } from './quote-email';
export const resendConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.RESEND_TO_EMAIL);
export async function sendQuoteEmail(values: QuoteEmailValues, key: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL?.split(',').map(value => value.trim()).filter(Boolean);
  if (!apiKey || !from || !to?.length) return false;
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({ from, to, replyTo: values.email, ...quoteEmail(values) }, { idempotencyKey: key });
    return !error && Boolean(data?.id);
  } catch { return false; }
}
