import type { SchemaTypeDefinition } from 'sanity';
import { fromSanityDocumentId } from './document-ids.mjs';
import { editorLocation } from './navigation';

type PresentationField = { name?: string; type?: string; group?: string; fields?: PresentationField[]; of?: PresentationField[]; options?: Record<string, unknown> };
// Presentation metadata only. Do not rename/move fields, alter hidden rules or validation.
export function organizeStudioTypes(types: SchemaTypeDefinition[], singletons: Set<string>) {
  const imageTypes = new Set(['image', 'accessibleImage', 'contentImage', 'namedImage']);
  function objects(fields: PresentationField[]) {
    for (const field of fields) {
      if (field.type === 'object' && field.fields && field.fields.length >= 4) {
        field.options = { ...field.options, collapsible: true, collapsed: true };
      }
      if (field.fields) objects(field.fields);
      for (const member of field.of ?? []) if (member.fields) objects(member.fields);
    }
  }
  for (const type of types) {
    if (type.type !== 'document' || !('fields' in type) || !type.fields) continue;
    // Submission read-only/status presentation is intentionally left unchanged.
    if (type.name === 'formSubmission') continue;
    const fields = type.fields as PresentationField[];
    for (const field of fields) {
      field.group = /Seo$/.test(type.name) || field.name === 'seo' ? 'seo'
        : imageTypes.has(field.type ?? '') || /images|photos|gallery|logo|poster|icon/i.test(field.name ?? '') || field.of?.some(member => imageTypes.has(member.type ?? '')) ? 'images'
        : ['id', 'slug', 'kind', 'form', 'sourcePageId', 'settings', 'publishedAt', 'category', 'author', 'tags', 'featured', 'noindex', 'canonical'].includes(field.name ?? '') ? 'settings' : 'content';
    }
    const available = new Set(fields.map(field => field.group));
    const groups = [['content', 'Content'], ['images', 'Images'], ['seo', 'SEO'], ['settings', 'Settings']].filter(([name]) => available.has(name));
    type.groups = groups.map(([name, title], index) => ({ name, title, default: index === 0 }));
    objects(fields);
    if (singletons.has(type.name)) type.preview = {
      select: { id: '_id' },
      prepare: ({ id }: { id?: string }) => {
        const location = editorLocation(fromSanityDocumentId(id ?? ''));
        return { title: location ? location.slice(-2).join(' — ') : type.title || type.name,
          subtitle: location?.slice(0, -1).join(' / ') };
      },
    };
  }
}
