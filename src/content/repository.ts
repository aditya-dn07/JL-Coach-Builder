import { getPublicContent } from '../lib/sanity/public-content';
import * as local from './local';
export { pages, allPages, galleryImages, imageManifest, siteSettings, quoteForm, legacySite } from './local';
export const contentRepository = {
  async getPages() { return (await getPublicContent()).pages; },
  async getPage(slug: string) { return (await getPublicContent()).pages.find(page => page.slug === slug); },
  async getCmsSettings() { const value = await getPublicContent(); return { site: value.siteSettings, quoteForm: value.quoteForm }; },
  // Legacy pure getters are retained for offline tooling. Active renderers use the request snapshot.
  getGalleryImages: () => local.galleryImages, getImageManifest: () => local.imageManifest,
  getSiteSettings: () => local.siteSettings, getQuoteForm: () => local.quoteForm, getLegacySite: () => local.legacySite,
};
