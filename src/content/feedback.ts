import type { ContentPage } from './schema';

/** The homepage stores each review followed by its author. */
export function getCustomerReviews(page: ContentPage) {
  const blocks = page.sections.find(section => section.id === 'section-7')?.blocks ?? [];
  return blocks.slice(1).flatMap((block, index, reviews) => index % 2 === 0 && reviews[index + 1]
    ? [{ text: block.text, author: reviews[index + 1].text }]
    : []);
}
