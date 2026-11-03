import { pageFields, pageKinds, imageIds } from '../model';
// Dependency-free definitions: register in sanity.config.ts using schema.types.
export const sanitySchemaTypes = [
  {
    name: 'contentBlock',
    title: 'Content block',
    type: 'object',
    fields: [
      { name: 'type', type: 'string', options: { list: ['heading', 'paragraph'] } },
      { name: 'text', type: 'text', rows: 4 },
    ],
  },
  {
    name: 'pageSection',
    title: 'Page section',
    type: 'object',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'blocks', type: 'array', of: [{ type: 'contentBlock' }] },
    ],
  },
  {
    name: 'faq',
    title: 'FAQ',
    type: 'object',
    fields: [
      { name: 'question', type: 'string' },
      { name: 'answer', type: 'text', rows: 4 },
    ],
  },
  {
    name: 'page',
    title: 'Website page',
    type: 'document',
    fields: [
      ...pageFields.map(([name, title]) => ({
        name,
        title,
        type: name === 'description' ? 'text' : 'string',
      })),
      { name: 'kind', type: 'string', options: { list: [...pageKinds] } },
      {
        name: 'image',
        title: 'Legacy photo asset',
        type: 'string',
        options: { list: [...imageIds] },
      },
      { name: 'intro', type: 'array', of: [{ type: 'text' }] },
      {
        name: 'seo',
        title: 'SEO',
        type: 'object',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'description', type: 'text' },
        ],
      },
      { name: 'sections', type: 'array', of: [{ type: 'pageSection' }] },
      { name: 'faqs', type: 'array', of: [{ type: 'faq' }] },
    ],
    preview: { select: { title: 'label', subtitle: 'slug' } },
  },
];
