import { SiteSchema } from './site.schema';
import content from './legacy-content.json';
import config from '@/config/site.json';

// Business facts are centralized in config/site.json; document pages live in content/pages.json.
export const site = SiteSchema.parse({
  ...content,
  url: config.url,
  seo: config.seo,
  business: config.business,
});
