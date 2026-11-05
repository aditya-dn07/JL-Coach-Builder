import type { ContentPage } from './schema';

// Generated editorial illustrations are separate from the real project gallery.
const vehicleBanners = {
  caravan: { src: '/images/banners/caravan-v1.webp', alt: 'Illustration of a white touring caravan outside a vehicle workshop' },
  campervan: { src: '/images/banners/campervan-v1.webp', alt: 'Illustration of a white campervan outside a vehicle workshop' },
  motorhome: { src: '/images/banners/motorhome-v1.webp', alt: 'Illustration of a white coachbuilt motorhome outside a vehicle workshop' },
  'fifth-wheel': { src: '/images/banners/fifth-wheel-v1.webp', alt: 'Illustration of a white fifth-wheel trailer outside a vehicle workshop' },
  bus: { src: '/images/banners/bus-v1.webp', alt: 'Illustration of a white touring coach outside a vehicle workshop' },
};

export function bannerFor(page: ContentPage) {
  if (page.slug === 'insurance') return vehicleBanners.motorhome;
  if (page.image !== 'workshop') return vehicleBanners[page.image];
  return { src: '/images/home-workshop-banner.png', alt: 'JL Coachbuilders workshop buildings and caravan yard in Christchurch' };
}
