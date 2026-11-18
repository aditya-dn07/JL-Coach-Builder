import { defineConfig, type WorkspaceOptions } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes, singletonTypes } from './src/cms/sanity/schemaTypes';
import { formSubmission } from './src/cms/sanity/schemaTypes/form-submission';
import { websiteStructure } from './src/cms/sanity/structure';
import { formSubmissionsStructure } from './sanity/structure/formSubmissionsStructure';
import { getSingletonDefaults } from './src/cms/sanity/seed-values';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const submissionsDataset = process.env.NEXT_PUBLIC_SANITY_SUBMISSIONS_DATASET || dataset;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'unconfigured';
const website: WorkspaceOptions = {
  name: 'website', title: 'JL Coachbuilders', basePath: submissionsDataset === dataset ? '/studio' : '/studio/website',
  projectId, dataset, plugins: [structureTool({ structure: websiteStructure })], schema: {
    types: schemaTypes,
    templates: templates => templates.map(template => singletonTypes.has(template.schemaType)
      ? { ...template, parameters: [{ name: 'documentId', type: 'string' }], value: (params: { documentId?: string }) => getSingletonDefaults(params.documentId ?? '') }
      : template),
  },
  document: {
    newDocumentOptions: templates => templates.filter(template => !singletonTypes.has(template.templateId) && template.templateId !== 'formSubmission'),
    actions: (actions, context) => singletonTypes.has(context.schemaType)
      ? actions.filter(action => action.action !== 'delete' && action.action !== 'duplicate')
      : actions,
  },
};
export default defineConfig(submissionsDataset === dataset ? website : [website, {
  name: 'submissions', title: 'Private submissions', basePath: '/studio/submissions',
  projectId, dataset: submissionsDataset, schema: { types: [formSubmission] },
  plugins: [structureTool({ structure: (S, context) => S.list().title('Private submissions').items([formSubmissionsStructure(S, context)]) })],
  document: { newDocumentOptions: () => [] },
}]);
