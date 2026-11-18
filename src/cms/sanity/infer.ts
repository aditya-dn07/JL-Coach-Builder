import type { SchemaTypeDefinition, StringRule } from 'sanity';
import defaults from './defaults.json';
import { getSingletonDefaults, getSingletonTitle } from './seed-values';
import { SingletonInput } from './components/singleton-input';
import { LocalImageInput } from './components/local-image-input';
type Shape = Record<string, unknown>;
const ignored = new Set(['_type', '_id', '_key', '_rev', '_createdAt', '_updatedAt', '@type']);
const title = (name: string) => name.replace(/([A-Z])/g, ' $1').replace(/^./, text => text.toUpperCase());
export function fieldsFrom(values: Shape[]): Record<string, unknown>[] {
  const keys = [...new Set(values.flatMap(value => Object.keys(value)))].filter(key => !ignored.has(key));
  return keys.map(name => {
    const samples = values.map(value => value[name]).filter(value => value !== null && value !== undefined);
    const sample = samples[0];
    let field: Record<string, unknown> = { name: name.replace(/[^a-zA-Z0-9_]/g, '_'), title: title(name), type: 'string' };
    if (name === 'alt') field = { ...field, title: 'Alt text', description: 'Describe the image for people who cannot see it. Leave empty only for decorative images.' };
    if (typeof sample === 'number' || !samples.length && /count|latitude|longitude/i.test(name)) field.type = 'number';
    else if (typeof sample === 'boolean') field.type = 'boolean';
    else if (Array.isArray(sample)) {
      const items = samples.flatMap(value => value as unknown[]);
      const objects = items.filter(value => value && typeof value === 'object') as Shape[];
      const linkItems = ['links','descriptionLinks','answerLinks','relatedServices'].includes(name);
      const imageItems = objects.length > 0 && objects.every(item => 'alt' in item && ('src' in item || 'optimizedSrc' in item));
      field = { ...field, type: 'array', of: linkItems ? [{ type: 'navigationLink' }] : imageItems ? [{ type: 'accessibleImage' }] : objects.length
        ? [{ type: 'object', name: name.replace(/[^a-zA-Z0-9_]/g, '_') + 'Item', fields: fieldsFrom(objects), preview: { select: { title: objects.some(o => 'title' in o) ? 'title' : objects.some(o => 'question' in o) ? 'question' : objects.some(o => 'label' in o) ? 'label' : objects.some(o => 'author' in o) ? 'author' : objects.some(o => 'text' in o) ? 'text' : objects.some(o => 'id' in o) ? 'id' : objects.some(o => 'validFrom' in o) ? 'validFrom' : objects.some(o => 'opens' in o) ? 'opens' : 'alt' } } }]
        : [{ type: 'string' }] };
    } else if (sample && typeof sample === 'object') {
      const image = 'alt' in sample && ('src' in sample || 'optimizedSrc' in sample);
      field = image ? { ...field, type: 'image', options: { hotspot: true }, components: { input: LocalImageInput }, fields: [
        { name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the image for people who cannot see it. Leave empty only for decorative images.', validation: altValidation },
        { name: 'decorative', type: 'boolean', initialValue: false },
        { name: 'caption', type: 'text' }, { name: 'credit', type: 'string' },
        ...fieldsFrom(samples as Shape[]).filter(field => field.name !== 'alt').map(field => ({ ...field, hidden: true, readOnly: true })),
      ] } : { ...field, type: 'object', fields: fieldsFrom(samples as Shape[]) };
    }
    else if (/description|answer|message|text|paragraph|caption|intro/i.test(name)) field.type = 'text';
    if (name === 'href') field.validation = (rule: StringRule) => rule.custom(value => !value || /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(value) || 'Use a safe link URL.');
    if (name === 'type' && samples.every(value => value === 'heading' || value === 'paragraph')) field.options = { list: ['heading', 'paragraph'] };
    return field;
  });
}
export function seededType(name: string, titleText: string): SchemaTypeDefinition {
  const records = Object.values(defaults.seeds).filter(record => record._type === name);
  return {
    name, title: titleText, type: 'document', components: { input: SingletonInput },
    __experimental_formPreviewTitle: false,
    fields: fieldsFrom(records).map(field => ({
      ...field,
      readOnly: field.name === 'id' || field.name === 'form' || field.name === 'sourcePageId',
      hidden: ({ document }: { document?: { _id?: string } }) => {
        const id = document?._id?.replace(/^drafts\./, '') ?? '';
        const seed = (defaults.seeds as Record<string, Shape>)[id];
        if (!seed) return false;
        const key = Object.keys(seed).find(key => key.replace(/[^a-zA-Z0-9_]/g, '_') === field.name);
        if (!key) return true;
        if (key === 'cta') return true;
        if (['description','descriptionLinks','descriptionRichText'].includes(key) && Array.isArray(seed.descriptionParagraphs) && seed.descriptionParagraphs.length > 0) return true;
        if (key === 'blocks' && (Array.isArray(seed.serviceCards) || Array.isArray(seed.metrics) || Array.isArray(seed.items) || Array.isArray(seed.reviewIds) || Array.isArray(seed.capabilities) || Array.isArray(seed.bodyBlocks))) return true;
        if (key === 'blocks' && (Array.isArray(seed.faqs) && seed.faqs.length > 0 || Array.isArray(seed.blocks) && seed.blocks.length === 0)) return true;
        return false;
      },
    })),
    initialValue: (params: { documentId?: string } | undefined) => getSingletonDefaults(params?.documentId ?? ''),
    preview: { select: { id: '_id' }, prepare: ({ id }: { id?: string }) => ({ title: getSingletonTitle(id ?? '') || titleText }) },
  } as SchemaTypeDefinition;
}
export const altValidation = (rule: StringRule) => rule.custom((value: unknown, context) =>
  (context.parent as { decorative?: boolean } | undefined)?.decorative || typeof value === 'string' && value.trim()
    ? true : 'Add alt text, or mark this image as decorative.');
