import { defineType, defineField } from 'sanity';
import { FORMS } from '../../../lib/forms/config';
import { SITE_TIMEZONE } from '../../../lib/forms/date';
export const formSubmission = defineType({
  name: 'formSubmission', title: 'Form Submission', type: 'document',
  fields: [
    defineField({ name: 'formType', type: 'string', readOnly: true, options: { list: FORMS.map(form => ({ title: form.title, value: form.id })) } }),
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({ name: 'message', type: 'text', readOnly: true }),
    defineField({ name: 'sourcePage', type: 'string', readOnly: true }),
    defineField({ name: 'extraFields', type: 'array', readOnly: true, of: [{ type: 'object', fields: [
      defineField({ name: 'label', type: 'string', readOnly: true }), defineField({ name: 'value', type: 'text', readOnly: true }),
    ], preview: { select: { title: 'label', subtitle: 'value' } } }] }),
    defineField({ name: 'status', type: 'string', initialValue: 'new', options: { list: ['new', 'contacted', 'closed'], layout: 'radio' } }),
    defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
    defineField({ name: 'submittedDate', type: 'string', readOnly: true }),
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', email: 'email', status: 'status', submittedAt: 'submittedAt' },
    prepare({ title, email, status, submittedAt }) {
      const date = submittedAt ? new Date(submittedAt) : null;
      const formatted = date && !Number.isNaN(date.valueOf()) ? date.toLocaleString('en-NZ', { timeZone: SITE_TIMEZONE, dateStyle: 'medium', timeStyle: 'short' }) : '';
      return { title: title || 'Quote request', subtitle: `${formatted} | ${email || ''} | ${status || 'new'}` };
    },
  },
});
