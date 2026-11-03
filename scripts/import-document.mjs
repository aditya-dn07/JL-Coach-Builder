import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync('docs/content-source.json', 'utf8').replace(/^\uFEFF/, ''));
const legacy = JSON.parse(fs.readFileSync('src/data/legacy-content.json', 'utf8'));
const starts = [
  0,
  ...rows.flatMap((r, i) =>
    r.style === 'Heading1' &&
    !/^(Professional |Experienced Coachbuilders|Insurance Repairs for)/.test(r.text) &&
    i !== 1
      ? [i]
      : []
  ),
];
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '');
const pages = starts.map((start, index) => {
  const chunk = rows.slice(start, starts[index + 1] ?? rows.length);
  const titleRow = chunk.find((r) => r.style === 'Heading1');
  const label = titleRow.text;
  let slug = index === 0 ? '' : slugify(label);
  if (label.startsWith('Caravan and Motorhome Insurance')) slug = 'insurance';
  if (label === 'About JL Coachbuilders') slug = 'about';
  if (label === 'Contact JL Coachbuilders') slug = 'contact';
  const nav = legacy.nav
    .flatMap((g) => g.children)
    .find(
      (n) =>
        n.label.replace('Alteration and', 'Alterations and') ===
        label.replace(' in Christchurch', '')
    );
  if (index >= 1 && index <= 20)
    slug = new URL(legacy.nav.flatMap((g) => g.children)[index - 1].href).pathname.replaceAll(
      '/',
      ''
    );
  else if (nav) slug = new URL(nav.href).pathname.replaceAll('/', '');
  const vehicle =
    ['campervan', 'motorhome', 'fifth-wheel', 'bus', 'caravan'].find((v) => slug.startsWith(v)) ??
    'workshop';
  const heroIndex = chunk.findIndex(
    (r, i) => i > chunk.indexOf(titleRow) && r.style === 'Heading1'
  );
  const heroRow = heroIndex >= 0 ? chunk[heroIndex] : titleRow;
  const heroPosition = chunk.indexOf(heroRow);
  const sectionStart = chunk.findIndex((r) => r.style === 'Heading2');
  let intro = chunk
    .slice(heroPosition + 1, sectionStart < 0 ? undefined : sectionStart)
    .filter(
      (r) =>
        !/^((Secondary )?CTA:|Existing Form|Quick Contact|GMB Map)/.test(r.text) &&
        !r.style &&
        r.text.length > 65
    )
    .map((r) => r.text);
  if (slug === 'contact')
    intro = chunk
      .filter((r) => !r.style && r.text.length > 90 && !/^(CTA|Secondary CTA)/.test(r.text))
      .map((r) => r.text);
  let sections = [];
  let section = { id: 'introduction', title: '', blocks: [] };
  for (const [i, r] of chunk.entries()) {
    if (i < (sectionStart < 0 ? chunk.length : sectionStart)) continue;
    if (r.style === 'Heading2') {
      if (section.title || section.blocks.length) sections.push(section);
      section = { id: `section-${sections.length + 1}`, title: r.text, blocks: [] };
      continue;
    }
    if (
      /^((Secondary )?CTA:|Meta Title:|Meta Description:|https?:|Existing Form|GMB Map)/.test(
        r.text
      )
    )
      continue;
    if (['Add Testimonials', 'SEO Metadata'].includes(section.title)) continue;
    if (!r.style && r.text.length < 65 && chunk[i + 1]?.style === 'Heading2') continue;
    section.blocks.push({
      type: r.style === 'Heading3' ? 'heading' : 'paragraph',
      text: r.text.trim(),
    });
  }
  if (section.title || section.blocks.length) sections.push(section);
  sections = sections.filter((s) => !['Add Testimonials', 'SEO Metadata'].includes(s.title));
  const faqs = sections
    .filter((s) => /Common Questions/.test(s.title))
    .flatMap((s) =>
      s.blocks.flatMap((b, i) =>
        b.type === 'heading'
          ? [
              {
                question: b.text,
                answer: s.blocks
                  .slice(
                    i + 1,
                    s.blocks.findIndex((n, j) => j > i && n.type === 'heading') < 0
                      ? undefined
                      : s.blocks.findIndex((n, j) => j > i && n.type === 'heading')
                  )
                  .map((n) => n.text)
                  .join(' '),
              },
            ]
          : []
      )
    );
  return {
    id: slug || 'home',
    slug,
    label,
    title: heroRow.text,
    eyebrow: index === 0 ? chunk[0].text : (chunk[heroPosition - 1]?.text ?? label),
    description: intro[0] ?? label,
    intro,
    kind:
      slug === 'contact'
        ? 'contact'
        : /privacy|terms/.test(slug)
          ? 'legal'
          : slug === 'about'
            ? 'about'
            : index === 0
              ? 'home'
              : 'service',
    image: vehicle,
    updatedAt: chunk.find((r) => r.text.startsWith('Last updated:'))?.text,
    seo: { title: `${label} | JL Coachbuilders`, description: (intro[0] ?? label).slice(0, 160) },
    sections,
    faqs,
  };
});
fs.mkdirSync('src/content', { recursive: true });
fs.writeFileSync('src/content/pages.json', JSON.stringify(pages, null, 2) + '\n');
fs.writeFileSync(
  'docs/page-inventory.md',
  '# Document page inventory\n\n' +
    pages
      .map((p) => `- /${p.slug}${p.slug ? '/' : ''} — ${p.label} (${p.sections.length} sections)`)
      .join('\n') +
    '\n'
);
console.log(
  pages.map((p) => ({
    slug: p.slug,
    title: p.title,
    sections: p.sections.length,
    faqs: p.faqs.length,
  }))
);
