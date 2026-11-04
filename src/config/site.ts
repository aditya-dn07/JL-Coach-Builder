import config from './site.json';
export const siteConfig = config;
export const phoneHref = 'tel:' + config.business.phone.replace(/^0/, '+64').replaceAll(' ', '');
export const fullAddress = [
  config.business.address.street,
  config.business.address.locality + ' ' + config.business.address.postcode,
  'New Zealand',
].join(', ');
export const directionsHref = 'https://maps.google.com/?q=' + encodeURIComponent(fullAddress);
export const mapEmbedSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2897.327970637402!2d172.6502569!3d-43.432865799999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d318c79ea3e08c1%3A0xb24fa786ab61546f!2sJL%20Coachbuilders%20Ltd!5e0!3m2!1sen!2sin!4v1793761793702!5m2!1sen!2sin';
export const googleReviewHref = 'https://admin.trustindex.io/api/googleReview?place-id=ChIJwQg-6nmMMW0Rb1Rhq4anT7I';
