import type { Site } from '@/data/site.schema';

export function generateJsonLd(data: Site) {
  const { business: b, url } = data;
  const address = {
    '@type': 'PostalAddress',
    streetAddress: b.address.street,
    addressLocality: b.address.locality,
    postalCode: b.address.postcode,
    addressCountry: b.address.country,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'AutoRepair'],
        '@id': `${url}#business`,
        name: b.name,
        url,
        telephone: b.phone,
        email: b.email,
        address,
        foundingDate: String(b.foundedYear),
        image: new URL(data.hero.image.optimizedSrc, url).href,
        sameAs: b.sameAs,
        ...(b.geo ? { geo: { '@type': 'GeoCoordinates', ...b.geo } } : {}),
        ...(b.openingHours ? { openingHours: b.openingHours } : {}),
      },
      {
        '@type': 'Organization',
        '@id': `${url}#organization`,
        name: b.name,
        url,
        logo: new URL(data.logo.optimizedSrc, url).href,
        address,
        telephone: b.phone,
        sameAs: b.sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: b.name,
        publisher: { '@id': `${url}#organization` },
        inLanguage: 'en-NZ',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [{ '@type': 'ListItem', position: 1, name: b.name, item: url }],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: data.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

export function serializeJsonLd(data: Site) {
  return JSON.stringify(generateJsonLd(data)).replace(/</g, '\\u003c');
}
