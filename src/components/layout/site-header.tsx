import { vehicles } from '@/content/catalog';
import manifest from '@/data/image-manifest.json';
import { HeaderNavigation } from '@/components/layout/header-navigation';

export function Header() {
  return <HeaderNavigation groups={vehicles.map(({label,links}) => ({label,links}))} logo={manifest.logo} />;
}
