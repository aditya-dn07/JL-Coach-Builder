import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import type { ContentPage } from '@/content/schema';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection, getHomeUi } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';
import { GoogleReviewLink } from '@/components/shared/google-review-link';

type Props = { page: ContentPage; interior?: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode } };

export function HomeTrust({ page, interior }: Props) {
  if (interior) return <InteriorSectionFrame id={interior.section.id} className="home-document-trust"><div className="experience-layout"><div className="experience-intro"><InteriorSectionHeader>{interior.intro}</InteriorSectionHeader></div><div className="experience-proof">{interior.children}</div></div></InteriorSectionFrame>;
  const content = getHomeSection(page, 1);
  return <section className="home-document-trust section-pad">
    <div className="container experience-layout">
    <div className="experience-intro" data-reveal>
      <p className="kicker">{getHomeUi(page, 'trustEyebrow')}</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
      <QuoteLink />
    </div>
    <div className="experience-proof" data-reveal>
      <div className="experience-metrics">{content.blocks.slice(1, 4).map(block => {
        const space = block.text.indexOf(' ');
        if (block.text.endsWith('Google rating')) {
          return <div key={block.text} className="experience-rating col-span-2 flex items-center justify-start min-[651px]:col-span-1"><GoogleReviewLink /></div>;
        }
        return <div className="experience-metric" key={block.text}><strong>{block.text.slice(0, space)}</strong><span>{block.text.slice(space + 1)}</span></div>;
      })}</div>
      <div className="experience-assurances">{content.blocks.slice(4).map(block => <div key={block.text}><LibraryIcon name="check2-circle" /><span>{block.text}</span></div>)}</div>
    </div>
    </div>
  </section>;
}
