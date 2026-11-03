import config from './site.json';
export const siteConfig = config;
export const phoneHref = 'tel:' + config.business.phone.replace(/^0/, '+64').replaceAll(' ', '');
export const fullAddress = [
  config.business.address.street,
  config.business.address.locality + ' ' + config.business.address.postcode,
  'New Zealand',
].join(', ');
export const directionsHref = 'https://maps.google.com/?q=' + encodeURIComponent(fullAddress);
