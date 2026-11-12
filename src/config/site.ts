import { contentRepository } from '@/content/repository';
const config = contentRepository.getSiteSettings();
export const siteConfig = config;
export const phoneHref = 'tel:' + config.business.phone.replace(/^0/, '+64').replaceAll(' ', '');
export const fullAddress = [
  config.business.address.street,
  config.business.address.locality + ' ' + config.business.address.postcode,
  'New Zealand',
].join(', ');
export const directionsHref = 'https://maps.google.com/?q=' + encodeURIComponent(fullAddress);
export const mapEmbedSrc = config.ui.mapEmbed;
// TODO: Supply the verified public Google destination in site.json; never use a proxy URL.
export const googleReviewHref = config.ui.verifiedGoogleReviewUrl || undefined;
