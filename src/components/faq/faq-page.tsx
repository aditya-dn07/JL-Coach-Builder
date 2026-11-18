import { getSiteContent } from '@/lib/sanity/site-content';
import { ResourcePage } from '@/components/shared/resource-page';
import { InteriorClosing } from '@/components/content/interior-sections';
import { InteriorFaq, InteriorReveal } from '@/components/content/animated-benefit-card';
import { HomeFaqSection } from '@/components/content/document-sections';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { LinkedText } from '@/components/content/related-services';
export async function AllFaqsPage() {
  const { contentRepository } = await getSiteContent();
  const faqPage = await contentRepository.getPage('faqs');
  if (!faqPage) return null;
  return <ResourcePage page={faqPage}>
    <div className="document-sections">
      {(faqPage.faqTopics ?? []).map(topic => <HomeFaqSection key={topic.id} id={'faq-' + topic.sourcePageId} intro={
        <><p className="kicker">{topic.eyebrow}</p>
        <h2><TwoToneHeading text={topic.title} /></h2>
        <p className="mb-6 text-base leading-7"><LinkedText text={topic.description} links={topic.descriptionLinks} richText={topic.descriptionRichText} /></p></>}>
        {topic.faqs.map((faq, index) => <InteriorReveal key={faq.question} delay={Math.min(index, 6) * 0.07}><InteriorFaq question={faq.question} id={'all-faq-' + topic.sourcePageId + '-' + index}><LinkedText text={faq.answer} links={faq.answerLinks} richText={faq.richText} /></InteriorFaq></InteriorReveal>)}
      </HomeFaqSection>)}
    </div>
    <InteriorClosing page={faqPage} />
  </ResourcePage>;
}
