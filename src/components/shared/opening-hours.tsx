import { siteConfig } from '@/config/site';

// Dates in the config are calendar dates, not instants to convert to NZ daylight time.
export const formatOpeningDate = (value: string) => new Intl.DateTimeFormat('en-NZ', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T12:00:00Z`));

export function OpeningHours({ showExceptions = true }: { showExceptions?: boolean } = {}) {
  const business = siteConfig.business;
  return <div className="mt-6 grid gap-3 text-sm leading-relaxed">
    <h3 className="font-semibold">Opening hours</h3>
    {business.openingHoursSpecification.map((hours, index) => <p key={index}>
      {hours.dayOfWeek?.map(day => day.split('/').at(-1)).join(', ')}: {hours.opens}–{hours.closes}
    </p>)}
    {showExceptions && business.specialOpeningHoursSpecification.length > 0 && <h3 className="font-semibold">Holiday opening-hour exceptions</h3>}
    {showExceptions && business.specialOpeningHoursSpecification.map((hours, index) => <p key={index}>
      {hours.validFrom && formatOpeningDate(hours.validFrom)}{hours.validThrough && hours.validThrough !== hours.validFrom && ` – ${formatOpeningDate(hours.validThrough)}`}: {hours.opens === hours.closes ? 'Closed' : `${hours.opens}–${hours.closes}`}
    </p>)}
  </div>;
}
