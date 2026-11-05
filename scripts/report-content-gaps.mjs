import fs from 'node:fs';
const pages = JSON.parse(fs.readFileSync('src/content/pages.json', 'utf8'));
const lines = [
  '# DOCX content gaps',
  '',
  'Source: JL CoachBuilder Content.docx. Missing introductions are omitted rather than invented. Existing source wording is retained, including the FAQ introductions noted below.',
  '',
  '## Unfinished or missing page copy',
  '',
  '- About: Customer Trust contains only the placeholder “Add Testimonials”. No About-specific testimonial copy is supplied; the placeholder is not displayed.',
  '- Gallery: the document contains only a gallery URL, with no page heading, subheading, description or image captions. Existing gallery content is retained.',
  '- Standalone Reviews and FAQs: no dedicated page introductions are supplied. Existing resource pages are retained.',
  '- Contact: “Existing Form” and “GMB Map” are implementation placeholders. The existing enquiry form and map are reused.',
  '',
  '## FAQ introductions referring to the wrong vehicle or service',
  '',
];
for (const page of pages.filter(page => page.kind === 'service')) {
  for (const section of page.sections.filter(section => /Common Questions/.test(section.title))) {
    const intro = section.blocks[0];
    if (intro?.type === 'paragraph' && /caravan servicing/.test(intro.text) && !/^caravan-services/.test(page.slug)) lines.push(`- /${page.slug}/ — ${intro.text}`);
  }
}
lines.push('', '## Sections without introductory descriptions', '', 'These sections start directly with cards, steps or questions in the DOCX. Their headings and supplied content remain visible without an invented description.', '');
for (const page of pages.filter(page => ['service', 'about'].includes(page.kind))) {
  const missing = page.sections.filter(section => section.blocks[0]?.type !== 'paragraph');
  if (missing.length) lines.push(`- /${page.slug}/ — ${missing.map(section => section.title).join('; ')}`);
}
lines.push('', '## Sections without subheadings', '');
const missingEyebrows = pages.filter(page => ['service', 'about'].includes(page.kind)).flatMap(page => page.sections.filter(section => !section.eyebrow).map(section => `- /${page.slug}/ — ${section.title}`));
lines.push(...(missingEyebrows.length ? missingEyebrows : ['All supplied service and About sections have subheadings. Legal numbered headings intentionally have no subheadings.']));
lines.push('', '## Service cards without descriptions', '', 'These supplied service lists use headings only. They are presented as compact cards, without invented supporting text.', '');
for (const page of pages.filter(page => page.kind === 'service')) {
  for (const section of page.sections) {
    const headingsOnly = section.blocks.filter((block, index) => block.type === 'heading' && (!section.blocks[index + 1] || section.blocks[index + 1].type === 'heading'));
    if (headingsOnly.length) lines.push(`- /${page.slug}/ — ${section.title}: ${headingsOnly.length} headings without descriptions.`);
  }
}
fs.writeFileSync('docs/docx-content-gaps.md', lines.join('\n') + '\n');
console.log('Wrote docs/docx-content-gaps.md');
