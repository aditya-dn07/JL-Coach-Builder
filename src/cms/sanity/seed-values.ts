import { keyed } from './seed-value-conversion.mjs';
import { fromSanityDocumentId } from './document-ids.mjs';
import defaults from './defaults.json';
const editorTitles = new Map<string, string>([
  ...defaults.globals.map(item => [item.id, item.title] as [string, string]),
  ...defaults.registry.flatMap(page => page.items.map(item =>
    [item.id, `${page.id === 'page.home' ? 'Home' : page.title} — ${item.title}`] as [string, string])),
]);
export function getSingletonTitle(documentId: string): string | undefined {
  return editorTitles.get(fromSanityDocumentId(documentId));
}
export function getSingletonDefaults(documentId: string): Record<string, unknown> {
  return keyed((defaults.seeds as Record<string, Record<string, unknown>>)[fromSanityDocumentId(documentId)] ?? {}) as Record<string, unknown>;
}
