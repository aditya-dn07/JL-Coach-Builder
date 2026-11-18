import type { ContentSnapshot } from './snapshot';
import siteDefaults from '../config/site.json';
export function createContentView(snapshot: ContentSnapshot) {
  const siteConfig = snapshot.siteSettings;
  const footerExtra = [...siteConfig.navigation.footerExtra];
  const defaultBlogLink = siteDefaults.navigation.footerExtra.find(link => link.href === '/blog/');
  if (defaultBlogLink && ![...siteConfig.navigation.main, ...footerExtra].some(link => link.href.replace(/\/$/, '') === '/blog')) {
    footerExtra.push(defaultBlogLink);
  }
  const phoneHref = 'tel:' + siteConfig.business.phone.replace(/^0/, '+64').replaceAll(' ', '');
  const fullAddress = [siteConfig.business.address.street, siteConfig.business.address.locality + ' ' + siteConfig.business.address.postcode, siteConfig.ui.footerCountry].join(', ');
  const directionsHref = 'https://maps.google.com/?q=' + encodeURIComponent(fullAddress);
  const vehicles = snapshot.legacySite.nav.map((group, index) => ({
    label: group.label, image: snapshot.legacySite.services[index].image,
    links: group.children.map(link => ({ label: link.label.replace('Fifth Wheels Alteration', 'Fifth Wheel Alteration'), href: link.href.startsWith(snapshot.legacySite.url) ? new URL(link.href).pathname : link.href })),
  }));
  return { ...snapshot, siteConfig, phoneHref, fullAddress, directionsHref,
    mapEmbedSrc: siteConfig.ui.mapEmbed, googleReviewHref: siteConfig.ui.verifiedGoogleReviewUrl || undefined,
    vehicles, imageFor: (id: string) => snapshot.legacySite.services.find(item => item.image.id === id)?.image ?? snapshot.legacySite.hero.image,
    mainNavigation: siteConfig.navigation.main,
    footerNavigation: [{ label: siteConfig.ui.headerHome, href: '/' }, ...siteConfig.navigation.main, ...footerExtra],
    contentRepository: {
      getPages: async () => snapshot.pages, getPage: async (slug: string) => snapshot.pages.find(page => page.slug === slug),
      getSiteSettings: () => siteConfig, getQuoteForm: () => snapshot.quoteForm,
      getLegacySite: () => snapshot.legacySite, getImageManifest: () => snapshot.imageManifest,
      getGalleryImages: () => snapshot.galleryImages,
    },
  };
}
