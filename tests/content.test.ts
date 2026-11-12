import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allPages, contentRepository, galleryImages, imageManifest } from '../src/content/repository';
import { ImageSchema, PageSchema } from '../src/content/schema';
import { getCustomerReviews } from '../src/content/feedback';
import { normalizeCmsSettings, readCmsSettings } from '../src/cms/adapters';
import { sanitySchemaTypes } from '../src/cms/sanity/schema';
import { payloadSiteSettingsGlobal, payloadQuoteFormGlobal } from '../src/cms/payload/collection';
import { site } from '../src/data/site.data';

test('all document pages and original service routes resolve locally', () => {
  assert.equal(allPages.length, 29);
  assert.equal(new Set(allPages.map((p) => p.slug)).size, 29);
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
test('homepage data preserves displayed labels and image URLs', () => {
  const home = allPages.find(page => page.kind === 'home')!;
  assert.deepEqual([home.heroImage?.src, home.heroImage?.alt, home.closingImage?.src, home.closingImage?.alt], [
    '/images/home-workshop-banner-supplied.png',
    'JL Coachbuilders workshop buildings and caravan yard in Christchurch',
    '/images/cta-caravan-lakeside.webp',
    '',
  ]);
  assert.deepEqual([home.homeUi?.quote, home.homeUi?.marquee, home.homeUi?.reviewIntro, home.homeUi?.ready], [
    'Get a free quote',
    'Repairs · Upgrades · Servicing · Panel & Paint · Self Containment',
    'Our customers trust JL Coachbuilders for quality workmanship, honest advice and reliable service. Read what they say about their experience with our team.',
    'Ready to Book?',
  ]);
});
test('homepage markup retains image rendering and source-backed text bindings', () => {
  const hero = readFileSync('src/components/home/banner.tsx', 'utf8');
  const closing = readFileSync('src/components/home/closing-section.tsx', 'utf8');
  assert.match(hero, /src=\{page\.heroImage!\.src\}/);
  assert.match(hero, /alt=\{page\.heroImage!\.alt\}/);
  assert.match(hero, /\bunoptimized\b/);
  assert.match(hero, /\bpriority\b/);
  assert.match(hero, /sizes="100vw"/);
  assert.match(hero, /object-cover object-right/);
  assert.match(hero, /getHomeUi\(page, 'quote'\)/);
  assert.match(closing, /src=\{page\.closingImage!\.src\}/);
  assert.match(closing, /getHomeUi\(page, 'ready'\)/);
  const services = readFileSync('src/components/home/services-section.tsx', 'utf8');
  assert.match(services, /getHomeUi\(page, 'serviceHelpTitle'\)/);
  assert.match(services, /getHomeSection\(page, 6\)\.blocks\[0\]\.text/);
  assert.match(services, /href=\{phoneHref\}/);
  assert.match(services, /<QuoteLink \/>/);
});
test('principal quote CTA labels remain consistent across content', () => {
  for (const page of allPages) {
    if (page.closingCta) assert.equal(page.closingCta.quoteLabel, 'Get a free quote');
    for (const section of page.sections) {
      if (section.cta && !section.cta.startsWith('Call ')) assert.equal(section.cta, 'Get a free quote');
    }
  }
  assert.equal(contentRepository.getSiteSettings().ui.headerTalk, 'Let’s talk');
  assert.equal(contentRepository.getQuoteForm().form.labels.submit, 'Get a free quote');
});

test('homepage testimonials pair each DOCX quote with its author', () => {
  const reviews = getCustomerReviews(allPages.find(page => page.kind === 'home')!);
  assert.equal(reviews.length, 4);
  assert.deepEqual(reviews.map(review => review.author), [
    'Matt Fitzsimmons, Christchurch',
    'Cheryl Glen, Christchurch',
    'Richard Burridge, Christchurch',
    'Ange Abel, Christchurch',
  ]);
  assert.match(reviews[0].text, /Great place and staff/);
  assert.match(reviews[1].text, /leaking window/);
  assert.match(reviews[2].text, /quotes for insurance/);
  assert.match(reviews[3].text, /leaky caravan/);
});
test('repository validates gallery, manifest and shared image records', () => {
  assert.equal(contentRepository.getGalleryImages(), galleryImages);
  assert.equal(contentRepository.getImageManifest(), imageManifest);
  assert.equal(galleryImages.length, 126);
  for (const image of [...galleryImages, ...Object.values(imageManifest)]) assert.ok(ImageSchema.safeParse(image).success);
  assert.equal(ImageSchema.safeParse({ src: '/bad.webp', alt: 'Bad', width: 0, height: 100 }).success, false);
});
test('CMS settings normalize and reject malformed navigation and images', () => {
  const site = JSON.parse(readFileSync('src/config/site.json', 'utf8'));
  const quote = JSON.parse(readFileSync('src/content/quote-form.json', 'utf8'));
  assert.deepEqual(normalizeCmsSettings(site, quote).site.navigation, site.navigation);
  const sanityLike = { ...site, ui: Object.entries(site.ui).map(([key, value]) => ({ key, value })), images: Object.entries(site.images).map(([key, image]) => ({ key, ...(image as object) })) };
  assert.deepEqual(normalizeCmsSettings(sanityLike, quote).site.ui, site.ui);
  assert.throws(() => normalizeCmsSettings({ ...site, navigation: { ...site.navigation, main: [{ label: '', href: '/' }] } }, quote));
  assert.throws(() => normalizeCmsSettings({ ...site, images: { hero: { src: '/a.webp', alt: 'A', width: 0, height: 100 } } }, quote));
});
test('Sanity and Payload settings adapters validate mocked responses', async () => {
  const site = JSON.parse(readFileSync('src/config/site.json', 'utf8'));
  const quote = JSON.parse(readFileSync('src/content/quote-form.json', 'utf8'));
  const originalFetch = globalThis.fetch;
  const oldProject = process.env.SANITY_PROJECT_ID;
  const oldPayload = process.env.PAYLOAD_API_URL;
  const oldSource = process.env.CONTENT_SOURCE;
  try {
    process.env.SANITY_PROJECT_ID = 'mock-project';
    globalThis.fetch = async () => Response.json({ result: { site, quoteForm: quote } });
    assert.deepEqual((await readCmsSettings('sanity')).site.navigation, site.navigation);
    process.env.CONTENT_SOURCE = 'sanity';
    assert.deepEqual((await contentRepository.getCmsSettings()).site.ui, site.ui);
    process.env.PAYLOAD_API_URL = 'https://cms.example.test/api';
    const urls: string[] = [];
    globalThis.fetch = async (input) => { const url = String(input); urls.push(url); return Response.json(url.includes('site-settings') ? site : quote); };
    assert.deepEqual((await readCmsSettings('payload')).quoteForm.form.labels, quote.form.labels);
    process.env.CONTENT_SOURCE = 'payload';
    assert.deepEqual((await contentRepository.getCmsSettings()).quoteForm.ui, quote.ui);
    assert.ok(urls.some(url => url.endsWith('/globals/site-settings')));
    assert.ok(urls.some(url => url.endsWith('/globals/quote-form-content')));
  } finally {
    globalThis.fetch = originalFetch;
    if (oldProject === undefined) delete process.env.SANITY_PROJECT_ID; else process.env.SANITY_PROJECT_ID = oldProject;
    if (oldPayload === undefined) delete process.env.PAYLOAD_API_URL; else process.env.PAYLOAD_API_URL = oldPayload;
    if (oldSource === undefined) delete process.env.CONTENT_SOURCE; else process.env.CONTENT_SOURCE = oldSource;
  }
});
test('CMS authoring exposes settings, navigation and functional labels', () => {
  assert.ok(sanitySchemaTypes.some(type => type.name === 'siteSettings'));
  assert.ok(sanitySchemaTypes.some(type => type.name === 'quoteFormContent'));
  assert.deepEqual([payloadSiteSettingsGlobal.slug, payloadQuoteFormGlobal.slug], ['site-settings', 'quote-form-content']);
  for (const name of ['url', 'seo', 'business', 'ui', 'images', 'navigation', 'language', 'locale', 'vehicleTypes', 'themeColor']) {
    assert.ok(payloadSiteSettingsGlobal.fields.some(field => field.name === name), name);
  }
});
test('document content and approved website additions retain their recorded sources', () => {
  const source = JSON.parse(
    readFileSync('docs/content-source.json', 'utf8').replace(/^\uFEFF/, '')
  ) as { text: string }[];
  const sourceText = source.map((r) => r.text.trim());
  const { additions } = JSON.parse(readFileSync('docs/content-additions.json', 'utf8')) as {
    additions: { page: string; section: string; field: string; heading?: string; text: string }[];
  };
  for (const page of allPages) {
    for (const faq of page.faqs) {
      assert.ok(faq.answer.length > 20, faq.question);
      assert.ok(sourceText.includes(faq.question));
    }
    for (const section of page.sections) {
      const recorded = additions.filter(entry => entry.page === page.slug && entry.section === section.id);
      assert.ok(sourceText.includes(section.title) || recorded.some(entry => entry.field === 'title' && entry.text === section.title), `${page.slug}: ${section.title}`);
      for (const [index, block] of section.blocks.entries()) {
        assert.ok(sourceText.includes(block.text) || recorded.some(entry => entry.field === 'blocks' && entry.text === block.text && entry.heading === section.blocks[index - 1]?.text), `${page.slug}: ${block.text}`);
      }
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
