# Homepage composition

The two comparison layouts have been combined into one homepage. There is no layout switcher or hidden alternate services implementation.

| Order | Section | Selected presentation |
| --- | --- | --- |
| 1 | Hero | Rounded Studio |
| 2 | Trusted Local Specialists | Rounded Studio |
| 3 | Our Services | Panoramic Classic service cards |
| 4 | Workshop Capability | Rounded Studio |
| 5 | Common Problems We Fix | Shared section |
| 6 | Why Choose Us | Shared section with rounded styling |
| 7 | Insurance Repairs | Shared section |
| 8 | Customer Reviews | Shared review slider |
| 9 | FAQs | Shared accordion |
| 10 | Ready to Book | Rounded Studio |

## Files

- `src/app/(home)/page.tsx`: fixed section order, content loading, and metadata.
- `src/components/home/hero.tsx`: Rounded Studio hero.
- `src/components/home/services-section.tsx`: classic cards for all five vehicle categories.
- `src/components/home/*-section.tsx`: individual content sections.
- `src/components/home/home.css`: retained homepage art direction, without the discarded layout selectors or studio service tabs.
- `src/components/layout/`: shared header and footer with 15px text.

## Checks

Confirm one H1, the section order above, all five service categories and working service links, review controls, FAQs, quote dialog focus/Escape handling, and the footer map/review links. Check desktop and mobile widths. The root README documents automated verification commands.

Historical screenshots in `docs/` describe earlier revisions and do not represent the current homepage composition.
