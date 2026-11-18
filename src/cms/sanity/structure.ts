import type { StructureResolver, StructureBuilder } from 'sanity/structure';
import defaults from './defaults.json';
import { formSubmissionsStructure } from '../../../sanity/structure/formSubmissionsStructure';
const document = (S: StructureBuilder, item: { id: string; type: string; title: string }) =>
  S.listItem().id(item.id).title(item.title).child(S.document().title(item.title).schemaType(item.type).documentId(item.id).initialValueTemplate(item.type, { documentId: item.id }));
export const websiteStructure: StructureResolver = (S, context) => S.list().title('Website').items([
  ...defaults.globals.map(item => document(S, item)),
  ...defaults.registry.map(page => S.listItem().id(page.id).title(page.id === 'page.home' ? 'Home' : page.title).child(
    S.list().title(page.id === 'page.home' ? 'Home' : page.title).items(page.items.map(item => document(S, item)))
  )),
  ...['blogCategory', 'blogAuthor', 'blogTag'].map(type => S.listItem().title({ blogCategory: 'Blog Categories', blogAuthor: 'Blog Authors', blogTag: 'Blog Tags' }[type]!).child(S.documentTypeList(type))),
  S.listItem().title('Blog Posts').schemaType('blogPost').child(S.documentTypeList('blogPost').title('Blog Posts')),
  formSubmissionsStructure(S, context),
]);
