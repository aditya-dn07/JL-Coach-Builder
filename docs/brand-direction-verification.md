# New brand-led visual direction

30 October 2026. This is a substantial visual change from the previous split-text/photo design.

## Composition

- Full-width utility/navigation header with real location, email and phone details.
- A two-line, full-width hero headline above a large workshop photograph and a solid red quote callout. The quote callout reuses a real source paragraph; it opens the existing popup and does not introduce another form. Phones receive a prominent quote button before the photograph.
- A browsable service-photo gallery replaces the tabbed selector. All five services, full descriptions and original destinations are visible in the document. Previous/Next controls and native horizontal scrolling reveal the gallery.
- An editorial What We Do layout, red factual values, ink testimonials section and solid red closing CTA create a stronger visual rhythm. Marketing copy, source section order, source photos, supplied logo and existing quote endpoint remain.
- Outfit headings remain weight 700; body text remains Inter 18px. No generated photographs, floating glass cards or decorative entrance animations are added. Native smooth gallery scrolling respects reduced motion.

## Checks

- Lint, TypeScript, five tests and production build pass.
- Desktop hero inspected at 1440px: full-width headline and image/red callout stage fit without page overflow.
- Desktop gallery: five articles present; Next moved the rail one card, Previous became available, and the retained quote popup opened with Name focused and dismissed with Escape.
- Mobile 390px: headline remains 52px; prominent quote action opens the popup; no horizontal page overflow observed.
- Ink review background, white heading/text and red closing CTA verified in the browser.
- Anchor spacing accounts for the taller desktop header and compact mobile header.

Final production checks at 320px and 390px show no horizontal page overflow; the hero phone link is white against red. Tablet 768px and desktop 1440px were also inspected. The mobile headline is 52px.

Final local mobile Lighthouse: **93 performance, 100 accessibility, 100 best practices, 100 SEO**. Report: `lighthouse-brand-direction.json`. Removing runtime SVG blur placeholders reduced the measured hero image render delay to 67ms. The header scroll progress uses a passive native scroll listener rather than shipping Framer Motion for this single effect.

Production screenshots: `brand-direction-hero-desktop.jpg`, `brand-direction-services-desktop.jpg`, `brand-direction-hero-mobile.jpg`. Earlier screenshot/report files describe previous visual directions. No real messages were submitted and no deployment was performed.
