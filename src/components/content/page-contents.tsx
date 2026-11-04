import type { ContentPage } from '@/content/schema';

export function PageContents({ page }: { page: ContentPage }) {
  if (page.sections.length < 3) return null;
  const legal = page.kind === 'legal';
  const sections = legal || page.kind === 'about' ? page.sections : page.sections.filter((section, i) => i === 0 || /Complete .*Service|Complete .*Repair|Why Choose|Straightforward|Common Questions|How We Help/.test(section.title)).slice(0, 5);
  return (
    <nav className={`container page-contents ${legal ? 'legal-contents' : ''}`} aria-label={legal ? 'Policy contents' : 'On this page'}>
      <span>{legal ? 'Policy contents' : 'On this page'}</span>
      <div>{sections.map((section, i) => <a href={`#${section.id}`} key={section.id}>{legal ? section.title : page.kind === 'about' ? ['Our story', 'Workshop capability', 'Talk to our team'][i] : i === 0 ? 'Overview' : /Why Choose/.test(section.title) ? 'Why choose us' : /Common Questions/.test(section.title) ? 'Common questions' : /Straightforward|How We Help/.test(section.title) ? 'How it works' : 'Our services'}</a>)}</div>
    </nav>
  );
}
