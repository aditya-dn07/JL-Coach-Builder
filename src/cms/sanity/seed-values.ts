import defaults from './defaults.json';
const editorTitles = new Map<string, string>([
  ...defaults.globals.map(item => [item.id, item.title] as [string, string]),
  ...defaults.registry.flatMap(page => page.items.map(item =>
    [item.id, `${page.id === 'page.home' ? 'Home' : page.title} — ${item.title}`] as [string, string])),
]);
export function getSingletonTitle(documentId: string): string | undefined {
  return editorTitles.get(documentId.replace(/^drafts\./, ''));
}
function keyed(value: unknown, fieldName = ''): unknown {
  if (Array.isArray(value)) return value.map((item, index) => item && typeof item === 'object'
    ? { ...keyed(item) as Record<string, unknown>, _key: 'item-' + index, _type: ['links','descriptionLinks','answerLinks','relatedServices'].includes(fieldName) ? 'navigationLink' : 'alt' in item && ('src' in item || 'optimizedSrc' in item) ? 'accessibleImage' : fieldName + 'Item' } : item);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const result = Object.fromEntries(Object.entries(record).map(([key, item]) => [key.startsWith('_') ? key : key.replace(/[^a-zA-Z0-9_]/g, '_'), keyed(item, key.replace(/[^a-zA-Z0-9_]/g, '_'))]));
    if ('alt' in record && ('src' in record || 'optimizedSrc' in record)) {
      result._type = 'image'; result.decorative = !record.alt;
    }
    return result;
  }
  return value;
}
export function getSingletonDefaults(documentId: string): Record<string, unknown> {
  return keyed((defaults.seeds as Record<string, Record<string, unknown>>)[documentId.replace(/^drafts\./, '')] ?? {}) as Record<string, unknown>;
}
