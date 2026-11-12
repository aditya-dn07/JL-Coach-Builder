import type { ReactNode } from 'react';
import { TwoToneHeading } from '@/components/shared/two-tone-heading';
import Image from 'next/image';
import type { ContentPage } from '@/content/schema';
import { phoneHref, siteConfig } from '@/config/site';
import { LibraryIcon } from '@/components/shared/library-icon';
import { ServiceMarquee } from './service-marquee';
import { getHomeUi } from './home-content';

const actionClass = 'inline-flex min-h-12 items-center justify-center gap-[9px] rounded-xl border px-[21px] py-3.5 text-xs font-semibold text-white transition-[transform,background-color,border-color] hover:-translate-y-0.5 max-[560px]:px-[15px] max-[560px]:text-[11px]';
const primaryActionClass = `${actionClass} border-brand bg-brand hover:border-[#d40000] hover:bg-[#d40000]`;

export function HomeBanner({ page, interior }: { page: ContentPage; interior?: { before: ReactNode; description: ReactNode; actions: ReactNode; metrics?: ReactNode; trust?: ReactNode; after?: ReactNode } }) {
  return (
    <section className="home-hero relative isolate m-4 grid min-h-[650px] grid-cols-1 items-center overflow-hidden rounded-3xl bg-[#101317] text-white min-[801px]:m-5 min-[801px]:min-h-[700px] min-[801px]:grid-cols-[minmax(0,1fr)_270px] min-[1101px]:m-7 min-[1101px]:grid-cols-[minmax(0,1fr)_330px]" aria-labelledby="home-hero-title">
      <div className="absolute inset-x-0 -top-24 -z-10 h-[440px] min-[801px]:inset-0 min-[801px]:h-auto">
        <div className="absolute inset-0">
        {page.heroImage && <Image
          src={page.heroImage!.src}
          alt={page.heroImage!.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
          // Serve the original upload without recompression; align the crop right-center.
          className="object-cover object-right"
        />}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#071019a6,#07101926),linear-gradient(to_bottom,transparent_50%,#101317)] min-[801px]:bg-[linear-gradient(90deg,#071019e8,#0710198c_55%,#07101926),linear-gradient(0deg,#071019dc,transparent_60%)] min-[801px]:[mask-image:linear-gradient(to_bottom,transparent,black_18%)]" />
      </div>
      <div className="z-[1] min-w-0 animate-banner-copy px-6 pb-[35px] pt-[55px] min-[801px]:px-[35px] min-[801px]:py-[70px] min-[1101px]:px-[clamp(32px,5vw,80px)]">
        {interior?.before}<p className="mb-2.5 max-w-[54ch] pt-2.5 text-[10px] uppercase leading-[1.9] tracking-[.17em] text-white [text-shadow:0_2px_6px_#000b] max-[560px]:text-[9px]">{page.eyebrow}</p>
        <div data-hero-text className="max-w-[19ch] font-display text-[clamp(32px,7.5vw,60px)] font-semibold min-[801px]:max-w-[16ch] min-[801px]:text-[clamp(46px,5vw,76px)]">
          <h1 id="home-hero-title" className="max-w-[19ch] !text-[clamp(32px,7.5vw,60px)] !leading-[1.03] !tracking-[-.045em] !text-white min-[801px]:max-w-[16ch] min-[801px]:!text-[clamp(46px,5vw,76px)]">{interior ? <TwoToneHeading text={page.title} /> : page.title}</h1>
          <p className="mt-[26px] w-full font-sans text-sm font-normal leading-[1.85] text-[#d6dfe8] max-[560px]:text-[13px]">{interior?.description ?? page.description}</p>
        </div>
        {!interior && <ServiceMarquee services={getHomeUi(page, 'marquee')} ariaLabel={getHomeUi(page, 'marqueeAria')} />}
        <div className="mt-[30px] grid grid-cols-1 gap-3 min-[481px]:flex min-[481px]:flex-wrap max-[560px]:gap-2.5">
          {interior ? interior.actions : <><a data-hero-action href="#quote" className={primaryActionClass}><LibraryIcon name="chat-square-text" />{getHomeUi(page, 'quote')}</a>
          <a data-hero-action href={phoneHref} className={`${actionClass} border-[#8b9caf] bg-transparent hover:border-brand hover:bg-[#fa000018]`}><LibraryIcon name="telephone" />{getHomeUi(page, 'callPrefix')}{siteConfig.business.phone}</a></>}
        </div>
        {interior ? interior.metrics : <div className="mt-[38px] flex gap-[30px] text-[10px] leading-[1.7] text-[#c5cfd9] [&>span]:max-w-[140px] [&_strong]:block [&_strong]:text-[32px] [&_strong]:font-medium [&_strong]:text-white">
          <span><strong>{getHomeUi(page, 'combinedYears')}</strong> {getHomeUi(page, 'combinedYearsLabel')}</span>
          <span><strong>{getHomeUi(page, 'foundedYear')}</strong> {getHomeUi(page, 'foundedLabel')}</span>
        </div>}{interior?.after}
      </div>
      {(!interior || interior.trust) && <div className="mx-6 mb-7 self-end rounded-3xl border border-[#ffffff30] bg-[#16212ce8] p-[22px] min-[801px]:mb-[70px] min-[801px]:ml-0 min-[801px]:mr-8 min-[801px]:p-[27px]">
        {interior ? interior.trust : <><span className="text-[11px] text-brand">{getHomeUi(page, 'trustEyebrow')}</span>
        <strong className="mb-[23px] mt-3.5 block text-[22px] font-medium leading-[1.25] min-[801px]:text-[25px]">{getHomeUi(page, 'trustTitleLine1')}<br />{getHomeUi(page, 'trustTitleLine2')}</strong>
        <a data-hero-action href="#quote" className={`${primaryActionClass} w-full !min-h-11 !px-[18px] !py-3`}><LibraryIcon name="chat-square-text" />{getHomeUi(page, 'quote')}</a></>}
      </div>}
    </section>
  );
}

export function HomeBannerActions({ quoteLabel, callLabel, afterQuote }: { quoteLabel: string; callLabel: string; afterQuote?: ReactNode }) {
  return <><a data-hero-action href="#quote" className={primaryActionClass}><LibraryIcon name="chat-square-text" />{quoteLabel}</a>{afterQuote}<a data-hero-action href={phoneHref} className={`${actionClass} border-[#8b9caf] bg-transparent hover:border-brand hover:bg-[#fa000018]`}><LibraryIcon name="telephone" />{callLabel}</a></>;
}
