import { Check } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { QuoteLink } from '@/components/shared/quote-link';
import { SectionIntro } from '@/components/shared/section-intro';
import { getHomeSection } from './home-content';

export function HomeProblems({ page }: { page: ContentPage }) {
  const content = getHomeSection(page, 3);
  const introduction = content.blocks.slice(0, 2).map(block => block.text).join(' ');
  const jobs = content.blocks.slice(2, -1);
  const closing = content.blocks.at(-1)!.text;

  return (
    <section id={content.id} className="content-section section-pad home-content-section-3">
      <div className="container" data-reveal>
        <SectionIntro eyebrow="Common Problems We Fix" title={content.title} description={introduction} action={<QuoteLink />} />
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 min-[901px]:grid-cols-4">
          {jobs.map(job => (
            <li key={job.text} className="flex min-h-[78px] items-center gap-3 rounded-lg border border-line bg-[#1e2630] p-4 text-sm leading-relaxed">
              <Check size={20} aria-hidden="true" className="shrink-0 text-brand" />
              <span>{job.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-[1.8] text-[#b1bac5]">{closing}</p>
      </div>
    </section>
  );
}
