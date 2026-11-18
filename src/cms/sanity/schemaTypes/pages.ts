import { fromSanityDocumentId } from '../document-ids.mjs';
import { seededType } from '../infer';
import { extendSectionFields, scopeSectionControls, hideOverriddenDescriptions } from './section-fields';
export const pageTypes = [
  seededType('pageSettings', 'Page Settings'), seededType('pageSeo', 'SEO Settings'),
  seededType('pageBanner', 'Banner Section'), seededType('sectionSettings', 'Page Section'),
  seededType('faqSettings', 'FAQ Items'), seededType('gallerySettings', 'Project Photographs'),
  seededType('closingSettings', 'Closing CTA'), seededType('statusSettings', 'Quote Status'),
];

const seo = pageTypes.find(type => type.name === 'pageSeo');
if (seo && 'fields' in seo) seo.fields?.push({ name: 'ogImage', title: 'Open Graph Image', type: 'accessibleImage' });

const settings = pageTypes.find(type => type.name === 'pageSettings');
if (settings && 'fields' in settings) for (const field of settings.fields ?? []) {
  if (['id', 'slug', 'kind'].includes(field.name)) field.readOnly = true;
}

extendSectionFields(pageTypes);

scopeSectionControls(pageTypes);

if (seo && 'fields' in seo) {
  const noindex = seo.fields?.find(field => field.name === 'noindex');
  if (noindex) noindex.readOnly = ({ document }) => fromSanityDocumentId(document?._id ?? '') === 'page.quote-result.seo';
}

hideOverriddenDescriptions(pageTypes);

if (seo && 'fields' in seo) for (const field of seo.fields ?? []) {
  if (field.name === 'title') field.title = 'Meta title';
  if (field.name === 'description') field.title = 'Meta description';
  if (field.name === 'canonical') Object.assign(field, { type: 'url', title: 'Canonical URL' });
}

const status = pageTypes.find(type => type.name === 'statusSettings');
if (status && 'fields' in status) for (const field of status.fields ?? []) if (['seoTitle', 'seoDescription'].includes(field.name)) field.hidden = true;
