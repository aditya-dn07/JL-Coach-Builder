import { contentRepository } from '@/content/repository';
const site = contentRepository.getLegacySite();
export const localHref = (href: string) =>
  href.startsWith(site.url) ? new URL(href).pathname : href;
export const vehicles = site.nav.map((group, i) => ({
  label: group.label,
  image: site.services[i].image,
  links: group.children.map((link) => ({
    label: link.label.replace('Fifth Wheels Alteration', 'Fifth Wheel Alteration'),
    href: localHref(link.href),
  })),
}));
export const imageFor = (id: string) =>
  id === 'workshop'
    ? site.hero.image
    : (site.services.find((s) => s.image.id === id)?.image ?? site.hero.image);
