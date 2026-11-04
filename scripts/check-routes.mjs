import fs from 'node:fs';
const pages = JSON.parse(fs.readFileSync('src/content/pages.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('src/config/site.json', 'utf8'));
const origin = process.env.CHECK_ORIGIN ?? 'http://localhost:3000';
const paths = [
  '/',
  ...pages.filter((page) => page.slug).map((page) => `/${page.slug}`),
  '/gallery',
  '/reviews',
  '/faqs',
];
const results = [];
const decode = (s) =>
  s?.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
for (let i = 0; i < paths.length; i += 4) {
  await Promise.all(
    paths.slice(i, i + 4).map(async (path) => {
      const response = await fetch(`${origin}${path}`);
      const html = await response.text();
      const meta = (name) =>
        decode(html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1]);
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1]);
      const required = [
        'description',
        'og:title',
        'og:description',
        'og:type',
        'og:url',
        'og:image',
        'og:site_name',
        'og:locale',
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
      ];
      const missingMeta = required.filter((key) => !meta(key));
      const structured = html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
      )?.[1];
      let graph = [];
      try {
        graph = JSON.parse(structured)['@graph'];
      } catch {}
      const schemaTypes = graph.flatMap((e) =>
        Array.isArray(e['@type']) ? e['@type'] : [e['@type']]
      );
      const missingSchema = ['Organization', 'WebSite', 'BreadcrumbList', 'LocalBusiness'].filter(
        (type) => !schemaTypes.includes(type)
      );
      const expected = new URL(path === '/' ? '/' : `${path}/`, config.url).href;
      const internalLinks = [...html.matchAll(/href="(\/[^"?#]*)/g)].map((match) =>
        match[1].replace(/\/$/, '')
      );
      const allowed = new Set(paths.map((p) => p.replace(/\/$/, '')));
      const brokenInternal = [
        ...new Set(
          internalLinks.filter(
            (link) =>
              !allowed.has(link) &&
              !link.startsWith('/_next') &&
              !/\.(ico|png|svg|webmanifest)$/.test(link)
          )
        ),
      ];
      results.push({
        path,
        status: response.status,
        h1: (html.match(/<h1[\s>]/g) || []).length,
        title,
        description: meta('description'),
        canonical,
        canonicalMatches: canonical ? new URL(canonical).href === new URL(expected).href : false,
        missingMeta,
        missingSchema,
        brokenInternal,
        brandTitle: title?.includes(config.business.name),
        twitterCard: meta('twitter:card'),
        indexable: !meta('robots')?.includes('noindex'),
      });
    })
  );
}
const invalid = results.filter(
  (r) =>
    r.status !== 200 ||
    r.h1 !== 1 ||
    !r.brandTitle ||
    !r.indexable ||
    !r.canonicalMatches ||
    r.missingMeta.length ||
    r.missingSchema.length ||
    r.brokenInternal.length ||
    r.twitterCard !== 'summary_large_image'
);
const titleUnique = new Set(results.map((r) => r.title)).size === results.length;
const descriptionUnique = new Set(results.map((r) => r.description)).size === results.length;
const notFound = await fetch(`${origin}/this-page-does-not-exist`);
const errorHtml = await notFound.text();
const errorCheck = {
  status: notFound.status,
  noindex: /name="robots" content="[^"]*noindex/.test(errorHtml),
  helpfulLinks: errorHtml.includes('Explore vehicle services'),
  title: decode(errorHtml.match(/<title>(.*?)<\/title>/)?.[1]),
};
const assets = [];
for (const path of [
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/site.webmanifest',
  '/images/brand/og.jpg',
  '/robots.txt',
  '/sitemap.xml',
]) {
  const response = await fetch(`${origin}${path}`);
  assets.push({ path, status: response.status });
}
const report = {
  origin,
  pages: results.sort((a, b) => a.path.localeCompare(b.path)),
  titleUnique,
  descriptionUnique,
  errorCheck,
  assets,
};
fs.writeFileSync('docs/route-verification.json', JSON.stringify(report, null, 2) + '\n');
console.log(
  JSON.stringify(
    {
      pages: results.length,
      passed: results.length - invalid.length,
      titleUnique,
      descriptionUnique,
      errorCheck,
      assets,
      invalid,
    },
    null,
    2
  )
);
if (
  invalid.length ||
  !titleUnique ||
  !descriptionUnique ||
  errorCheck.status !== 404 ||
  !errorCheck.noindex ||
  !errorCheck.title?.includes('Page not found') ||
  assets.some((a) => a.status !== 200)
)
  process.exitCode = 1;
