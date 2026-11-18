import type { StructureBuilder, StructureResolverContext } from 'sanity/structure';
import { map, startWith, switchMap } from 'rxjs';
import { FORMS } from '../../src/lib/forms/config';
import { SubmissionsWorkspaceLink } from './SubmissionsWorkspaceLink';
const apiVersion = '2024-01-01';
export function formSubmissionsStructure(S: StructureBuilder, context: StructureResolverContext) {
  const dataset = process.env.NEXT_PUBLIC_SANITY_SUBMISSIONS_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const root = S.listItem().id('form-submissions').title('Form Submissions');
  if (dataset !== context.dataset) return root.child(S.component().id('private-submissions').title('Form Submissions').component(SubmissionsWorkspaceLink));
  const client = context.getClient({ apiVersion }).withConfig({ perspective: 'published' });
  const dates = (formType: string) => {
    const query = '_type == "formSubmission" && formType == $formType && defined(submittedDate)';
    return client.observable.listen('*[' + query + ']', { formType }, { events: ['welcome', 'mutation'], includeResult: false }).pipe(
      startWith(null),
      switchMap(() => client.observable.fetch<{ submittedDate: string }[]>('*[' + query + ']{submittedDate}', { formType })),
      map(items => items.map(item => item.submittedDate).filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value))),
    );
  };
  return root.child(S.list().title('Form Submissions').items(FORMS.map(form =>
    S.listItem().id(form.id).title(form.title).child(() => dates(form.id).pipe(map(values => {
      const years = [...new Set(values.map(value => value.slice(0, 4)))].sort().reverse();
      return S.list().id('years-' + form.id).title(form.title).items(years.map(year => {
        const count = values.filter(value => value.startsWith(year + '-')).length;
        return S.listItem().id(form.id + '-' + year).title(year + ' (' + count + ')').child(() => dates(form.id).pipe(map(current => {
          const inYear = current.filter(value => value.startsWith(year + '-'));
          const months = [...new Set(inYear.map(value => value.slice(0, 7)))].sort().reverse();
          return S.list().id('months-' + form.id + '-' + year).title(year).items(months.map(month => {
            const monthName = new Intl.DateTimeFormat('en-NZ', { month: 'long', timeZone: 'UTC' }).format(new Date(month + '-15T12:00:00Z'));
            const monthCount = inYear.filter(value => value.startsWith(month)).length;
            return S.listItem().id(form.id + '-' + month).title(monthName + ' (' + monthCount + ')').child(
              S.documentList().id('entries-' + form.id + '-' + month).title(monthName + ' ' + year)
                .schemaType('formSubmission').apiVersion(apiVersion)
                .filter('_type == "formSubmission" && formType == $formType && submittedDate match $prefix')
                .params({ formType: form.id, prefix: month + '*' })
                .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
            );
          }));
        })));
      }));
    })))
  )));
}
