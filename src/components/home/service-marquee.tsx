export function ServiceMarquee({ services, ariaLabel }: { services: string; ariaLabel: string }) {
  return <div className="group mt-[18px] flex w-full min-w-0 max-w-[480px] items-center" tabIndex={0} role="region" aria-label={ariaLabel}>
    <div className="min-w-0 flex-1 overflow-hidden">
      <span className="sr-only">{services}</span>
      <div className="flex w-max animate-services-scroll text-[13px] leading-[1.8] text-white group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none" aria-hidden="true">
        {[0, 1].map(copy => <span className={`shrink-0 whitespace-nowrap motion-reduce:whitespace-normal ${copy ? 'motion-reduce:hidden' : ''}`} key={copy}>{services} ·&nbsp;</span>)}
      </div>
    </div>
  </div>;
}
