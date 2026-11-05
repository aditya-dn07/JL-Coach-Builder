import { contentRepository } from '@/content/repository';
import { ResourcePage } from '@/components/shared/resource-page';
import { InteriorClosing } from '@/components/content/interior-sections';
import { InteriorFaq, InteriorReveal } from '@/components/content/animated-benefit-card';
import { HomeFaqSection } from '@/components/content/document-sections';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { LinkedText } from '@/components/content/related-services';

export async function AllFaqsPage() {
  const pages = await contentRepository.getPages();
  const faqPage = pages.find(page => page.slug === 'faqs');
  if (!faqPage) return null;
  const seen = new Set<string>();
  const groups = pages.map(page => ({ page, faqs: page.faqs.filter(faq => {
    const key = faq.question.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }) })).filter(group => group.faqs.length);

  return <ResourcePage page={{ ...faqPage, faqs: groups.flatMap(group => group.faqs) }}>
    <div className="document-sections">
      {groups.map(({ page, faqs }) => <HomeFaqSection key={page.id} id={`faq-${page.id}`} intro={
        <><p className="kicker">{page.sections.find(section => /Common Questions/.test(section.title))?.eyebrow ?? page.eyebrow}</p>
        <h2><TwoToneHeading text={page.sections.find(section => /Common Questions/.test(section.title))?.title ?? page.title} /></h2>
        <p className="mb-6 text-base leading-7"><LinkedText text={page.sections.find(section => /Common Questions/.test(section.title))?.description ?? page.description} links={page.sections.find(section => /Common Questions/.test(section.title))?.descriptionLinks ?? page.descriptionLinks} /></p></>}>
          {faqs.map((faq, index) => <InteriorReveal key={faq.question} delay={Math.min(index, 6) * 0.07}><InteriorFaq question={faq.question} id={`all-faq-${page.id}-${index}`}><LinkedText text={faq.answer} links={faq.answerLinks} /></InteriorFaq></InteriorReveal>)}
      </HomeFaqSection>)}
    </div>
    <InteriorClosing page={faqPage} />
  </ResourcePage>;
}
