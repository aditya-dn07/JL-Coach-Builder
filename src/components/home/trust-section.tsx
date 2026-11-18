import { LinkedText } from '../content/related-services';
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
  const introduction = content.introduction?.[0] ?? content.blocks[0];
  return <section className="home-document-trust section-pad">
    <div className="container experience-layout">
    <div className="experience-intro" data-reveal>
      <p className="kicker">{getHomeUi(page, 'trustEyebrow')}</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p><LinkedText text={introduction.text} links={introduction.links} richText={content.descriptionRichText ?? introduction.richText} /></p>
      <QuoteLink label={content.actions?.quoteLabel} href={content.actions?.quoteHref} />
    </div>
    <div className="experience-proof" data-reveal>
      <div className="experience-metrics">{(content.metrics ?? []).map(metric => {
        if (metric.kind === 'rating') return <div key={metric.label} className="experience-rating col-span-2 flex items-center justify-start min-[651px]:col-span-1"><GoogleReviewLink /></div>;
        return <div className="experience-metric" key={metric.label}><strong>{metric.value}</strong><span><LinkedText text={metric.label} links={metric.links} /></span></div>;
      })}</div>
      <div className="experience-assurances">{(content.assurances ?? content.blocks.slice(4)).map(block => <div key={block.text}><LibraryIcon name="check2-circle" /><span><LinkedText text={block.text} links={block.links} richText={block.richText} /></span></div>)}</div>
    </div>
    </div>
  </section>;
}
