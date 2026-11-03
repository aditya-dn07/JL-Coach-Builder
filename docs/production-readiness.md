# Production-readiness verification

Verified 31 October 2026 for JL Coachbuilders.

## Automated checks

- Production build passes: 27 content pages pre-rendered, quote API dynamic, custom 404 included.
- TypeScript passes; ESLint passes with no warnings.
- All eight regression tests pass. Coverage includes original service routes, Word-document FAQ/legal content, invalid CMS content, quote validation, same-origin enforcement, honeypot rejection, malformed JSON, size limits, unavailable delivery, mocked success and upstream failure.
- All 27 production URLs return HTTP 200, contain one H1 and have unique titles/descriptions, correct canonicals and full OG/Twitter tags.
- Every content page is indexable and includes Organization, LocalBusiness, WebSite and BreadcrumbList JSON-LD. Service and FAQ entities appear where appropriate.
- Internal page links resolve within the 27-page inventory.
- An unknown URL returns HTTP 404, a Page not found title, noindex and helpful navigation links.
- ICO, SVG, Apple touch icon, manifest, PNG icons, OG artwork, sitemap and robots all return HTTP 200.
- Temporary failure-injection code and routes were removed before the final build.

Detailed route evidence: `route-verification.json`.

## Lighthouse

Mobile Lighthouse 13.6 against the local production homepage, using standard simulated mobile throttling:

| Category | Score |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

LCP: 1.1 seconds. CLS: 0.01. Total blocking time: 30 milliseconds.

The first performance run exposed a route-wide loading fallback that shifted the footer when the real content arrived. Removing the unnecessary fallback resolved the issue. These are measured local results, not guarantees for a future hosting environment or every route. Recheck the actual deployed domain after configuration.

Full report: `lighthouse-production-mobile.json`.

## Browser checks

Homepage, Contact and a long-titled Panel and Paint service page were checked at 360, 768, 1024 and 1440px. No horizontal overflow was observed. Each service page contained one H1. The contact page had no duplicate IDs when both inline and dialog forms were mounted.

Desktop vehicle navigation, mobile opening/closing, Escape dismissal and focus restoration were checked. The skip link moves focus to the main content landmark. The quote dialog focuses its first field and returns focus when closed. Below-fold images use lazy loading and all image slots reserve layout space. CSS and the motion component respect reduced-motion preferences; no OS setting was changed for testing.

Both page and root-layout failures were triggered using a temporary local probe in production. The branded fallback rendered in each case, and retry recovered after the simulated failure was cleared. Page retry refreshes server content and resets its error boundary; global retry reloads the document.

Screenshots: `production-homepage.jpg`, `production-services.jpg`, `production-mobile.jpg`.

## Launch configuration and limits

No mandatory visual asset is missing. Higher-resolution campervan, motorhome-interior, fifth-wheel and bus photographs are optional improvements. Existing Word content and old-site images are used; no fabricated project claims or testimonials were added.

Quote delivery requires a trusted HTTPS webhook. Sanity/Payload integration requires the selected CMS account, schema registration, content import and credentials. The local content provider works without those accounts. No real customer enquiry was sent during verification.

The ordinary Node production build was executed. Docker is not installed in this environment, so the supplied Dockerfile has not been built or run. The Google Maps embed requires network access. A live domain deployment was not performed. No git commands were used during this upgrade.

See `README.md` for run/deploy commands and `cms-integration.md` for CMS configuration.
