import type { ContentPage } from '@/content/schema';
import { generateJsonLd } from '@/lib/jsonld';
import { site } from '@/data/site.data';
export function PageStructuredData({ page }: { page: ContentPage }) {
  const url = new URL(page.slug ? `/${page.slug}/` : '/', site.url).href;
  const base = generateJsonLd(site)['@graph'].filter(
    (e) => !['FAQPage', 'BreadcrumbList'].includes(e['@type'] as string)
  );
  const graph = [
    ...base,
    {
      '@type': 'WebPage',
      '@id': `${url}#page`,
      url,
      name: page.title,
      description: page.seo.description,
      isPartOf: { '@id': `${site.url}#website` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
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
            areaServed: { '@type': 'City', name: 'Christchurch' },
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
