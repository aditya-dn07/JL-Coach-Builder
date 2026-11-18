import { getSiteContent } from '@/lib/sanity/site-content';

import { HeaderNavigation } from '@/components/layout/header-navigation';

export async function Header() {
  const { vehicles, contentRepository } = await getSiteContent();
  return <HeaderNavigation groups={vehicles.map(({label,links}) => ({label,links}))} logo={contentRepository.getImageManifest().logo} />;
}
