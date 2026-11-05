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
    { name: 'introLinks', type: 'array', fields: [{ name: 'index', type: 'number' }, { name: 'links', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] }] },
    { name: 'descriptionLinks', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
    { name: 'relatedServices', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
    { name: 'heroImage', type: 'group', fields: [{ name: 'src', type: 'text' }, { name: 'alt', type: 'text' }, { name: 'width', type: 'number' }, { name: 'height', type: 'number' }] },
    { name: 'closingImage', type: 'group', fields: [{ name: 'src', type: 'text' }, { name: 'alt', type: 'text' }, { name: 'width', type: 'number' }, { name: 'height', type: 'number' }] },
    { name: 'closingCta', type: 'group', fields: [
      { name: 'eyebrow', type: 'text' }, { name: 'title', type: 'text' }, { name: 'description', type: 'textarea' },
      { name: 'quoteLabel', type: 'text' }, { name: 'callLabel', type: 'text' },
    ] },
    { name: 'homeUi', type: 'json' },
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
        { name: 'eyebrow', label: 'Section subheading', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'descriptionLinks', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
        { name: 'image', type: 'group', fields: [{ name: 'src', type: 'text' }, { name: 'alt', type: 'text' }, { name: 'width', type: 'number' }, { name: 'height', type: 'number' }] },
        { name: 'cta', label: 'Quote button label', type: 'text' },
        { name: 'cardImages', type: 'array', fields: [{ name: 'src', type: 'text' }, { name: 'alt', type: 'text' }, { name: 'width', type: 'number' }, { name: 'height', type: 'number' }] },
        { name: 'cards', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }] },
        { name: 'descriptionParagraphs', type: 'array', fields: [{ name: 'type', type: 'select', options: ['heading', 'paragraph'] }, { name: 'text', type: 'textarea' }, { name: 'links', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] }] },
        ...['leadIn', 'closingNote'].map(name => ({ name, type: 'group', fields: [
          { name: 'type', type: 'select', options: ['heading', 'paragraph'] },
          { name: 'text', type: 'textarea' },
          { name: 'links', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
        ] })),
        {
          name: 'blocks',
          type: 'array',
          fields: [
            { name: 'type', type: 'select', required: true, options: ['heading', 'paragraph'] },
            { name: 'text', type: 'textarea', required: true },
            { name: 'links', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
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
        { name: 'answerLinks', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
      ],
    },
  ],
};
export const payloadSiteSettingsGlobal = {
  slug: 'site-settings',
  fields: [
    { name: 'url', type: 'text' },
    { name: 'seo', type: 'group', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }] },
    { name: 'business', type: 'json' },
    { name: 'ui', type: 'json' },
    { name: 'images', type: 'json' },
    { name: 'navigation', type: 'group', fields: [
      { name: 'main', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
      { name: 'footerExtra', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'href', type: 'text' }] },
    ] },
    { name: 'language', type: 'text' }, { name: 'locale', type: 'text' },
    { name: 'vehicleTypes', type: 'json' }, { name: 'themeColor', type: 'text' },
  ],
};
export const payloadQuoteFormGlobal = {
  slug: 'quote-form-content',
  fields: [
    { name: 'title', type: 'text' }, { name: 'ui', type: 'json' },
    { name: 'form', type: 'group', fields: [
      { name: 'labels', type: 'json' }, { name: 'messages', type: 'json' },
    ] },
  ],
};
