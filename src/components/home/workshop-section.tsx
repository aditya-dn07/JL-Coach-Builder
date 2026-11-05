import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import type { ContentPage } from '@/content/schema';
import Image from 'next/image';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection, getHomeUi } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';
import { phoneHref, siteConfig } from '@/config/site';

type Props = { page: ContentPage; interior?: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode; reverse?: boolean } };

export function HomeWorkshop({ page, interior }: Props) {
  if (interior) return <InteriorSectionFrame id={interior.section.id} surface="workshop-feature home-workshop" ><div className={`interior-workshop-layout ${interior.section.image ? '' : 'interior-workshop-text'}`}>
    {interior.section.image && <div className={`feature-image ${interior.reverse ? 'min-[901px]:order-2' : ''}`}><div className="photo"><Image src={interior.section.image.src} alt={interior.section.image.alt} fill sizes="(max-width: 900px) 100vw, 50vw" className="object-cover object-center" /></div></div>}
    <div className="feature-copy"><InteriorSectionHeader>{interior.intro}</InteriorSectionHeader>{interior.children}</div></div></InteriorSectionFrame>;
  const content = getHomeSection(page, 4);
  // Separate the combined electrical/plumbing item into two distinct capabilities.
  const capabilities = content.blocks.slice(2).flatMap(block =>
    block.text === 'Electrical and plumbing work' ? [getHomeUi(page, 'electrical'), getHomeUi(page, 'plumbing')] : [block.text]
  );
  return <section id="workshop" className="workshop-feature home-workshop home-workshop--compact">
    <div className="workshop-comparison">
      {content.image && <figure className="workshop-comparison-photo">
        <Image src={content.image.src} alt={content.image.alt} width={content.image.width ?? 1498} height={content.image.height ?? 824} sizes="(max-width: 900px) 100vw, 50vw" />
        <figcaption className="workshop-comparison-labels">
          <span>Before</span>
          <span>After</span>
        </figcaption>
        <span className="workshop-comparison-divider" aria-hidden="true"><LibraryIcon name="chevron-right" /></span>
      </figure>}
      <div className="workshop-comparison-footer">
        <p>From damaged<br /><strong>to ready for the road.</strong></p>
        <div className="workshop-stamp"><strong>{getHomeUi(page, 'workshopYears')}<span>+</span></strong><span>{getHomeUi(page, 'workshopYearsLabel1')}<br />{getHomeUi(page, 'workshopYearsLabel2')}</span></div>
      </div>
    </div>
    <div className="feature-copy" data-reveal>
      <p className="kicker">{getHomeUi(page, 'workshop')}</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text} {content.blocks[1].text}</p>
      <ul className="workshop-capability-list">{capabilities.map(text => <li key={text}><LibraryIcon name="check2-circle" /><span>{text}</span></li>)}</ul>
      <div className="workshop-actions mt-6 flex flex-wrap gap-3">
        <QuoteLink />
        <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#8b9caf] px-[22px] py-[13px] text-xs font-semibold text-white transition-colors hover:bg-white/5">
          <LibraryIcon name="telephone" />{getHomeUi(page, 'callPrefix')}{siteConfig.business.phone}
        </a>
      </div>
    </div>
  </section>;
}
