import type { ContentPage } from './schema';

/** The homepage stores each review followed by its author. */
export function getCustomerReviews(page: ContentPage) {
  const blocks = page.sections.find(section => section.id === 'section-7')?.blocks ?? [];
  return blocks.flatMap((block, index) => index % 2 === 0 && blocks[index + 1]
    ? [{ text: block.text, author: blocks[index + 1].text }]
    : []);
}
