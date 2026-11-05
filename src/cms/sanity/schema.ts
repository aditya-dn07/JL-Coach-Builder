import { pageFields, pageKinds, imageIds } from '../model';
// Dependency-free definitions: register in sanity.config.ts using schema.types.
export const sanitySchemaTypes = [
  {
    name: 'contentImage', title: 'Content image', type: 'object', fields: [
      { name: 'src', type: 'string' }, { name: 'alt', type: 'string' },
      { name: 'width', type: 'number' }, { name: 'height', type: 'number' },
    ],
  },
  { name: 'keyValue', title: 'Label or setting', type: 'object', fields: [{ name: 'key', type: 'string' }, { name: 'value', type: 'string' }] },
  { name: 'namedImage', title: 'Named image', type: 'object', fields: [
    { name: 'key', type: 'string' }, { name: 'src', type: 'string' }, { name: 'alt', type: 'string' },
    { name: 'width', type: 'number' }, { name: 'height', type: 'number' },
  ] },
  {
    name: 'contentBlock',
    title: 'Content block',
    type: 'object',
    fields: [
      { name: 'type', type: 'string', options: { list: ['heading', 'paragraph'] } },
      { name: 'text', type: 'text', rows: 4 },
      { name: 'links', type: 'array', of: [{ type: 'navigationLink' }] },
    ],
  },
  {
    name: 'pageSection',
    title: 'Page section',
    type: 'object',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'eyebrow', title: 'Section subheading', type: 'string' },
      { name: 'description', type: 'text' },
      { name: 'descriptionLinks', type: 'array', of: [{ type: 'navigationLink' }] },
      { name: 'image', type: 'contentImage' },
      { name: 'cta', title: 'Quote button label', type: 'string' },
      { name: 'cardImages', type: 'array', of: [{ type: 'contentImage' }] },
      { name: 'cards', type: 'array', of: [{ type: 'object', fields: [{ name: 'title', type: 'string' }, { name: 'description', type: 'text' }] }] },
      { name: 'descriptionParagraphs', type: 'array', of: [{ type: 'contentBlock' }] },
      { name: 'leadIn', type: 'contentBlock' },
      { name: 'closingNote', type: 'contentBlock' },
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
      { name: 'answerLinks', type: 'array', of: [{ type: 'navigationLink' }] },
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
      { name: 'introLinks', type: 'array', of: [{ type: 'object', fields: [{ name: 'index', type: 'number' }, { name: 'links', type: 'array', of: [{ type: 'navigationLink' }] }] }] },
      { name: 'descriptionLinks', type: 'array', of: [{ type: 'navigationLink' }] },
      { name: 'relatedServices', type: 'array', of: [{ type: 'navigationLink' }] },
      { name: 'heroImage', type: 'contentImage' },
      { name: 'closingImage', type: 'contentImage' },
      { name: 'closingCta', type: 'object', fields: [
        { name: 'eyebrow', type: 'string' }, { name: 'title', type: 'string' }, { name: 'description', type: 'text' },
        { name: 'quoteLabel', type: 'string' }, { name: 'callLabel', type: 'string' },
      ] },
      { name: 'homeUi', type: 'array', of: [{ type: 'keyValue' }] },
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
  {
    name: 'siteSettings', title: 'Site settings', type: 'document', fields: [
      { name: 'url', type: 'url' },
      { name: 'seo', type: 'object', fields: [{ name: 'title', type: 'string' }, { name: 'description', type: 'text' }] },
      { name: 'business', type: 'object', fields: [
        { name: 'name', type: 'string' }, { name: 'tagline', type: 'string' }, { name: 'phone', type: 'string' },
        { name: 'email', type: 'string' }, { name: 'address', type: 'object', fields: [
          { name: 'street', type: 'string' }, { name: 'locality', type: 'string' }, { name: 'postcode', type: 'string' }, { name: 'country', type: 'string' },
        ] }, { name: 'geo', type: 'object', fields: [{ name: 'latitude', type: 'number' }, { name: 'longitude', type: 'number' }] },
        { name: 'openingHours', type: 'array', of: [{ type: 'string' }] },
        { name: 'foundedYear', type: 'number' }, { name: 'sameAs', type: 'array', of: [{ type: 'url' }] },
        { name: 'googleRating', type: 'object', fields: [{ name: 'value', type: 'number' }, { name: 'reviewCount', type: 'number' }, { name: 'reviewClaim', type: 'string' }] },
      ] },
      { name: 'ui', type: 'array', of: [{ type: 'keyValue' }] },
      { name: 'images', type: 'array', of: [{ type: 'namedImage' }] },
      { name: 'navigation', type: 'object', fields: [
        { name: 'main', type: 'array', of: [{ type: 'navigationLink' }] },
        { name: 'footerExtra', type: 'array', of: [{ type: 'navigationLink' }] },
      ] },
      { name: 'language', type: 'string' }, { name: 'locale', type: 'string' },
      { name: 'vehicleTypes', type: 'array', of: [{ type: 'string' }] }, { name: 'themeColor', type: 'string' },
    ],
  },
  { name: 'navigationLink', title: 'Navigation link', type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] },
  { name: 'quoteFormContent', title: 'Quote form content', type: 'document', fields: [
    { name: 'title', type: 'string' },
    { name: 'ui', type: 'array', of: [{ type: 'keyValue' }] },
    { name: 'form', type: 'object', fields: [
      { name: 'labels', type: 'array', of: [{ type: 'keyValue' }] },
      { name: 'messages', type: 'array', of: [{ type: 'keyValue' }] },
    ] },
  ] },
];
