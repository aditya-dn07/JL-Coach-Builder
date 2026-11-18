export const SITE_TIMEZONE = 'Pacific/Auckland';
export function submittedDate(value: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: SITE_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value);
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? '';
  return get('year') + '-' + get('month') + '-' + get('day');
}
