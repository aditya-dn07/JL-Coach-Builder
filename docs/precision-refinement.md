# Precision refinement

Precision (option 04) is now the default homepage. Existing comparison options remain available, including Signature (01), which the client also mentioned positively.

## Design

- Dedicated hero component with a real workshop exterior, an interior detail photograph, source tagline, phone/quote actions, Google rating and ruled capability links. The previous generic quote strip is removed from this direction.
- Numbered services explorer replaces the three-column card grid. On desktop, selecting a row changes a large image stage and reveals its original description/link. On mobile, the photo appears inside the expanded row. The active row has a red rule and a solid toggle, with no floating cards or glass effects.
- Editorial introduction, two-column testimonials, ruled workshop-benefit rows and a cream final CTA with a red edge establish a consistent composition.
- Outfit headings remain weight 700. Descriptions stay 16px. Hero headings scale up to 60px desktop / 38px mobile. Supporting hero copy remains on desktop and in What We Do; mobile prioritises the quote action and photography.

## Microanimations

- Service images crossfade over 320ms. Active rules extend over 280ms; newly opened details fade up 6px.
- Buttons and service links shift their arrow 2px; the Services discovery arrow responds vertically. Navigation has a short underline transition.
- Supporting sections reveal once with a 16px fade-up over 400ms. Setup starts on the first scroll, keeping measurements off the initial render. Initial viewport content, including the hero, is never hidden. Position reads are batched before reveal classes are applied to avoid repeated synchronous layouts.
- `prefers-reduced-motion` disables transitions, animations and hover movement. The observer also skips or clears pending reveals when reduced motion is requested. No auto-advancing services, parallax, looping counters or additional motion dependency.

## Verification

Lint, TypeScript, five existing tests and production build pass. Desktop/mobile service selection, End keyboard navigation to Bus, accordion collapse, visible photo changes and 16px descriptions were checked. The quote popup opens with Name focused, closes with Escape and hides the mobile contact bar while open. Signature remains available and renders one H1 when selected.

Final production checks cover 320px, 390px, 768px and 1440px: no horizontal page overflow, one H1 and computed service descriptions at 16px. The service reveal becomes visible on scroll and the photo stage remains sticky. ArrowDown selects Campervan; End selects Bus; clicking an open row collapses it. Final production mobile popup and console checks passed with no errors or real messages submitted.

Final local mobile Lighthouse: **93 performance, 100 accessibility, 100 best practices, 100 SEO**. LCP 3.1s, total blocking time 80ms, layout shift 0. Report: `lighthouse-precision-refined.json`. Earlier reports/scores describe previous designs.

Production screenshots: `precision-refined-hero-desktop.jpg`, `precision-refined-services-desktop.jpg`, `precision-refined-hero-mobile.jpg`. The comparison's `design-04-precision.jpg` is updated as well. Temporary preview server stopped after QA. No deployment, dependency changes or CMS changes.
