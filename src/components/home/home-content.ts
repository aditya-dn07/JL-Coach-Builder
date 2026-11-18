import { homeUiOwners } from '../../content/section-identity';
import type { ContentPage } from '@/content/schema';

export function getHomeSection(page: ContentPage, index: number) {
  const section = page.sections.find(section => section.id === `section-${index}`);
  if (!section) throw new Error(`Missing homepage section: ${index}`);
  return section;
}
export function getHomeUi(page: ContentPage, key: string) {
  const owner = page.sections.find(section => section.id === homeUiOwners[key]);
  const eyebrowKeys = ['trustEyebrow', 'workshop', 'problems', 'reviews', 'faqs', 'ready'];
  const value = eyebrowKeys.includes(key) && owner?.eyebrow ? owner.eyebrow : owner?.ui?.[key] ?? page.homeUi?.[key];
  if (value === undefined) throw new Error(`Missing homepage UI value: ${key}`);
  return value;
}
