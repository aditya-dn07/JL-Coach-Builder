import Image from 'next/image';
import type { ContentPage } from '@/content/schema';
import { phoneHref, siteConfig } from '@/config/site';
import { LibraryIcon } from '@/components/shared/library-icon';
import { ServiceMarquee } from './service-marquee';
import { getHomeUi } from './home-content';

const actionClass = 'inline-flex min-h-12 items-center justify-center gap-[9px] rounded-xl border px-[21px] py-3.5 text-xs font-semibold text-white transition-[transform,background-color,border-color] hover:-translate-y-0.5 max-[560px]:px-[15px] max-[560px]:text-[11px]';
const primaryActionClass = `${actionClass} border-brand bg-brand hover:border-[#d40000] hover:bg-[#d40000]`;

export function HomeHero({ page }: { page: ContentPage }) {
  return (
    <section className="home-hero relative isolate m-4 grid min-h-[650px] grid-cols-1 items-center overflow-hidden rounded-3xl bg-[#101317] text-white min-[801px]:m-5 min-[801px]:min-h-[700px] min-[801px]:grid-cols-[minmax(0,1fr)_270px] min-[1101px]:m-7 min-[1101px]:grid-cols-[minmax(0,1fr)_330px]" aria-labelledby="home-hero-title">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 origin-[30%_100%] scale-[1.38] min-[1500px]:scale-[1.25] min-[1800px]:scale-[1.12] min-[2100px]:scale-100">
        <Image
          src={page.heroImage!.src}
          alt={page.heroImage!.alt}
          fill
          priority
          sizes="100vw"
          // Image alignment: object-top, object-center, object-bottom, or object-[50%_80%].
          className="animate-banner-photo object-cover object-[30%_100%] min-[801px]:object-[50%_100%]"
        />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#071019e8,#0710198c_55%,#07101926),linear-gradient(0deg,#071019dc,transparent_60%)] [mask-image:linear-gradient(to_bottom,transparent,black_18%)]" />
      </div>
      <div className="z-[1] min-w-0 animate-banner-copy px-6 pb-[35px] pt-[55px] min-[801px]:px-[35px] min-[801px]:py-[70px] min-[1101px]:px-[clamp(32px,5vw,80px)]">
        <p className="mb-[25px] max-w-[54ch] text-[10px] uppercase leading-[1.9] tracking-[.17em] text-white [text-shadow:0_2px_6px_#000b] max-[560px]:text-[9px]">{page.eyebrow}</p>
        <h1 id="home-hero-title" className="max-w-[19ch] !text-[clamp(40px,7.5vw,60px)] !leading-[1.03] !tracking-[-.045em] !text-white min-[801px]:max-w-[16ch] min-[801px]:!text-[clamp(46px,5vw,76px)]">{page.title}</h1>
        <p className="mt-[26px] max-w-[48ch] text-sm leading-[1.85] text-[#d6dfe8] max-[560px]:text-[13px]">{page.description}</p>
        <ServiceMarquee services={getHomeUi(page, 'marquee')} ariaLabel={getHomeUi(page, 'marqueeAria')} />
        <div className="mt-[30px] flex flex-wrap gap-3 max-[560px]:gap-2.5">
          <a data-hero-action href="#quote" className={primaryActionClass}><LibraryIcon name="chat-square-text" />{getHomeUi(page, 'quote')}</a>
          <a data-hero-action href={phoneHref} className={`${actionClass} border-[#8b9caf] bg-transparent hover:border-brand hover:bg-[#fa000018]`}><LibraryIcon name="telephone" />{getHomeUi(page, 'callPrefix')}{siteConfig.business.phone}</a>
        </div>
        <div className="mt-[38px] flex gap-[30px] text-[10px] leading-[1.7] text-[#c5cfd9] [&>span]:max-w-[140px] [&_strong]:block [&_strong]:text-[32px] [&_strong]:font-medium [&_strong]:text-white">
          <span><strong>{getHomeUi(page, 'combinedYears')}</strong> {getHomeUi(page, 'combinedYearsLabel')}</span>
          <span><strong>{getHomeUi(page, 'foundedYear')}</strong> {getHomeUi(page, 'foundedLabel')}</span>
        </div>
      </div>
      <div className="mx-6 mb-7 self-end rounded-3xl border border-[#ffffff30] bg-[#16212ce8] p-[22px] min-[801px]:mb-[70px] min-[801px]:ml-0 min-[801px]:mr-8 min-[801px]:p-[27px]">
        <span className="text-[11px] text-brand">{getHomeUi(page, 'trustEyebrow')}</span>
        <strong className="mb-[23px] mt-3.5 block text-[22px] font-medium leading-[1.25] min-[801px]:text-[25px]">{getHomeUi(page, 'trustTitleLine1')}<br />{getHomeUi(page, 'trustTitleLine2')}</strong>
        <a data-hero-action href="#quote" className={`${primaryActionClass} w-full !min-h-11 !px-[18px] !py-3`}><LibraryIcon name="chat-square-text" />{getHomeUi(page, 'quote')}</a>
      </div>
    </section>
  );
}
