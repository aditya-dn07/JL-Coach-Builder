import type { ReactNode } from 'react';
import type { ContentPage } from '@/content/schema';
import { PageStructuredData } from '@/components/seo/page-structured-data';
import { InteriorHero } from '@/components/content/interior-hero';
import { interiorMotionStyle } from '@/lib/motion';
import { brandFontVariables } from '@/lib/brand-fonts';
import '@/components/home/home.css';
import '@/components/content/content.css';

export function ResourcePage({ page, children }: { page: ContentPage; children: ReactNode }) {
  return <><style>{`body:has(.interior-shell) { ${brandFontVariables} }`}</style><div className="home-page interior-shell" data-home-page style={interiorMotionStyle}>
    <PageStructuredData page={page} />
    <InteriorHero page={page} />
    {children}
  </div></>;
}
