import type { ContentPage } from '@/content/schema';

// Count the content actually rendered, without counting a repeated lead paragraph twice.
export function serviceCtaSections(sections: ContentPage['sections']): Set<string> {
  let words = 0;
  let blocks = 0;
  const result = new Set<string>();
  for (const section of sections) {
    const text = new Set([
      section.description ?? '',
      ...(section.descriptionParagraphs ?? []).map(block => block.text),
      ...section.blocks.map(block => block.text),
      ...(section.cards ?? []).flatMap(card => [card.title, card.description]),
      section.closingNote?.text ?? '',
    ]);
    words += [...text].join(' ').trim().split(/\s+/).filter(Boolean).length;
    blocks += section.blocks.length + (section.cards?.length ?? 0);
    if (words >= 250 || blocks >= 3) {
      result.add(section.id);
      words = 0;
      blocks = 0;
    }
  }
  return result;
}
