import { InteriorSectionFrame, InteriorSectionHeader } from '@/components/shared/section-intro';
import type { ReactNode } from 'react';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import { MapPin } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { imageFor, vehicles } from '@/content/catalog';
import { Photo } from '@/components/shared/photo';
import { phoneHref } from '@/config/site';
import { LibraryIcon } from '@/components/shared/library-icon';
import { ContentGroups } from '@/components/content/content-groups';
import { QuoteLink } from '@/components/shared/quote-link';
import { SectionIntro } from '@/components/shared/section-intro';
import Link from 'next/link';
import { getHomeUi } from '@/components/home/home-content';

export function DocumentSections({ page, sectionIds }: { page: ContentPage; sectionIds?: string[] }) {
  const sections = page.sections.filter(
    (s) =>
      sectionIds ? sectionIds.includes(s.id) : (page.kind !== 'home' ||
      !/Experience That Shows|Specialist Repairs, Servicing|Over 100 Five-Star/.test(s.title))
  );
  return (
    <div
      id={sectionIds ? `page-details-${sectionIds[0]}` : 'page-details'}
      className="document-sections"
    >
      {!sectionIds && page.intro.length > 1 && (
        <section
          className="container content-section section-pad"
        >
          <div className="intro-prose">
            {page.intro.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}
      {sections.map((s, i) =>
        /Common Questions/.test(s.title) ? (
          <section id={s.id} className="faq-block section-pad" key={s.id}>
            <div className="container faq-layout" data-reveal>
              <div>
                <p className="kicker">{page.kind === 'home' ? getHomeUi(page, 'faqs') : 'A little clarity'}</p>
                <h2><TwoToneHeading text={s.title} /></h2>
                {page.kind === 'legal' && s.description && <p className="mt-4 text-base leading-7">{s.description}</p>}
                {page.kind === 'home' ? (
                  <>
                    <p className="col-start-1 row-start-3 max-w-[100ch] text-[15px] leading-[1.85] text-[#b9c6d5]">{getHomeUi(page, 'faqIntro')}</p>
                    <p className="self-end min-[801px]:!row-start-3"><Link className="underlink !mt-0" href="/faqs/">{getHomeUi(page, 'viewFaqs')}</Link></p>
                  </>
                ) : (
                  <p>Have a different question?<br /><a className="underlink" href={phoneHref}><LibraryIcon name="telephone" />Talk to our team</a></p>
                )}
              </div>
              <div className="faq-questions">
                {page.faqs.map((f, index) => (
                  <details key={f.question} name={`faq-${page.slug || 'home'}-${s.id}`} open={page.kind !== 'home' && index === 0}>
                    <summary>
                      {f.question}
                      <span className="faq-toggle-icon" aria-hidden="true"><LibraryIcon name="plus-lg" className="faq-plus" /><LibraryIcon name="x-lg" className="faq-close" /></span>
                    </summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section
            key={s.id}
            id={s.id}
            data-section-layout={page.kind === 'legal' ? 'legal' : /Why Choose/.test(s.title) ? 'benefits' : s.blocks.some((block) => block.type === 'heading' && /^1[.)]/.test(block.text)) ? 'process' : i === 0 ? 'intro' : s.blocks.filter((block) => block.type === 'heading').length > 5 ? 'coverage' : i === sections.length - 1 ? 'closing' : 'standard'}
            className={`content-section ${page.kind === 'legal' ? '' : 'section-pad'} ${i % 3 === 1 ? 'tinted' : ''} ${page.kind === 'home' ? `home-content-${s.id}` : ''}`}
          >
            <div className={page.kind === 'legal' ? '' : page.kind === 'home' ? 'container' : 'container editorial-layout'} data-reveal>
              {!(page.kind === 'home' && s.id === 'section-5') && <div className="content-section-header">
                {page.kind !== 'legal' && (
                  <p className="kicker">
                    {page.kind === 'home' ? s.eyebrow : `${String(i + 1).padStart(2, '0')} / Expertise & care`}
                  </p>
                )}
                <h2><TwoToneHeading text={s.title} /></h2>
                {page.kind === 'home' && s.id === 'section-3' && (
                  <a className="underlink section-link" href="#quote"><LibraryIcon name="chat-square-text" />{getHomeUi(page, 'quote')}</a>
                )}
              </div>}
              {page.kind === 'home' && s.id === 'section-4' && (
                <div className="capability-photo">
                  <Photo image={vehicles[2].image} sizes="(max-width: 800px) 100vw, 45vw" />
                  <span><MapPin size={15} aria-hidden="true" /> {getHomeUi(page, 'capabilityLocation')}</span>
                </div>
              )}
              {i === 0 && page.kind !== 'home' && page.kind !== 'legal' && <div className="section-context-photo"><Photo image={imageFor(page.image)} sizes="(max-width: 800px) 100vw, 40vw" /><span>Specialist care at our Christchurch workshop</span></div>}
              <div className={page.kind !== 'home' && page.kind !== 'legal' ? 'editorial-body' : 'section-body'}>
              <ContentGroups
                blocks={page.kind === 'legal' && s.blocks[0]?.type === 'paragraph' && s.blocks[0].text === s.description ? s.blocks.slice(1) : s.blocks}
                illustrated={(page.kind === 'home' && s.id === 'section-5') || (page.kind === 'service' && /Why Choose/.test(s.title))}
                serviceLinks={page.kind === 'service' ? vehicles.find((vehicle) => vehicle.image.id === page.image)?.links : undefined}
                statementCards={page.kind === 'about' && s.id === 'section-2'}
                summaryInHeader={page.kind === 'home' && s.id === 'section-5'}
                showNumbers={!(page.kind === 'home' && s.id === 'section-5')}
                benefitImages={page.kind === 'home' ? getHomeUi(page, 'benefitImages').split('|') : undefined}
                beforeGrid={page.kind === 'home' && s.id === 'section-5'
                  ? <SectionIntro eyebrow={s.eyebrow ?? ''} title={s.title} description={s.blocks.at(-1)!.text} action={<QuoteLink />} />
                  : undefined}
              />
              {page.kind !== 'legal' && !(page.kind === 'home' && ['section-3', 'section-5'].includes(s.id)) && (
                <a className="underlink section-link" href="#quote">
                  <LibraryIcon name="chat-square-text" />{page.kind === 'home' ? getHomeUi(page, 'quote') : 'Get a free quote'}
                </a>
              )}
              </div>
            </div>
          </section>
        )
      )}
    </div>
  );
}

export function HomeDocumentSection({ section, intro, children, benefits = false, legal = false }: { section: ContentPage['sections'][number]; intro: ReactNode; children: ReactNode; benefits?: boolean; legal?: boolean }) {
  return <InteriorSectionFrame id={section.id} className={`home-content-section-${benefits ? '5' : '6'}`}><div className={legal ? 'interior-legal-text' : undefined}><InteriorSectionHeader>{intro}</InteriorSectionHeader><div className="section-body">{children}</div></div></InteriorSectionFrame>;
}
export function HomeFaqSection({ id, intro, children }: { id: string; intro: ReactNode; children: ReactNode }) {
  return <InteriorSectionFrame id={id} className="faq-block"><div className="faq-layout"><InteriorSectionHeader>{intro}</InteriorSectionHeader><div className="faq-questions">{children}</div></div></InteriorSectionFrame>;
}
