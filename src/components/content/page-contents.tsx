import { InteriorSectionFrame } from '@/components/shared/section-intro';
import type { ContentPage } from '@/content/schema';

export function PageContents({ page }: { page: ContentPage }) {
  if (page.sections.length < 3) return null;
  const legal = page.kind === 'legal';
  const sections = legal || page.kind === 'about' ? page.sections : page.sections.filter((section, i) => i === 0 || /Complete .*Service|Complete .*Repair|Why Choose|Straightforward|Common Questions|How We Help/.test(section.title)).slice(0, 5);
  return (
    <InteriorSectionFrame as="div" className="interior-contents-frame"><nav className="page-contents" aria-label={legal ? 'Policy contents' : 'On this page'}>
      <span>{legal ? 'Policy contents' : 'On this page'}</span>
      <div>{sections.map(section => <a href={`#${section.id}`} key={section.id}>{legal ? section.title : section.eyebrow || section.title}</a>)}</div>
    </nav></InteriorSectionFrame>
  );
}
