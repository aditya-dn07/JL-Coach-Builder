import type { ReactNode } from 'react';
import { TwoToneHeading } from './two-tone-heading';

type Props = { eyebrow?: string; title: string; description?: string; action?: ReactNode };

export function SectionIntro({ eyebrow, title, description, action }: Props) {
  return (
    <div data-section-intro className="mb-10 flex flex-col gap-7 min-[801px]:flex-row min-[801px]:items-end min-[801px]:gap-12">
      <div className="grid min-w-0 flex-1 gap-5">
        {eyebrow && <p className="kicker !m-0">{eyebrow}</p>}
        <h2 className="!m-0 text-balance !text-[clamp(32px,3.4vw,48px)] !leading-[1.12] !tracking-[-.035em]"><TwoToneHeading text={title} /></h2>
        {description && <p data-intro-description className="max-w-[78ch] text-[15px] leading-[1.85] text-[#b9c6d5]">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 justify-start min-[801px]:justify-end">{action}</div>}
    </div>
  );
}

export function InteriorSectionFrame({ children, id, className = '', surface = '', as: Tag = 'section' }: { children: ReactNode; id?: string; className?: string; surface?: string; as?: 'section' | 'div' | 'nav' }) {
  return <Tag id={id} className={`section-pad interior-section-frame ${className}`}><div className={`container ${surface}`}>{children}</div></Tag>;
}
export function InteriorSectionHeader({ children }: { children: ReactNode }) {
  return <header className="interior-section-header">{children}</header>;
}
