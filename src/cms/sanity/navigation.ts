import defaults from './defaults.json';

type Editor = { id: string; type: string; title: string };
export type StudioPage = typeof defaults.registry[number];
export type StudioNode = { id: string; title: string; editor?: Editor; children?: StudioNode[]; listType?: string; submissions?: boolean };
const editor = (item: Editor, title = item.title): StudioNode => ({ id: item.id, title, editor: item });
const page = (id: string, title: string): StudioNode => {
  const entry = defaults.registry.find(item => item.id === id);
  if (!entry) throw new Error(`Studio page not found: ${id}`);
  return { id, title, children: entry.items.map(item => editor(item)) };
};
const global = (id: string, title?: string) => {
  const item = defaults.globals.find(item => item.id === id);
  if (!item) throw new Error(`Studio singleton not found: ${id}`);
  return editor(item, title);
};
const folder = (id: string, title: string, children: StudioNode[]): StudioNode => ({ id, title, children });
const list = (type: string, title: string): StudioNode => ({ id: type, title, listType: type });
const vehicles = [
  { id: 'caravan', title: 'Caravans', upgrades: 'caravan-alterations-and-upgrades-in-christchurch' },
  { id: 'campervan', title: 'Campervans', upgrades: 'campervan-alteration-and-upgrades-in-christchurch' },
  { id: 'motorhome', title: 'Motorhomes', upgrades: 'motorhome-alteration-and-upgrades-in-christchurch' },
  { id: 'fifth-wheel', title: 'Fifth Wheels', upgrades: 'fifth-wheels-alteration-and-upgrades-in-christchurch' },
  { id: 'bus', title: 'Buses', upgrades: 'bus-alteration-and-upgrades-in-christchurch' },
];
// Navigation only: every leaf points to its original logical ID and schema type.
export const studioNavigation: StudioNode[] = [
  page('page.home', 'Home Page'),
  folder('services', 'Services', vehicles.map(vehicle => folder(vehicle.id, vehicle.title, [
    page(`page.${vehicle.id}-services-in-christchurch`, 'Services'),
    page(`page.${vehicle.id}-repairs-in-christchurch`, 'Repairs'),
    page(`page.${vehicle.id}-panel-and-paint-services-in-christchurch`, 'Panel & Paint'),
    page(`page.${vehicle.upgrades}`, 'Alterations & Upgrades'),
  ]))),
  page('page.about', 'About Us Page'), page('page.insurance', 'Insurance Page'),
  page('page.gallery', 'Gallery Page'), page('page.contact', 'Contact Page'), page('page.faqs', 'FAQs Page'),
  folder('blogs', 'Blogs', [page('page.blog', 'Listing Page Settings'), list('blogPost', 'Blog Posts'),
    list('blogCategory', 'Categories'), list('blogAuthor', 'Authors'), list('blogTag', 'Tags')]),
  folder('testimonials', 'Testimonials', [global('global.testimonials'), page('page.reviews', 'Reviews Page')]),
  folder('website-settings', 'Website Settings', [global('global.business'), global('global.branding'),
    global('global.header'), global('global.footer'), global('global.cta'), global('global.vehicleCatalog'), global('global.interface')]),
  folder('seo-sitemap', 'SEO & Sitemap', [global('global.seo', 'Global SEO Settings'), global('global.sitemap', 'Sitemap Settings')]),
  folder('forms', 'Forms & Submissions', [global('global.quoteForm', 'Quote Form Settings'),
    { id: 'form-submissions', title: 'Form Submissions', submissions: true }, page('page.quote-result', 'Quote Result / Success & Error Messages')]),
  folder('media-library', 'Media Library', defaults.globals.filter(item => item.type === 'globalImageLibrary').map(item => editor(item))),
  folder('legal-pages', 'Legal Pages', [page('page.privacy-policy', 'Privacy Policy'), page('page.terms-and-conditions', 'Terms & Conditions')]),
];

export function editorLocation(documentId: string): string[] | undefined {
  function find(nodes: StudioNode[], parents: string[]): string[] | undefined {
    for (const node of nodes) {
      const path = [...parents, node.title];
      if (node.editor?.id === documentId) return path;
      const found = node.children && find(node.children, path);
      if (found) return found;
    }
  }
  return find(studioNavigation, []);
}
