# Lighter headings and service showcase

30 October 2026.

## Changes

- Outfit headings now use weight 700 throughout. Hero: 80px desktop / 52px mobile, previously 88px / 56px. Section H2: 48px / 32px, previously 56px / 36px. Card headings: 26px / 22px. Feature service titles: 32px. Inter body copy stays 18px.
- Replaced the long alternating services list with a vehicle selector and a single large photo/content feature. The selected vehicle has a red accent and tint; the feature uses a real source photo, complete source description and original service destination.
- All five panels are rendered in the document; one is visible at a time. No source descriptions, service destinations or vehicle groups removed. The insurance link is retained above the showcase.
- Desktop uses a vertical selector. Mobile uses a locally scrollable horizontal tab strip without making the page overflow. Semantic tab/tabpanel relationships, roving focus, Home/End and arrow-key selection are implemented.
- Photos use their largest existing optimized variant. The original low-resolution service pictures still need client reshoots for large high-density displays, as already recorded in image-report.md.
- The existing quote popup and supplied logo are retained.

## Verification

- `npm run lint`, `npm run typecheck`, `npm run build`: passed.
- Five existing tests passed, including verbatim-source content, original vehicle links, JSON-LD consistency and quote handling.
- Browser checked all five selectors and each original destination link. Home and ArrowDown selection checked on desktop; selecting the final tab and returning Home checked on mobile.
- Desktop 1440px computed styles confirm hero 80px/700 and section H2 48px/700. Mobile 390px confirms hero 52px/700 and H2 32px/700. No page overflow at desktop, tablet 768px or mobile 390px. Tablet motorhome panel and mobile bus panel checked.
- No browser console errors observed. Desktop/mobile screenshots: services-showcase-desktop.jpg and services-showcase-mobile.jpg.
- Lighthouse was not rerun for this focused visual update. Existing Lighthouse reports describe previous builds.
