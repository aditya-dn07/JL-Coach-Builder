import type { ContentPage } from '@/content/schema';

export function getHomeSection(page: ContentPage, index: number) {
  const section = page.sections.find(section => section.id === `section-${index}`);
  if (!section) throw new Error(`Missing homepage section: ${index}`);
  return section;
}
export function getHomeUi(page: ContentPage, key: string) {
  const value = page.homeUi?.[key];
  if (value === undefined) throw new Error(`Missing homepage UI value: ${key}`);
  return value;
}
