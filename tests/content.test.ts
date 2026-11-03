import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allPages } from '../src/content/repository';
import { PageSchema } from '../src/content/schema';
import { site } from '../src/data/site.data';

test('all document pages and original service routes resolve locally', () => {
  assert.equal(allPages.length, 27);
  assert.equal(new Set(allPages.map((p) => p.slug)).size, 27);
  for (const link of site.nav.flatMap((g) => g.children)) {
    const slug = new URL(link.href).pathname.replaceAll('/', '');
    assert.ok(
      allPages.some((p) => p.slug === slug),
      link.href
    );
  }
  for (const slug of [
    '',
    'insurance',
    'about',
    'contact',
    'privacy-policy',
    'terms-and-conditions',
    'gallery',
  ])
    assert.ok(allPages.some((p) => p.slug === slug));
});
test('all FAQ answers and legal policy sections survive document migration', () => {
  const source = JSON.parse(
    readFileSync('docs/content-source.json', 'utf8').replace(/^\uFEFF/, '')
  ) as { text: string }[];
  const sourceText = source.map((r) => r.text.trim());
  for (const page of allPages) {
    for (const faq of page.faqs) {
      assert.ok(faq.answer.length > 20, faq.question);
      assert.ok(sourceText.includes(faq.question));
    }
    for (const section of page.sections) {
      assert.ok(sourceText.includes(section.title));
      for (const block of section.blocks) assert.ok(sourceText.includes(block.text));
    }
  }
  assert.equal(allPages.find((p) => p.slug === 'privacy-policy')?.sections.length, 10);
  assert.equal(allPages.find((p) => p.slug === 'terms-and-conditions')?.sections.length, 18);
});
test('CMS content validation rejects malformed routes, blank FAQ answers and unknown image IDs', () => {
  const page = allPages[1];
  for (const patch of [
    { slug: '../bad' },
    { image: 'unknown' },
    { faqs: [{ question: 'Question?', answer: '' }] },
  ])
    assert.equal(PageSchema.safeParse({ ...page, ...patch }).success, false);
});
