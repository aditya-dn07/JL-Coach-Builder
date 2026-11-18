import { LinkedText } from '../content/related-services';
import { getSiteContent } from '@/lib/sanity/site-content';
import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ContentPage } from '@/content/schema';
import { ContentImage as Image } from '../shared/content-image';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection, getHomeUi } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';

type Props = { page: ContentPage; interior?: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode; reverse?: boolean } };

export async function HomeWorkshop({ page, interior }: Props) {
  const { phoneHref, siteConfig, editorial } = await getSiteContent();
  if (interior) return <InteriorSectionFrame id={interior.section.id} surface="workshop-feature home-workshop" ><div className={`interior-workshop-layout ${interior.section.image ? '' : 'interior-workshop-text'}`}>
    {interior.section.image && <div className={`feature-image ${interior.reverse ? 'min-[901px]:order-2' : ''}`}><div className="photo"><Image src={interior.section.image.src} caption={interior.section.image.caption} decorative={interior.section.image.decorative} focalPoint={interior.section.image.focalPoint} alt={interior.section.image.alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover object-center" /></div></div>}
    <div className="feature-copy"><InteriorSectionHeader>{interior.intro}</InteriorSectionHeader>{interior.children}</div></div></InteriorSectionFrame>;
  const content = getHomeSection(page, 4);
  const capabilities = content.capabilities ?? [];
  const introduction = content.introduction ?? content.blocks.slice(0, 2);
  const comparison = content.comparison;
  return <section id="workshop" className="workshop-feature home-workshop home-workshop--compact">
    <div className="workshop-comparison">
      {content.image && <figure className="workshop-comparison-photo">
        <Image src={content.image.src} caption={content.image.caption} decorative={content.image.decorative} focalPoint={content.image.focalPoint} alt={content.image.alt} width={content.image.width ?? 1498} height={content.image.height ?? 824} sizes="(max-width: 900px) 100vw, 50vw" />
        <figcaption className="workshop-comparison-labels">
          <span>{comparison?.before ?? editorial.interface.workshop.before}</span>
          <span>{comparison?.after ?? editorial.interface.workshop.after}</span>
        </figcaption>
        <span className="workshop-comparison-divider" aria-hidden="true" />
      </figure>}
      <div className="workshop-comparison-footer">
        <p>{comparison?.captionLine1 ?? editorial.interface.workshop.captionLine1}<br /><strong>{comparison?.captionLine2 ?? editorial.interface.workshop.captionLine2}</strong></p>
        <div className="workshop-stamp"><strong>{comparison?.yearsValue ?? getHomeUi(page, 'workshopYears')}<span>{comparison?.yearsSuffix ?? '+'}</span></strong><span>{comparison?.yearsLabel1 ?? getHomeUi(page, 'workshopYearsLabel1')}<br />{comparison?.yearsLabel2 ?? getHomeUi(page, 'workshopYearsLabel2')}</span></div>
      </div>
    </div>
    <div className="feature-copy" data-reveal>
      <p className="kicker">{getHomeUi(page, 'workshop')}</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.descriptionRichText?.length ? <LinkedText text={introduction.map(block => block.text).join(' ')} richText={content.descriptionRichText} /> : introduction.map((block, index) => <Fragment key={index}>{index > 0 ? ' ' : ''}<LinkedText text={block.text} links={block.links} richText={block.richText} /></Fragment>)}</p>
      <ul className="workshop-capability-list">{capabilities.map(text => <li key={text}><LibraryIcon name="check2-circle" /><span>{text}</span></li>)}</ul>
      <div className="workshop-actions mt-6 flex flex-wrap gap-3">
        <QuoteLink label={content.actions?.quoteLabel} href={content.actions?.quoteHref} />
        <a href={content.actions?.callHref || phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#8b9caf] px-[22px] py-[13px] text-xs font-semibold text-white transition-colors hover:bg-white/5">
          <LibraryIcon name="telephone" />{getHomeUi(page, 'callPrefix')}{siteConfig.business.phone}
        </a>
      </div>
    </div>
  </section>;
}
