import type { SchemaTypeDefinition } from 'sanity';
import { sanitySchemaTypes } from '../schema';
import { globalTypes, sharedImageLibraryTypes } from './globals';
import { pageTypes } from './pages';
import { blogTypes } from './blog';
import { objectTypes } from './objects';
import { formSubmission } from './form-submission';
import { completionTypes } from './completion';
import { organizeStudioTypes } from '../presentation';
// Keep the existing schema order intact; new definitions are appended.
export const schemaTypes = [...sanitySchemaTypes, ...globalTypes, ...pageTypes, ...objectTypes, ...blogTypes, formSubmission, ...completionTypes, ...sharedImageLibraryTypes] as SchemaTypeDefinition[];
export const singletonTypes = new Set([...completionTypes.filter(type => type.type === 'document').map(type => type.name), ...globalTypes.map(type => type.name), ...sharedImageLibraryTypes.map(type => type.name), ...pageTypes.map(type => type.name), ...blogTypes.filter(type => type.name.startsWith('blog') && !['blogPost', 'blogCategory', 'blogAuthor', 'blogTag'].includes(type.name)).map(type => type.name), 'page', 'siteSettings', 'quoteFormContent']);
organizeStudioTypes(schemaTypes, singletonTypes);
