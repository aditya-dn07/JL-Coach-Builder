import { defineField } from 'sanity';

const targets = [{ type: 'pageSettings' }, { type: 'blogPost' }];
export const internalLink = defineField({
  name: 'internalLink', title: 'Internal page link', type: 'object',
  fields: [defineField({ name: 'reference', title: 'Page or article', type: 'reference', to: targets, options: { disableNew: true }, validation: rule => rule.required() })],
});
export const relatedLinks = defineField({
  name: 'relatedLinks', title: 'Related pages (optional)', type: 'array',
  of: [{ type: 'reference', to: targets, options: { disableNew: true } }],
});
export const relatedLinksTitle = defineField({ name: 'relatedLinksTitle', title: 'Related pages heading (optional)', type: 'string', initialValue: 'Related pages' });
