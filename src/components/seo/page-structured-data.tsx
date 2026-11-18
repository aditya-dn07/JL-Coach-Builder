import { getSiteContent } from '@/lib/sanity/site-content';
import type { ContentPage } from '@/content/schema';
import { generateJsonLd } from '@/lib/jsonld';
import { pageUrl } from '@/lib/site-url';
import { getSeoTarget } from '@/lib/seo-targets';
export async function PageStructuredData({ page }: { page: ContentPage }) {
  const { contentRepository, siteConfig } = await getSiteContent();
  const site = contentRepository.getLegacySite();
  const target = getSeoTarget(page.slug ? `/${page.slug}` : '/');
  const url = target?.canonical ?? pageUrl(page.slug ? `/${page.slug}` : '/', site.url);
  const base = generateJsonLd(site, siteConfig)['@graph'].filter(
    (e) => !['FAQPage', 'BreadcrumbList'].includes(e['@type'] as string)
  );
  const graph = [
    ...base,
    {
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: target?.title ?? page.title,
      description: target?.description ?? page.seo.description,
      isPartOf: { '@id': `${site.url}#website` },
      about: { '@id': `${site.url}#business` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: siteConfig.ui.headerHome, item: pageUrl('/', target?.canonical ?? site.url) },
        ...(page.slug ? [{ '@type': 'ListItem', position: 2, name: page.label, item: url }] : []),
      ],
    },
    ...(page.kind === 'service'
      ? [
          {
            '@type': 'Service',
            name: page.label,
            serviceType: page.label,
            provider: { '@id': `${site.url}#business` },
            url,
          },
        ]
      : []),
    ...(page.faqs.length
      ? [
          {
            '@type': 'FAQPage',
            mainEntity: page.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          },
        ]
      : []),
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
          /</g,
          '\\u003c'
        ),
      }}
    />
  );
}
