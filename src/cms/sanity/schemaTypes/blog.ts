import { defineType, defineField, type SchemaTypeDefinition } from 'sanity';
import { seededType } from '../infer';
import { internalLink, relatedLinks, relatedLinksTitle } from '../link-fields';
const field = defineField;
const link = { name: 'link', type: 'object' as const, fields: [
  field({ name: 'href', type: 'string', validation: rule => rule.required().custom(value => !value || /^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(value) || 'Use a safe URL.') }),
] };
const seoFields = [
  field({ name: 'title', title: 'Meta title', type: 'string' }),
  field({ name: 'description', title: 'Meta description', type: 'text' }),
  field({ name: 'ogImage', type: 'accessibleImage' }),
  field({ name: 'canonical', type: 'url' }), field({ name: 'noindex', type: 'boolean', initialValue: false }),
];
const customBodyTypes = [
  defineType({ name: 'blogVideo', title: 'Video', type: 'object', fields: [
    field({ name: 'title', type: 'string', validation: rule => rule.required() }),
    field({ name: 'url', type: 'url', validation: rule => rule.required().custom(value => !value || /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(value) || 'Use a YouTube or Vimeo HTTPS URL.') }),
    field({ name: 'poster', type: 'accessibleImage' }),
  ], preview: { select: { title: 'title', subtitle: 'url' } } }),
  defineType({ name: 'blogTable', title: 'Table', type: 'object', fields: [
    field({ name: 'caption', type: 'string' }), field({ name: 'headers', type: 'array', of: [{ type: 'string' }] }),
    field({ name: 'rows', type: 'array', of: [{ type: 'object', fields: [field({ name: 'cells', type: 'array', of: [{ type: 'string' }] })], preview: { select: { title: 'cells.0' } } }] }),
  ], preview: { select: { title: 'caption' }, prepare: value => ({ title: value.title || 'Table' }) } }),
  defineType({ name: 'blogCallout', title: 'Callout', type: 'object', fields: [
    field({ name: 'title', type: 'string' }), field({ name: 'tone', type: 'string', options: { list: ['info', 'tip', 'warning'] }, initialValue: 'info' }),
    field({ name: 'body', type: 'array', of: [{ type: 'block', marks: { annotations: [link, internalLink] } }] }),
  ], preview: { select: { title: 'title', subtitle: 'tone' } } }),
  defineType({ name: 'blogDivider', title: 'Divider', type: 'object', fields: [field({ name: 'label', type: 'string', hidden: true })], preview: { prepare: () => ({ title: 'Divider' }) } }),
  defineType({ name: 'blogCode', title: 'Code', type: 'object', fields: [
    field({ name: 'filename', type: 'string' }), field({ name: 'language', type: 'string' }),
    field({ name: 'code', type: 'text', validation: rule => rule.required() }),
  ], preview: { select: { title: 'filename', subtitle: 'language' }, prepare: value => ({ title: value.title || 'Code', subtitle: value.subtitle }) } }),
  defineType({ name: 'blogBody', title: 'Article body', type: 'array', of: [
    { type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading 2', value: 'h2' }, { title: 'Heading 3', value: 'h3' }, { title: 'Heading 4', value: 'h4' }, { title: 'Quote', value: 'blockquote' }],
      lists: [{ title: 'Bullet list', value: 'bullet' }, { title: 'Numbered list', value: 'number' }], marks: { decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }, { title: 'Code', value: 'code' }], annotations: [link, internalLink] } },
    { type: 'accessibleImage' }, { type: 'blogVideo' }, { type: 'blogTable' }, { type: 'blogCallout' }, { type: 'blogDivider' }, { type: 'blogCode' },
  ] }),
];
const taxonomy = (name: string, title: string) => defineType({ name, title, type: 'document', fields: [
  field({ name: 'title', type: 'string', validation: rule => rule.required() }), field({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: rule => rule.required() }),
], preview: { select: { title: 'title', subtitle: 'slug.current' } } });
export const blogTypes: SchemaTypeDefinition[] = [
  ...customBodyTypes, taxonomy('blogCategory', 'Blog Category'), taxonomy('blogTag', 'Blog Tag'),
  defineType({ name: 'blogAuthor', title: 'Blog Author', type: 'document', fields: [
    field({ name: 'name', type: 'string', validation: rule => rule.required() }), field({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    field({ name: 'socialLinks', type: 'array', of: [{ type: 'navigationLink' }] }),
    field({ name: 'photo', type: 'accessibleImage' }), field({ name: 'role', type: 'string' }), field({ name: 'bio', type: 'array', of: [{ type: 'block', marks: { annotations: [
      { name: 'link', type: 'object', fields: [field({ name: 'href', type: 'url' })] }, internalLink,
    ] } }] }),
  ], preview: { select: { title: 'name', media: 'photo' } } }),
  defineType({ name: 'blogPost', title: 'Blog Post', type: 'document', fields: [
    field({ name: 'title', type: 'string', validation: rule => rule.required() }),
    field({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: rule => rule.required() }),
    field({ name: 'publishedAt', type: 'datetime', validation: rule => rule.required() }),
    field({ name: 'category', type: 'reference', to: [{ type: 'blogCategory' }], validation: rule => rule.required() }),
    field({ name: 'excerpt', type: 'text', validation: rule => rule.required() }),
    field({ name: 'excerptRich', title: 'Formatted excerpt (optional)', type: 'array', of: [{ type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading 2', value: 'h2' }, { title: 'Heading 3', value: 'h3' }],
      lists: [{ title: 'Bullet list', value: 'bullet' }, { title: 'Numbered list', value: 'number' }],
      marks: { decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }], annotations: [link, internalLink] },
    }] }),
    relatedLinks,
    relatedLinksTitle,
    field({ name: 'featuredImage', type: 'accessibleImage', validation: rule => rule.required() }),
    field({ name: 'author', type: 'reference', to: [{ type: 'blogAuthor' }], validation: rule => rule.required() }),
    field({ name: 'body', type: 'blogBody', validation: rule => rule.required() }),
    field({ name: 'tags', type: 'array', of: [{ type: 'reference', to: [{ type: 'blogTag' }] }] }),
    field({ name: 'relatedPosts', type: 'array', of: [{ type: 'reference', to: [{ type: 'blogPost' }] }] }),
    field({ name: 'featured', type: 'boolean', initialValue: false }),
    field({ name: 'seo', type: 'object', fields: seoFields }),
  ], orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] }],
    preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'featuredImage' } } }),
  ...['settings', 'banner', 'filters', 'featured', 'internalCta', 'sidebar', 'footerCta'].map(key => seededType('blog' + key[0].toUpperCase() + key.slice(1), key.replace(/([A-Z])/g, ' $1'))),
];
// References are real Studio reference fields; absent selections retain the source defaults.
for (const type of blogTypes) {
  if (type.name === 'blogFilters' || type.name === 'blogSidebar') {
    const fields = 'fields' in type ? type.fields : undefined;
    if (fields) for (const item of fields) {
      if (item.name === 'categories') Object.assign(item, { type: 'array', of: [{ type: 'reference', to: [{ type: 'blogCategory' }] }] });
      if (item.name === 'curatedPosts') Object.assign(item, { type: 'array', of: [{ type: 'reference', to: [{ type: 'blogPost' }] }] });
    }
  }
  if (type.name === 'blogFeatured' && 'fields' in type) {
    const item = type.fields?.find(item => item.name === 'posts');
    if (item) Object.assign(item, { type: 'array', of: [{ type: 'reference', to: [{ type: 'blogPost' }] }] });
  }
}

// Banner actions remain typed link objects even though the default list is empty.
const banner = blogTypes.find(type => type.name === 'blogBanner');
if (banner && 'fields' in banner) {
  const actions = banner.fields?.find(item => item.name === 'actions');
  if (actions) Object.assign(actions, { type: 'array', of: [{ type: 'object', fields: [
    { name: 'label', type: 'string' }, { name: 'href', type: 'string' },
  ], preview: { select: { title: 'label', subtitle: 'href' } } }] });
}
