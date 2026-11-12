// Only an acknowledged delivery may call this; the callback receives no form data.
export function quoteConversionTracker(emit: (event: { event: 'generate_lead'; form: 'quote' }) => void) {
  const sent = new Set<string>();
  return (token: string) => {
    if (sent.has(token)) return;
    sent.add(token);
    emit({ event: 'generate_lead', form: 'quote' });
  };
}
