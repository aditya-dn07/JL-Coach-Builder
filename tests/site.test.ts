import { test } from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../src/data/site.data';
import { SiteSchema } from '../src/data/site.schema';
import { generateJsonLd, serializeJsonLd } from '../src/lib/jsonld';
import { QuoteSchema } from '../src/lib/quote';
import { readFileSync } from 'node:fs';

test('restored homepage paragraphs and testimonials match the captured live source', () => {
  const inventory = JSON.parse(readFileSync('docs/source-inventory.json', 'utf8')) as {
    elements: { tag: string; text: string }[];
  };
  const sourceParagraphs = new Set(
    inventory.elements.filter((x) => x.tag === 'p').map((x) => x.text)
  );
  assert.equal(site.whatWeDo.paragraphs.length, 5);
  for (const paragraph of [
    ...site.whatWeDo.paragraphs,
    ...site.services.map((x) => x.shortDescription),
    ...site.whyChooseUs.map((x) => x.body),
    ...site.reviews.map((x) => x.text),
  ])
    assert.ok(sourceParagraphs.has(paragraph), `Missing verbatim source paragraph: ${paragraph}`);
  assert.equal('process' in site, false);
  assert.deepEqual(
    site.stats.map((x) => x.value),
    [80, 4.9, 100, 2016]
  );
  const noVehicle = {
    name: 'Test Visitor',
    phone: '0271234567',
    email: 'test@example.com',
    message: 'Please assess a leaking window.',
    website: '',
  };
  assert.equal(QuoteSchema.safeParse(noVehicle).success, true);
});

test('all 20 original vehicle destinations exist and content rejects invalid ratings', () => {
  assert.equal(
    new Set(site.nav.flatMap((group) => group.children.map((link) => link.href))).size,
    20
  );
  assert.equal(site.reviews.length, 6);
  assert.equal(site.faqs.length, 4);
  assert.equal(
    SiteSchema.safeParse({
      ...site,
      business: { ...site.business, googleRating: { value: 7, reviewCount: null } },
    }).success,
    false
  );
});
test('structured data shares the visible address and exact FAQ content', () => {
  const graph = generateJsonLd(site)['@graph'];
  const entities = graph.filter((x) => 'address' in x);
  assert.equal(entities.length, 2);
  for (const entity of entities)
    assert.equal(entity.address?.streetAddress, site.business.address.street);
  const faq = graph.find((x) => x['@type'] === 'FAQPage');
  assert.deepEqual(
    faq?.mainEntity?.map((x) => x.acceptedAnswer.text),
    site.faqs.map((x) => x.answer)
  );
  assert.ok(
    !serializeJsonLd({ ...site, faqs: [{ question: '</script>', answer: 'Answer' }] }).includes(
      '</script>'
    )
  );
});
test('quote validation rejects bots, unknown vehicle types and invalid phone / email', () => {
  const good = {
    name: 'Test Visitor',
    phone: '027 123 4567',
    email: 'visitor@example.com',
    vehicle: 'Caravans',
    message: 'Please assess a leaking window.',
    website: '',
  };
  assert.equal(QuoteSchema.safeParse(good).success, true);
  for (const message of ['', '   ', undefined]) {
    const result = QuoteSchema.safeParse({ ...good, message });
    assert.equal(result.success, true);
    if (result.success) assert.equal(result.data.message, '');
  }
  for (const patch of [
    { website: 'spam.example' },
    { vehicle: 'Invalid' },
    { email: 'invalid' },
    { phone: '-------' },
    { message: 'short' },
  ])
    assert.equal(QuoteSchema.safeParse({ ...good, ...patch }).success, false);
});
