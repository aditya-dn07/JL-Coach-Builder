import type { Site } from '@/data/site.schema';
import { siteConfig } from '@/config/site';

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
        telephone: '+64 27 347 0214',
        email: b.email,
        address,
        foundingDate: String(b.foundedYear),
        image: new URL('/images/optimized/workshop-768.webp', url).href,
        sameAs: b.sameAs,
        openingHoursSpecification: siteConfig.business.openingHoursSpecification,
        specialOpeningHoursSpecification: siteConfig.business.specialOpeningHoursSpecification,
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
