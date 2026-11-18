import type * as local from './local';
import type defaults from '../cms/sanity/defaults.json';
export type ContentSnapshot = {
  pages: typeof local.pages;
  siteSettings: typeof local.siteSettings;
  quoteForm: typeof local.quoteForm;
  legacySite: typeof local.legacySite;
  galleryImages: typeof local.galleryImages;
  imageManifest: typeof local.imageManifest;
  testimonials: { id: string; text: string; author: string }[];
  editorial: {
    webManifest: typeof defaults.seeds['global.branding']['webManifest'];
    interface: typeof defaults.seeds['global.interface'];
    status: typeof defaults.seeds['global.quoteForm']['status'];
    statusSeo?: import('./schema').ContentPage['seo'];
    sitemap: typeof defaults.seeds['global.sitemap'];
  };
};
