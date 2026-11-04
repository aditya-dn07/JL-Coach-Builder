import type { ContentPage } from '@/content/schema';
import { Photo } from '@/components/shared/photo';
import { site } from '@/data/site.data';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';
import { phoneHref, siteConfig } from '@/config/site';

type Props = { page: ContentPage };

export function HomeWorkshop({ page }: Props) {
  const content = getHomeSection(page, 4);
  // Separate the combined electrical/plumbing item into two distinct capabilities.
  const capabilities = content.blocks.slice(2).flatMap(block =>
    block.text === 'Electrical and plumbing work' ? ['Electrical work', 'Plumbing work'] : [block.text]
  );
  return <section className="workshop-feature home-workshop">
    <div className="feature-image"><Photo image={site.hero.image} sizes="(max-width: 800px) 100vw, 50vw" /><div className="workshop-stamp"><strong>80<span>+</span></strong><span>Years of combined<br />experience</span></div></div>
    <div className="feature-copy" data-reveal>
      <p className="kicker">Workshop Capability</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
      <p>{content.blocks[1].text}</p>
      <ul className="capability-tiles">{capabilities.map(text => <li key={text}><LibraryIcon name="check2-circle" /><span>{text}</span></li>)}</ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <QuoteLink />
        <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#8b9caf] px-[22px] py-[13px] text-xs font-semibold text-white transition-colors hover:bg-white/5">
          <LibraryIcon name="telephone" />Call {siteConfig.business.phone}
        </a>
      </div>
    </div>
  </section>;
}
