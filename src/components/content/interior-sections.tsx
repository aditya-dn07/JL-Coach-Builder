import { contentRepository } from '@/content/repository';
import Image from 'next/image';
import { Car, Check, Clock, Factory, Layers, Mail, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { GoogleReviewLink } from '@/components/shared/google-review-link';
import type { CSSProperties } from 'react';
import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ContentPage } from '@/content/schema';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { phoneHref, siteConfig } from '@/config/site';
import { SectionDivider } from '@/components/shared/section-divider';
import { LibraryIcon } from '@/components/shared/library-icon';
import { ReviewSlider } from '@/components/shared/review-slider';
import { HomeClosing } from '@/components/home/closing-section';
import { HomeTrust } from '@/components/home/trust-section';
import { HomeServices } from '@/components/home/services-section';
import { HomeWorkshop } from '@/components/home/workshop-section';
import { HomeProblems } from '@/components/home/problems-section';
import { HomeReviews } from '@/components/home/reviews-section';
import { HomeDocumentSection, HomeFaqSection } from './document-sections';
import { ContentGroups } from './content-groups';
import { InteriorCard, InteriorFaq, InteriorListItem, InteriorReveal, InteriorTimelineLine } from './animated-benefit-card';
import { LinkedText, RelatedServices } from './related-services';

function balancedSpan(count: number, _index: number, steps = false) {
  const columns = steps ? count : [4, 8, 12].includes(count) || count === 7 ? 4 : 3;
  return 12 / columns;
}

type Section = ContentPage['sections'][number];
function SectionHeading({ section }: { section: Section }) {
  return <>{section.eyebrow && <p className="kicker">{section.eyebrow}</p>}<h2><TwoToneHeading text={section.title} /></h2>{section.descriptionParagraphs?.length ? section.descriptionParagraphs.map((paragraph, index) => <p key={index}><LinkedText text={paragraph.text} links={paragraph.links} /></p>) : section.description && <p><LinkedText text={section.description} links={section.descriptionLinks} /></p>}</>;
}
function Paragraphs({ blocks }: { blocks: Section['blocks'] }) {
  return <>{blocks.map((block, index) => block.type === 'heading' ? <h3 key={index}><LinkedText text={block.text} links={block.links} /></h3> : <p key={index}><LinkedText text={block.text} links={block.links} /></p>)}</>;
}
function InteriorTimeline({ section, blocks }: { section: Section; blocks: Section['blocks'] }) {
  const groups: { heading: Section['blocks'][number]; paragraphs: Section['blocks'] }[] = [];
  const leading: Section['blocks'] = [];
  blocks.forEach(block => {
    if (block.type === 'heading') groups.push({ heading: block, paragraphs: [] });
    else if (groups.length) groups[groups.length - 1].paragraphs.push(block);
    else leading.push(block);
  });
  return <InteriorSectionFrame id={section.id}><div className="interior-timeline-layout">
    <div className="interior-timeline-intro"><InteriorSectionHeader><SectionHeading section={section} /></InteriorSectionHeader></div>
    <div className="interior-timeline-body">{leading.length > 0 && <div className="section-prose interior-full-column"><Paragraphs blocks={leading} /></div>}
      <div className="interior-timeline-track"><InteriorTimelineLine /><ol className="interior-timeline-list">{groups.map((group, index) => <InteriorListItem key={index} index={index} className="interior-timeline-step"><span className="interior-timeline-number">{group.heading.text.match(/^\d+[.)]/)?.[0] ?? index + 1}</span><article className="interior-timeline-card"><h3><LinkedText text={group.heading.text.replace(/^\d+[.)]\s*/, '')} links={group.heading.links} /></h3><Paragraphs blocks={group.paragraphs} /></article></InteriorListItem>)}</ol></div>
    </div>
  </div></InteriorSectionFrame>;
}

export function InteriorClosing({ page }: { page: ContentPage }) {
  const cta = page.closingCta;
  if (!cta) return null;
  return <HomeClosing page={page} interior={{
    contact: <aside className="interior-closing-contact"><a href={phoneHref}><Phone aria-hidden="true" /><span>{siteConfig.ui.closingCall}<strong>{siteConfig.business.phone}</strong></span></a><a href={`mailto:${siteConfig.business.email}`}><Mail aria-hidden="true" /><span>{siteConfig.ui.closingEmail}<strong>{siteConfig.business.email}</strong></span></a></aside>,
    copy: <><p className="kicker">{cta.eyebrow}</p><h2><TwoToneHeading text={cta.title} /></h2><p>{cta.description}</p></>,
    actions: <><a className="button primary" href="#quote">{cta.quoteLabel}</a><a className="contact-direct interior-secondary-action" href={phoneHref}>{cta.callLabel}</a></>,
  }} />;
}

