import type { StructureResolver, StructureBuilder, StructureResolverContext, ListItemBuilder } from 'sanity/structure';
import { Home, Wrench, FileText, Settings, Search, Images, MessageSquare, BookOpen, Shield, Folder } from 'lucide-react';
import { toSanityDocumentId } from './document-ids.mjs';
import { studioNavigation, type StudioNode } from './navigation';
import { formSubmissionsStructure } from '../../../sanity/structure/formSubmissionsStructure';
const icons: Record<string, typeof Folder> = { 'page.home': Home, services: Wrench, blogs: BookOpen,
  testimonials: MessageSquare, 'website-settings': Settings, 'seo-sitemap': Search,
  forms: MessageSquare, 'media-library': Images, 'legal-pages': Shield };
function item(S: StructureBuilder, context: StructureResolverContext, node: StudioNode): ListItemBuilder {
  if (node.submissions) return formSubmissionsStructure(S, context);
  const result = S.listItem().id(node.id).title(node.title).icon(icons[node.id] ?? (node.editor || node.listType ? FileText : Folder));
  if (node.editor) return result.child(S.document().title(node.title).schemaType(node.editor.type)
    .documentId(toSanityDocumentId(node.editor.id)).initialValueTemplate(node.editor.type, { documentId: node.editor.id }));
  if (node.listType) return result.schemaType(node.listType).child(S.documentTypeList(node.listType).title(node.title));
  return result.child(S.list().id(node.id).title(node.title).items((node.children ?? []).map(child => item(S, context, child))));
}
export const websiteStructure: StructureResolver = (S, context) => S.list().title('Website')
  .items(studioNavigation.map(node => item(S, context, node)));
