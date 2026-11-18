import { getSiteContent } from '@/lib/sanity/site-content';

import { ContentImage as Image } from '../shared/content-image';
import sourcePages from '../../content/pages.json';
import { Car, Check, Clock, Factory, Layers, Mail, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { GoogleReviewLink } from '@/components/shared/google-review-link';
import type { CSSProperties } from 'react';
import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ContentPage } from '@/content/schema';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
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
import { QuoteLink } from '@/components/shared/quote-link';
import { serviceCtaSections } from '@/lib/service-ctas';

function balancedSpan(count: number, _index: number, steps = false) {
  const columns = steps ? count : [4, 8, 12].includes(count) || count === 7 ? 4 : 3;
  return 12 / columns;
}

type Section = ContentPage['sections'][number];
function SectionHeading({ section }: { section: Section }) {
  const paragraphs: Section['blocks'] = section.descriptionParagraphs?.length
    ? section.descriptionParagraphs
    : section.description ? [{ type: 'paragraph' as const, text: section.description, links: section.descriptionLinks, richText: section.descriptionRichText }] : [];
  const leadIn = section.leadIn && !paragraphs.some(paragraph => paragraph.text.includes(section.leadIn!.text))
    ? section.leadIn
    : undefined;
  return <>
    {section.eyebrow && <p className="kicker">{section.eyebrow}</p>}
    <h2><TwoToneHeading text={section.title} /></h2>
    {paragraphs.map((paragraph, index) => <p key={index}>
      <LinkedText text={paragraph.text} links={paragraph.links} richText={paragraph.richText} />
      {leadIn && index === paragraphs.length - 1 && <> <LinkedText text={leadIn.text} links={leadIn.links} richText={leadIn.richText} /></>}
    </p>)}
    {!paragraphs.length && leadIn && <p><LinkedText text={leadIn.text} links={leadIn.links} richText={leadIn.richText} /></p>}
  </>;
}
function Paragraphs({ blocks }: { blocks: Section['blocks'] }) {
  return <>{blocks.map((block, index) => block.type === 'heading' ? <h3 key={index}><LinkedText text={block.text} links={block.links} richText={block.richText} /></h3> : <p key={index}><LinkedText text={block.text} links={block.links} richText={block.richText} /></p>)}</>;
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

export async function InteriorClosing({ page }: { page: ContentPage }) {
  const { contentRepository, phoneHref, siteConfig, editorial } = await getSiteContent();
  const cta = page.closingCta;
  if (!cta) return null;
  return <HomeClosing page={page} interior={{
    contact: <aside className="interior-closing-contact"><a href={phoneHref}><Phone aria-hidden="true" /><span>{cta.contactCallLabel || siteConfig.ui.closingCall}<strong>{siteConfig.business.phone}</strong></span></a><a href={cta.emailHref || `mailto:${siteConfig.business.email}`}><Mail aria-hidden="true" /><span>{cta.contactEmailLabel || siteConfig.ui.closingEmail}<strong>{siteConfig.business.email}</strong></span></a></aside>,
    copy: <><p className="kicker">{cta.eyebrow}</p><h2><TwoToneHeading text={cta.title} /></h2><p><LinkedText text={cta.description} richText={cta.descriptionRichText} /></p></>,
    actions: <><a className="button primary" href={cta.quoteHref || siteConfig.ui.quoteTarget}>{cta.quoteLabel}</a><a className="contact-direct interior-secondary-action" href={cta.callHref || phoneHref}>{cta.callLabel}</a></>,
  }} />;
}

export async function InteriorSections({ page }: { page: ContentPage }) {
  const { contentRepository, phoneHref, siteConfig, editorial } = await getSiteContent();
  const targets = await contentRepository.getPages();
  const relatedImages = Object.fromEntries(targets.flatMap(target => {
    const image = target.heroImage ?? target.closingImage;
    return image ? [[`/${target.slug}/`, image]] : [];
  }));
  const sections = page.kind === 'service' || page.kind === 'about' ? page.sections.slice(0, -1) : page.sections;
  let imageIndex = 0;
  const ctaSections = new Set(sections.filter(section => section.ctaAfter).map(section => section.id));
  return <div id="page-details" className="document-sections">
    {page.intro.length > 1 && <InteriorSectionFrame><InteriorReveal className="section-prose interior-full-column">{(page.introduction ?? page.intro.slice(1).map(text => ({ text, links: undefined, richText: undefined }))).map((paragraph, index) => <p key={index}><LinkedText text={paragraph.text} links={paragraph.links} richText={paragraph.richText} /></p>)}</InteriorReveal></InteriorSectionFrame>}
    {sections.map((section, sectionIndex) => {
      const template = sourcePages.find(source => source.id === page.id)?.sections.find(source => source.id === section.id) ?? section;
      const sourceBlocks = section.blocks.slice(section.leadingCopy ?? 0);
      const blocks = section.bodyBlocks ?? sourceBlocks.filter((_block, index) => !section.relatedBlockIndices?.includes(index + (section.leadingCopy ?? 0)));
      const headings = blocks.filter(block => block.type === 'heading');
      const headingsOnly = headings.length > 0 && blocks.every((block, index) => block.type !== 'heading' || blocks[index + 1]?.type !== 'paragraph');
      const intro = <SectionHeading section={section} />;
      const related = section.id === 'section-5' && <RelatedServices page={page} images={relatedImages} />;
      let content;
      if (section.layout === 'faq') {
        content = <HomeFaqSection id={section.id} intro={intro}>{page.faqs.map((item, index) => <InteriorReveal key={item.question} delay={Math.min(index, 6) * 0.07}><InteriorFaq question={item.question} id={`${page.slug}-${section.id}-faq-${index}`}><LinkedText text={item.answer} links={item.answerLinks} richText={item.richText} /></InteriorFaq></InteriorReveal>)}</HomeFaqSection>;
      } else if (section.layout === 'reviews') {
        const reviews = section.reviews ?? blocks.flatMap((block, index) => index % 2 === 0 && blocks[index + 1] ? [{ text: block.text, author: blocks[index + 1].text }] : []);
        content = <HomeReviews page={page} interior={{ section, intro, children: <InteriorReveal><ReviewSlider reviews={reviews} preserveAuthors /></InteriorReveal> }} />;
      } else if (section.layout === 'timeline') {
        content = <InteriorTimeline section={section} blocks={blocks} />;
      } else if (section.layout === 'structured') {
        content = <HomeServices page={page} interior={{ section, intro, children: <><div className="interior-structured-grid">{(section.cards ?? []).map((card, index) => {
          const Icon = ({ clock: Clock, car: Car, factory: Factory, shield: ShieldCheck, layers: Layers, wrench: Wrench } as const)[section.iconNames?.[index] as 'clock'] ?? Wrench;
          return <InteriorCard className="interior-structured-card" key={card.title} index={index}><span className="capability-icon"><Icon size={24} aria-hidden="true" /></span><h3>{card.title}</h3><p><LinkedText text={card.description} richText={card.descriptionRichText} /></p></InteriorCard>;
        })}</div>{section.closingNote && <InteriorReveal className="interior-highlight-note"><p><LinkedText text={section.closingNote.text} links={section.closingNote.links} richText={section.closingNote.richText} /></p></InteriorReveal>}</> }} />;
      } else if (section.layout === 'imageCards' && section.image) {
        const groups: { heading: Section['blocks'][number]; paragraphs: Section['blocks'] }[] = [];
        const leading: Section['blocks'] = [];
        blocks.forEach(block => { if (block.type === 'heading') groups.push({ heading: block, paragraphs: [] }); else if (groups.length) groups[groups.length - 1].paragraphs.push(block); else leading.push(block); });
        content = <HomeServices page={page} interior={{ section, intro, children: <>{leading.length > 0 && <InteriorReveal className="section-prose interior-full-column"><Paragraphs blocks={leading} /></InteriorReveal>}<InteriorReveal className="interior-service-banner"><Image src={section.image.src} caption={section.image.caption} decorative={section.image.decorative} focalPoint={section.image.focalPoint} alt={section.image.alt} fill sizes="(max-width: 1400px) 100vw, 1280px" className="object-cover" /></InteriorReveal><div className="vehicle-grid classic-service-grid interior-card-grid interior-numbered-grid">{groups.map((group, index) => <InteriorCard className="vehicle-card" index={index} key={index} style={{ '--interior-card-span': balancedSpan(groups.length, index) } as CSSProperties}><div className="vehicle-card-copy"><span className="interior-service-number">{index + 1}</span><h3><LinkedText text={group.heading.text} links={group.heading.links} richText={group.heading.richText} /></h3><Paragraphs blocks={group.paragraphs} /></div></InteriorCard>)}</div>{related}</> }} />;
      } else if (section.layout === 'imageSplit') {
        content = <HomeWorkshop page={page} interior={{ section, reverse: imageIndex++ % 2 === 1, intro, children: <InteriorReveal><ContentGroups blocks={blocks} linked />{related}</InteriorReveal> }} />;
      } else if (section.layout === 'trust') {
        const metrics = section.metrics ?? [];
        const assurances = section.assurances ?? [];
        content = <HomeTrust page={page} interior={{ section, intro, children: <InteriorReveal>{metrics.length > 0 && <div className="experience-metrics">{metrics.map(block => { if (block.kind === 'rating') return <div key={block.label} className="experience-rating col-span-2 flex items-center justify-start min-[651px]:col-span-1"><GoogleReviewLink /></div>; return <div className="experience-metric" key={block.label}><strong>{block.value}</strong><span><LinkedText text={block.label} links={block.links} /></span></div>; })}</div>}<div className="experience-assurances">{assurances.map((block, index) => <div key={index}><LibraryIcon name="check2-circle" /><span><LinkedText text={block.text} links={block.links} richText={block.richText} /></span></div>)}</div></InteriorReveal> }} />;
      } else if (section.layout === 'benefits') {
        content = <HomeDocumentSection section={section} intro={intro} benefits><ContentGroups blocks={blocks} illustrated linked cardImages={section.cardImages} showNumbers={false} />{related}</HomeDocumentSection>;
      } else if (section.layout === 'checklist') {
        content = <HomeProblems page={page} interior={{ section, intro, children: <><ul className="interior-checklist">{blocks.map((block, index) => <InteriorListItem key={index} index={index} style={{ '--interior-card-span': balancedSpan(blocks.length, index) } as CSSProperties} className="flex min-h-[78px] items-start gap-3 rounded-lg border border-line bg-[#1e2630] p-4 text-sm leading-relaxed"><span className="interior-check-icon"><Check size={18} aria-hidden="true" /></span><span><LinkedText text={block.text} links={block.links} richText={block.richText} /></span></InteriorListItem>)}</ul>{section.closingNote && <InteriorReveal className="section-prose interior-full-column interior-closing-note"><p><LinkedText text={section.closingNote.text} links={section.closingNote.links} richText={section.closingNote.richText} /></p></InteriorReveal>}{related}</> }} />;
      } else if (section.layout === 'cards') {
        const groups: { heading: Section['blocks'][number]; paragraphs: Section['blocks'] }[] = [];
        const leading: Section['blocks'] = [];
        blocks.forEach(block => { if (block.type === 'heading') groups.push({ heading: block, paragraphs: [] }); else if (groups.length) groups[groups.length - 1].paragraphs.push(block); else leading.push(block); });
        content = <HomeServices page={page} interior={{ section, intro, children: <>{leading.length > 0 && <InteriorReveal className="section-prose interior-full-column"><Paragraphs blocks={leading} /></InteriorReveal>}{groups.length > 0 && <div className="vehicle-grid classic-service-grid interior-card-grid">{groups.map((group, index) => <InteriorCard className={`vehicle-card vehicle-${index}`} index={index} key={index} style={{ '--interior-card-span': balancedSpan(groups.length, index) } as CSSProperties}><div className="vehicle-card-copy"><h3><LinkedText text={group.heading.text} links={group.heading.links} richText={group.heading.richText} /></h3><Paragraphs blocks={group.paragraphs} /></div></InteriorCard>)}</div>}{related}</> }} />;
      } else if (section.layout === 'prose') {
        content = <HomeDocumentSection section={section} intro={intro} legal={page.kind === 'legal'}><InteriorReveal className="section-prose interior-full-column"><Paragraphs blocks={blocks} /></InteriorReveal>{related}</HomeDocumentSection>;
      } else {
        content = <HomeWorkshop page={page} interior={{ section, intro, children: <InteriorReveal><ContentGroups blocks={blocks} linked />{related}</InteriorReveal> }} />;
      }
      return <div key={section.id} className="interior-document-section"><SectionDivider />{content}{ctaSections.has(section.id) && <InteriorReveal className="container flex flex-wrap items-center gap-5 pb-10"><QuoteLink label={section.actions?.quoteLabel} href={section.actions?.quoteHref} /><a className="button" href={section.actions?.callHref || phoneHref}><Phone size={18} aria-hidden="true" />{section.actions?.callLabel || editorial.interface.copy.callWorkshop}</a></InteriorReveal>}</div>;
    })}
  </div>;
}