export async function InteriorSections({ page }: { page: ContentPage }) {
  const targets = await contentRepository.getPages();
  const relatedImages = Object.fromEntries(targets.flatMap(target => {
    const image = target.heroImage ?? target.closingImage;
    return image ? [[`/${target.slug}/`, image]] : [];
  }));
  const sections = page.kind === 'service' || page.kind === 'about' ? page.sections.slice(0, -1) : page.sections;
  let imageIndex = 0;
  return <div id="page-details" className="document-sections">
    {page.intro.length > 1 && <InteriorSectionFrame><InteriorReveal className="section-prose interior-full-column">{page.intro.slice(1).map((text, index) => <p key={index}><LinkedText text={text} links={page.introLinks?.find(item => item.index === index + 1)?.links} /></p>)}</InteriorReveal></InteriorSectionFrame>}
    {sections.map((section, sectionIndex) => {
      const sourceBlocks = section.blocks[0]?.type === 'paragraph' && section.blocks[0].text === section.description ? section.blocks.slice(1) : section.blocks;
      const blocks = section.id === 'section-5' && page.relatedServices?.length ? sourceBlocks.filter(block => !page.relatedServices?.some(link => link.label === block.text)) : sourceBlocks;
      const headings = blocks.filter(block => block.type === 'heading');
      const headingsOnly = headings.length > 0 && blocks.every((block, index) => block.type !== 'heading' || blocks[index + 1]?.type !== 'paragraph');
      const intro = <SectionHeading section={section} />;
      const related = section.id === 'section-5' && <RelatedServices page={page} images={relatedImages} />;
      let content;
      if (section.eyebrow === 'FAQs' || /Common Questions/.test(section.title)) {
        content = <HomeFaqSection id={section.id} intro={intro}>{page.faqs.map((item, index) => <InteriorReveal key={item.question} delay={Math.min(index, 6) * 0.07}><InteriorFaq question={item.question} id={`${page.slug}-${section.id}-faq-${index}`}><LinkedText text={item.answer} links={item.answerLinks} /></InteriorFaq></InteriorReveal>)}</HomeFaqSection>;
      } else if (section.id === 'customer-trust' || /Customer Reviews/.test(section.eyebrow ?? '')) {
        const reviews = blocks.flatMap((block, index) => index % 2 === 0 && blocks[index + 1] ? [{ text: block.text, author: blocks[index + 1].text }] : []);
        content = <HomeReviews page={page} interior={{ section, intro, children: <InteriorReveal><ReviewSlider reviews={reviews} preserveAuthors /></InteriorReveal> }} />;
      } else if (/How It Works|Process|Steps/i.test(section.eyebrow ?? '')) {
        content = <InteriorTimeline section={section} blocks={blocks} />;
      } else if (section.cards?.length) {
        content = <HomeServices page={page} interior={{ section, intro, children: <><div className="interior-structured-grid">{section.cards.map((card, index) => {
          const Icon = /Years|Experience/.test(card.title) && !/Insurance/.test(card.title) ? Clock : /Makes|Models/.test(card.title) ? Car : /Spray|Booth/.test(card.title) ? Factory : /Insurance/.test(card.title) ? ShieldCheck : /Sizes/.test(card.title) ? Layers : Wrench;
          return <InteriorCard className="interior-structured-card" key={card.title} index={index}><span className="capability-icon"><Icon size={24} aria-hidden="true" /></span><h3>{card.title}</h3><p>{card.description}</p></InteriorCard>;
        })}</div>{section.closingNote && <InteriorReveal className="interior-highlight-note"><p><LinkedText text={section.closingNote.text} links={section.closingNote.links} /></p></InteriorReveal>}</> }} />;
      } else if (section.image && headings.length > 0) {
        const groups: { heading: Section['blocks'][number]; paragraphs: Section['blocks'] }[] = [];
        const leading: Section['blocks'] = [];
        blocks.forEach(block => { if (block.type === 'heading') groups.push({ heading: block, paragraphs: [] }); else if (groups.length) groups[groups.length - 1].paragraphs.push(block); else leading.push(block); });
        content = <HomeServices page={page} interior={{ section, intro, children: <>{leading.length > 0 && <InteriorReveal className="section-prose interior-full-column"><Paragraphs blocks={leading} /></InteriorReveal>}<InteriorReveal className="interior-service-banner"><Image src={section.image.src} alt={section.image.alt} fill sizes="(max-width: 1400px) 100vw, 1280px" className="object-cover" /></InteriorReveal><div className="vehicle-grid classic-service-grid interior-card-grid interior-numbered-grid">{groups.map((group, index) => <InteriorCard className="vehicle-card" index={index} key={index} style={{ '--interior-card-span': balancedSpan(groups.length, index) } as CSSProperties}><div className="vehicle-card-copy"><span className="interior-service-number">{index + 1}</span><h3><LinkedText text={group.heading.text} links={group.heading.links} /></h3><Paragraphs blocks={group.paragraphs} /></div></InteriorCard>)}</div>{related}</> }} />;
      } else if (section.image) {
        content = <HomeWorkshop page={page} interior={{ section, reverse: imageIndex++ % 2 === 1, intro, children: <InteriorReveal><ContentGroups blocks={blocks} linked />{related}</InteriorReveal> }} />;
      } else if (sectionIndex === 0 && page.kind !== 'legal') {
        const metrics = blocks.filter(block => /^\d/.test(block.text));
        const assurances = blocks.filter(block => !metrics.includes(block));
        content = <HomeTrust page={page} interior={{ section, intro, children: <InteriorReveal>{metrics.length > 0 && <div className="experience-metrics">{metrics.map(block => { const space = block.text.indexOf(' '); if (block.text.endsWith('Google rating')) return <div key={block.text} className="experience-rating col-span-2 flex items-center justify-start min-[651px]:col-span-1"><GoogleReviewLink /></div>; return <div className="experience-metric" key={block.text}><strong>{block.text.slice(0, space)}</strong><span><LinkedText text={block.text.slice(space + 1)} links={block.links} /></span></div>; })}</div>}<div className="experience-assurances">{assurances.map((block, index) => <div key={index}><LibraryIcon name="check2-circle" /><span><LinkedText text={block.text} links={block.links} /></span></div>)}</div></InteriorReveal> }} />;
      } else if (/Why Choose|Benefits/.test(`${section.eyebrow} ${section.title}`)) {
        content = <HomeDocumentSection section={section} intro={intro} benefits><ContentGroups blocks={blocks} illustrated linked cardImages={section.cardImages} showNumbers={false} />{related}</HomeDocumentSection>;
      } else if (headingsOnly || section.leadIn || /Problems|Issues|What We Check/.test(`${section.eyebrow} ${section.title}`)) {
        content = <HomeProblems page={page} interior={{ section, intro, children: <>{section.leadIn && <InteriorReveal className="section-prose interior-full-column interior-list-lead"><p><LinkedText text={section.leadIn.text} links={section.leadIn.links} /></p></InteriorReveal>}<ul className="interior-checklist">{blocks.map((block, index) => <InteriorListItem key={index} index={index} style={{ '--interior-card-span': balancedSpan(blocks.length, index) } as CSSProperties} className="flex min-h-[78px] items-center gap-3 rounded-lg border border-line bg-[#1e2630] p-4 text-sm leading-relaxed"><span className="interior-check-icon"><Check size={18} aria-hidden="true" /></span><span><LinkedText text={block.text} links={block.links} /></span></InteriorListItem>)}</ul>{section.closingNote && <InteriorReveal className="section-prose interior-full-column interior-closing-note"><p><LinkedText text={section.closingNote.text} links={section.closingNote.links} /></p></InteriorReveal>}{related}</> }} />;
      } else if (headings.length > 0 || /Services/.test(section.eyebrow ?? '')) {
        const groups: { heading: Section['blocks'][number]; paragraphs: Section['blocks'] }[] = [];
        const leading: Section['blocks'] = [];
        blocks.forEach(block => { if (block.type === 'heading') groups.push({ heading: block, paragraphs: [] }); else if (groups.length) groups[groups.length - 1].paragraphs.push(block); else leading.push(block); });
        content = <HomeServices page={page} interior={{ section, intro, children: <>{leading.length > 0 && <InteriorReveal className="section-prose interior-full-column"><Paragraphs blocks={leading} /></InteriorReveal>}{groups.length > 0 && <div className="vehicle-grid classic-service-grid interior-card-grid">{groups.map((group, index) => <InteriorCard className={`vehicle-card vehicle-${index}`} index={index} key={index} style={{ '--interior-card-span': balancedSpan(groups.length, index) } as CSSProperties}><div className="vehicle-card-copy"><h3><LinkedText text={group.heading.text} links={group.heading.links} /></h3><Paragraphs blocks={group.paragraphs} /></div></InteriorCard>)}</div>}{related}</> }} />;
      } else if (page.kind === 'legal' || /Insurance/.test(`${section.eyebrow} ${section.title}`)) {
        content = <HomeDocumentSection section={section} intro={intro} legal={page.kind === 'legal'}><InteriorReveal className="section-prose interior-full-column"><Paragraphs blocks={blocks} /></InteriorReveal>{related}</HomeDocumentSection>;
      } else {
        content = <HomeWorkshop page={page} interior={{ section, intro, children: <InteriorReveal><ContentGroups blocks={blocks} linked />{related}</InteriorReveal> }} />;
      }
      return <div key={section.id}><SectionDivider />{content}</div>;
    })}
  </div>;
}
