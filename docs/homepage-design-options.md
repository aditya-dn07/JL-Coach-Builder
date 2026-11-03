# Six homepage design options

Use **Explore designs** at the top of the homepage to switch layouts instantly. Precision (04) is now the default, following the client's preference. Selection is retained in the URL (`?design=panorama`, for example), so it can be bookmarked or refreshed. Switching returns to the top. The comparison toolbar is a review feature for choosing a final design.

| Option | Hero | Services | Supporting layout |
| --- | --- | --- | --- |
| 01 Signature | Wide two-line headline, workshop image and red quote panel | Two-photo scrolling gallery | Editorial columns and ink reviews |
| 02 Panorama | Large photographic background with inset white headline | Featured service followed by a two-column mosaic | Narrow portrait, wider text and three review columns |
| 03 Workshop | Solid red text panel beside workshop photography | Alternating photo/text stories | Reversed introduction split and light testimonials |
| 04 Precision | Custom workshop exterior/interior composition, source tagline, contact and rating | Numbered accordion explorer with a crossfading photo stage; inline photos on mobile | Editorial introduction, paired testimonials, ruled benefit rows and restrained microanimations |
| 05 Journal | Warm paper background and tall arched portrait | Staggered photo gallery | Narrow portrait, long-form introduction and light reviews |
| 06 Showroom | Wide photo above an overlapping headline and red quote block | Full-width photo/detail rows | Reversed introduction and four-column benefits |

## Typography

Descriptions, lead paragraphs, FAQs, testimonials and footer copy use **16px**, line-height 1.7. Headings remain Outfit 700. Precision's desktop hero scales up to 60px; mobile heroes are 38px. Section headings are 40px desktop / 28px mobile. Precision's service headings scale from 20px to 24px; other comparison options retain their previous sizes.

## Implementation

- `src/components/homepage-designs.tsx`: accessible native select, design context, URL persistence and scroll reset.
- `src/app/designs.css`: six responsive art directions and review toolbar.
- `src/components/services-showcase.tsx`: gallery controls only for scrolling layouts; Precision uses `precision-services.tsx` with an accordion and keyboard navigation. All five source services remain accessible in every option.
- `src/components/homepage-hero.tsx` and `src/app/precision.css`: dedicated Precision composition and microanimations. These replace the earlier generic Precision grid. The other comparison options remain available.
- Existing source content, real photos, supplied logo, quote popup, contact actions and destination links are shared across all six options.

Screenshots are saved as `docs/design-01-signature.jpg` through `docs/design-06-showroom.jpg`.
The refined Precision screenshots and final checks are documented separately in `docs/precision-refinement.md`.

## Verification

Lint, TypeScript, all five existing tests and production build pass. All six options were checked at 320px, 768px and 1440px without horizontal page overflow; their mobile compositions were visually inspected at 390px. Each retains one H1 and five services, with computed service-description text at 16px. The URL selection survives refresh. All six desktop quote actions open the same popup with Name focused and close with Escape. Mobile popup hides the contact bar and restores it after closing. The Journal gallery Next control scrolls correctly. No browser console errors or real form submissions occurred. Six final desktop screenshots were captured from the production build.

Previous Lighthouse reports refer to earlier visual directions; they were not rerun for all six comparison options.
