import { defineType } from 'sanity';
import { seededType } from '../infer';
import { extendSectionFields } from './section-fields';
export const completionTypes = [
  seededType('contentIntroduction', 'Introduction'),
  seededType('faqTopicSection', 'FAQ Topic'),
  seededType('reviewGridSection', 'Reviews Grid'),
  defineType({ name: 'richInline', title: 'Formatted text', type: 'array', of: [{
    type: 'block', styles: [{ title: 'Text', value: 'normal' }], lists: [],
    marks: { decorators: [{ title: 'Strong', value: 'strong' }, { title: 'Emphasis', value: 'em' }, { title: 'Code', value: 'code' }],
      annotations: [{ name: 'link', type: 'object', fields: [{ name: 'href', type: 'string' }] }] },
  }] }),
];

extendSectionFields(completionTypes);
