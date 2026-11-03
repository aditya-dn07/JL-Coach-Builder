// Shared authoring fields. The API response maps directly to src/content/schema.ts.
export const pageFields = [
  ['id', 'Stable ID'],
  ['slug', 'URL slug (leave empty for home)'],
  ['label', 'Navigation label'],
  ['title', 'Page heading'],
  ['eyebrow', 'Eyebrow'],
  ['description', 'Hero description'],
  ['updatedAt', 'Policy update date'],
] as const;
export const pageKinds = ['home', 'service', 'about', 'contact', 'legal', 'gallery'] as const;
export const imageIds = [
  'workshop',
  'caravan',
  'campervan',
  'motorhome',
  'fifth-wheel',
  'bus',
] as const;
