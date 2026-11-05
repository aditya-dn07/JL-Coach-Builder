import { vehicles } from '@/content/catalog';
import { contentRepository } from '@/content/repository';
import { HeaderNavigation } from '@/components/layout/header-navigation';

export function Header() {
  return <HeaderNavigation groups={vehicles.map(({label,links}) => ({label,links}))} logo={contentRepository.getImageManifest().logo} />;
}
