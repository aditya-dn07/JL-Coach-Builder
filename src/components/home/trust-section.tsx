import type { ContentPage } from '@/content/schema';
import { LibraryIcon } from '@/components/shared/library-icon';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { getHomeSection } from './home-content';
import { QuoteLink } from '@/components/shared/quote-link';
import { googleReviewHref } from '@/config/site';
import { ArrowUpRight } from 'lucide-react';

type Props = { page: ContentPage };

export function HomeTrust({ page }: Props) {
  const content = getHomeSection(page, 1);
  return <section className="home-document-trust section-pad">
    <div className="container experience-layout">
    <div className="experience-intro" data-reveal>
      <p className="kicker">Trusted Local Specialists</p>
      <h2><TwoToneHeading text={content.title} /></h2>
      <p>{content.blocks[0].text}</p>
      <QuoteLink />
    </div>
    <div className="experience-proof" data-reveal>
      <div className="experience-metrics">{content.blocks.slice(1, 4).map(block => {
        const space = block.text.indexOf(' ');
        if (block.text.endsWith('Google rating')) {
          return <a className="experience-rating group col-span-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/80 bg-white p-3.5 text-[#16202b] shadow-[0_8px_28px_#0002] transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_12px_32px_#0004] min-[651px]:col-span-1 min-[651px]:grid-cols-1 motion-reduce:transform-none motion-reduce:transition-none" key={block.text} href={googleReviewHref} target="_blank" rel="noopener noreferrer nofollow" aria-label="Google rating: 4.9 out of 5. Read our Google reviews (opens in a new tab)">
            <span className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.trustindex.io/assets/platform/Google/icon.svg" alt="" width="28" height="28" loading="lazy" className="h-7 w-7 shrink-0" />
              <span className="hidden text-[11px] font-semibold leading-snug min-[651px]:inline">Google rating</span>
            </span>
            <span>
              <span className="mb-1 block text-[10px] font-medium text-[#526170] min-[651px]:hidden">Google rating</span>
              <span className="flex items-center gap-2">
                <strong className="text-[34px] font-semibold leading-none tracking-[-.05em]">{block.text.slice(0, space)}</strong>
                <span className="grid gap-0.5"><span aria-hidden="true" className="text-[10px] tracking-[-.04em] text-[#f4b400]">★★★★★</span><span className="text-[10px] text-[#526170]">out of 5</span></span>
              </span>
            </span>
            <span className="flex items-center justify-between gap-1 text-[10px] font-semibold text-[#1769d2] min-[651px]:border-t min-[651px]:border-[#e3e8ed] min-[651px]:pt-2">Read reviews <ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" /></span>
          </a>;
        }
        return <div className="experience-metric" key={block.text}><strong>{block.text.slice(0, space)}</strong><span>{block.text.slice(space + 1)}</span></div>;
      })}</div>
      <div className="experience-assurances">{content.blocks.slice(4).map(block => <div key={block.text}><LibraryIcon name="check2-circle" /><span>{block.text}</span></div>)}</div>
    </div>
    </div>
  </section>;
}
