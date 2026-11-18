import { SITE_TIMEZONE } from './date';
export type QuoteEmailValues = { name: string; email: string; phone: string; message: string; vehicle?: string };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
export function quoteEmail(values: QuoteEmailValues) {
  const date = new Intl.DateTimeFormat('en-NZ', { timeZone: SITE_TIMEZONE, dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
  const fields = [['Name', values.name], ['Email', values.email], ['Phone', values.phone], ...(values.vehicle ? [['Vehicle', values.vehicle]] : []), ['Message', values.message], ['Submitted', date + ' (' + SITE_TIMEZONE + ')']];
  return {
    subject: 'New quote enquiry',
    text: fields.map(([label, value]) => label + ': ' + value).join('\n\n'),
    html: '<h1>New quote enquiry</h1>' + fields.map(([label, value]) => '<p><strong>' + escapeHtml(label) + ':</strong><br>' + escapeHtml(value).replace(/\n/g, '<br>') + '</p>').join(''),
  };
}
