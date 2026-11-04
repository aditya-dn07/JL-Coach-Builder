import Link from 'next/link';
import Image from 'next/image';
import { Check, MapPin, ShieldCheck, Truck, Wrench } from 'lucide-react';
import type { ContentPage } from '@/content/schema';
import { AnimatedBenefitCard } from '@/components/content/animated-benefit-card';
import type { ReactNode } from 'react';

type Props = {
  blocks: ContentPage['sections'][number]['blocks'];
  illustrated?: boolean;
  serviceLinks?: { label: string; href: string }[];
  statementCards?: boolean;
  summaryInHeader?: boolean;
  beforeGrid?: ReactNode;
  showNumbers?: boolean;
};

export function ContentGroups({ blocks, illustrated = false, serviceLinks = [], statementCards = false, summaryInHeader = false, beforeGrid, showNumbers = true }: Props) {
  const icons = [ShieldCheck, Truck, MapPin, Wrench];
  const normalizeService = (text: string) => text.toLowerCase().replace(/&/g, 'and').replace(/alterations?/g, 'alteration').replace(/fifth wheels?/g, 'fifthwheel').replace(/services?|in christchurch/g, '').replace(/[^a-z]/g, '');
  const groups: { title: string; text: string[] }[] = [];
  const leading: string[] = [];
  const presentationBlocks = statementCards ? blocks.flatMap((block) => {
    const colon = block.text.indexOf(':');
    if (block.type === 'paragraph' && colon > 0 && colon < 45) return [
      { type: 'heading' as const, text: block.text.slice(0, colon) },
      { type: 'paragraph' as const, text: block.text.slice(colon + 1).trim() },
    ];
    return [block];
  }) : blocks;
  presentationBlocks.forEach((b) => {
    if (b.type === 'heading') groups.push({ title: b.text, text: [] });
    else if (groups.length) groups[groups.length - 1].text.push(b.text);
    else leading.push(b.text);
  });
  const lastGroup = groups.at(-1);
  const closingParagraph = (illustrated || statementCards) && lastGroup && lastGroup.text.length > 1
    ? lastGroup.text.pop()
    : undefined;
  const backgroundPool = ['insurance', 'models', 'canterbury', 'maintenance-v2'];
  const usedBackgrounds = new Set<string>();
  const backgrounds = groups.map((group, index) => {
    const preferred = /all makes|models/i.test(group.title) ? 'models'
      : /local|trusted|canterbury/i.test(group.title) ? 'canterbury'
      : /maintenance|prevention/i.test(group.title) ? 'maintenance-v2'
      : /insurance|experienced/i.test(group.title) ? 'insurance'
      : backgroundPool[index % backgroundPool.length];
    const chosen = usedBackgrounds.has(preferred)
      ? backgroundPool.find((background) => !usedBackgrounds.has(background)) ?? preferred
      : preferred;
    usedBackgrounds.add(chosen);
    return chosen;
  });
  return (
    <>
      <div className="section-prose">
        {leading.map((p, i) => {
          const short = p.length < 85 && !/[.!?:]$/.test(p);
          if (short && i > 0 && leading[i - 1].length < 85 && !/[.!?:]$/.test(leading[i - 1]))
            return null;
          if (short) {
            const items = leading
              .slice(i)
              .slice(
                0,
                leading.slice(i).findIndex((t) => t.length >= 85 || /[.!?:]$/.test(t)) < 0
                  ? undefined
                  : leading.slice(i).findIndex((t) => t.length >= 85 || /[.!?:]$/.test(t))
              );
            return (
              <ul key={i}>
                {items.map((item, j) => {
                  const destination = serviceLinks.find((link) => normalizeService(link.label) === normalizeService(item));
                  return <li key={j}>{destination
                    ? <Link className="list-service-button" href={destination.href}><Check className="list-check" size={16} aria-hidden="true" /><span>{item}</span></Link>
                    : <><Check className="list-check" size={16} aria-hidden="true" /><span>{item}</span></>}</li>;
                })}
              </ul>
            );
          }
          return <p key={i}>{p}</p>;
        })}
      </div>
      {beforeGrid}
      {groups.length > 0 && (
        <div className="detail-grid">
          {groups.map((g, i) => {
            const Icon = icons[i % icons.length];
            const cardContent = <>
              {illustrated && <Image className="benefit-background" src={`/images/why-choose/${backgrounds[i]}.webp`} alt="" fill sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 30vw" />}
              {illustrated && <span className="capability-icon"><Icon size={25} aria-hidden="true" /></span>}
              {showNumbers && <span className="detail-index">{String(i + 1).padStart(2, '0')}</span>}
              <h3>{g.title}</h3>
              {g.text.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </>;
            return illustrated
              ? <AnimatedBenefitCard key={g.title} index={i}>{cardContent}</AnimatedBenefitCard>
              : <article className={g.text.length ? undefined : 'compact-detail'} key={g.title}>{cardContent}</article>;
          })}
        </div>
      )}
      {!summaryInHeader && closingParagraph && <p className="capability-note">{closingParagraph}</p>}
    </>
  );
}
