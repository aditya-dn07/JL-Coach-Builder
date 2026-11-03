import { pageFields, pageKinds, imageIds } from '../model';
// Import into your Payload project, then type against its installed CollectionConfig.
export const payloadPagesCollection = {
  slug: 'pages',
  admin: { useAsTitle: 'label' },
  versions: { drafts: true },
  fields: [
    ...pageFields.map(([name, label]) => ({
      name,
      label,
      type: name === 'description' ? 'textarea' : 'text',
      required: !['slug', 'eyebrow', 'updatedAt'].includes(name),
    })),
    { name: 'kind', type: 'select', required: true, options: [...pageKinds] },
    { name: 'image', type: 'select', required: true, options: [...imageIds] },
    { name: 'intro', type: 'json', defaultValue: [] },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'id', type: 'text', required: true },
        { name: 'title', type: 'text' },
        {
          name: 'blocks',
          type: 'array',
          fields: [
            { name: 'type', type: 'select', required: true, options: ['heading', 'paragraph'] },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
};
