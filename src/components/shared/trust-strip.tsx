import { LibraryIcon } from '@/components/shared/library-icon';

const features = [
  { icon: 'tools', title: 'Experienced hands', description: '80+ years of combined craftsmanship' },
  { icon: 'calendar-check', title: 'Locally owned', description: 'Serving Canterbury since 2016' },
  { icon: 'truck', title: 'Every make and model', description: 'Specialist care for your vehicle' },
  { icon: 'people', title: 'One workshop team', description: 'Complete support for the whole job' },
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-[#2d3948] bg-[#121a23]" aria-label="Our workshop at a glance">
      <div className="container grid grid-cols-1 gap-2.5 py-[18px] sm:grid-cols-2 sm:gap-3.5 sm:py-6 min-[1101px]:grid-cols-4">
        {features.map(feature => (
          <div key={feature.title} className="flex min-h-[96px] min-w-0 items-center gap-3.5 rounded-xl border border-[#354354] bg-[#1a2531] p-4 sm:p-[18px]">
            <span className="grid h-[43px] w-[43px] shrink-0 place-items-center rounded-[10px] border border-[#ff8c9533] bg-[#45212c] text-[#ff737e]"><LibraryIcon name={feature.icon} /></span>
            <div className="min-w-0"><h3 className="mb-1.5 text-base font-medium leading-snug tracking-[-.015em]">{feature.title}</h3><p className="text-[11px] leading-[1.65] text-[#b9c6d5]">{feature.description}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
