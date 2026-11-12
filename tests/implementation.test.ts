import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateJsonLd } from '../src/lib/jsonld';
import { site } from '../src/data/site.data';
import { siteConfig } from '../src/config/site';
import { pageMetadata } from '../src/lib/metadata';
import robots from '../src/app/robots';
import config from '../next.config';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { serviceCtaSections } from '../src/lib/service-ctas';
import type { ContentPage } from '../src/content/schema';
import { formatOpeningDate } from '../src/components/shared/opening-hours';
import { middleware } from '../src/middleware';
import { NextRequest } from 'next/server';

test('holiday calendar date stays 13 November in NZ daylight-saving season', () => {
  assert.equal(formatOpeningDate('2026-11-13'), '13 November 2026');
});

test('production aliases are noindex while the canonical production host is allowed', () => {
  const prior = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = 'production';
    assert.equal(middleware(new NextRequest('https://jl-coach-builder.vercel.app/')).headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.equal(middleware(new NextRequest('https://jlcoachbuilders.co.nz/')).headers.get('X-Robots-Tag'), null);
    process.env.VERCEL_ENV = 'preview';
    assert.equal(middleware(new NextRequest('https://jlcoachbuilders.co.nz/')).headers.get('X-Robots-Tag'), 'noindex, nofollow');
  } finally { if (prior === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prior; }
});

test('exact business node contains confirmed hours and no unapproved fields', () => {
  const nodes = generateJsonLd(site)['@graph'].filter(node => Array.isArray(node['@type']) && node['@type'].includes('LocalBusiness'));
  assert.equal(nodes.length, 1);
  assert.deepEqual(nodes[0], {
    '@type': ['LocalBusiness', 'AutoRepair'], '@id': 'https://jlcoachbuilders.co.nz/#business', name: 'JL Coachbuilders', url: 'https://jlcoachbuilders.co.nz/', telephone: '+64 27 347 0214', email: 'jamie@jlcoachbuilders.co.nz', foundingDate: '2016', image: 'https://jlcoachbuilders.co.nz/images/optimized/workshop-768.webp',
    address: { '@type': 'PostalAddress', streetAddress: '5/4 Spencerville Road, Kainga', addressLocality: 'Christchurch', postalCode: '8083', addressCountry: 'NZ' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'].map(day => 'https://schema.org/' + day), opens: '07:30', closes: '17:30' }],
    specialOpeningHoursSpecification: [{ '@type': 'OpeningHoursSpecification', validFrom: '2026-11-13', validThrough: '2026-11-13', opens: '00:00', closes: '00:00' }], sameAs: ['https://www.facebook.com/JLCoachbuilders/'],
  });
  assert.deepEqual(nodes[0].openingHoursSpecification, siteConfig.business.openingHoursSpecification);
});

test('production stays indexable and every other environment sends three noindex safeguards', async () => {
  const prior = process.env.VERCEL_ENV;
  try {
    for (const env of ['production', 'preview', 'development', undefined]) {
      if (env === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = env;
      const production = env === 'production';
      assert.deepEqual(pageMetadata({ title: 'Contact', description: 'Test', path: '/contact/' }).robots, { index: production, follow: production });
      assert.deepEqual(robots().rules, production ? { userAgent: '*', allow: '/', disallow: '/api/' } : { userAgent: '*', disallow: '/' });
      const headers = await config(PHASE_PRODUCTION_BUILD).headers!();
      assert.equal(headers[0].headers.some(header => header.key === 'X-Robots-Tag'), !production);
      assert.equal(robots().sitemap, 'https://jlcoachbuilders.co.nz/sitemap.xml');
      assert.deepEqual(pageMetadata({ title: 'Contact', description: 'Test', path: '/contact/' }).alternates, { canonical: 'https://jlcoachbuilders.co.nz/contact/' });
    }
  } finally { if (prior === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prior; }
});

test('service CTA spacing accumulates short sections and resets after each action', () => {
  const section = (id: string, count: number, text = 'A short block'): ContentPage['sections'][number] => ({ id, title: id, blocks: Array.from({ length: count }, () => ({ type: 'paragraph', text })) });
  assert.deepEqual([...serviceCtaSections([section('a', 1), section('b', 1), section('c', 1), section('d', 1)])], ['c']);
  assert.deepEqual([...serviceCtaSections([section('long', 1, 'word '.repeat(251)), section('short', 1)])], ['long']);
});
