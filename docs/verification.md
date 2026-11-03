# Verification — 30 October 2026

- `npm run images`: passed. Seven originals, multiple WebP/AVIF widths, blur manifest and OG image generated.
- `npm run test`: four tests passed. Covers data constraints, all 20 vehicle destinations, JSON-LD address and FAQ consistency, safe script serialization, quote validation, same-origin checks (including Next's localhost/127.0.0.1 normalization), unconfigured delivery, mocked successful delivery and upstream failure. No real message sent.
- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm run build`: passed, homepage prerendered successfully; quote API is dynamic.
- Production HTTP homepage: 200. Unconfigured quote route: 503 with direct contact alternatives.
- Browser checks: 390px mobile, 768px tablet, 1280px desktop. One H1, no horizontal overflow, no broken loaded images, no browser console errors observed. Vehicle dropdown, mobile navigation, quote anchor, FAQ expansion and mobile bar visibility checked. Manual visual checks covered hero, services, quote card and tablet layout.
- First mobile Lighthouse: performance 93, accessibility 93, best practices 100, SEO 100. Fixed the identified prohibited ARIA labels and process-number contrast. One repeat run failed because its temporary browser target closed; the next run completed successfully.
- Final mobile Lighthouse: **performance 95, accessibility 100, best practices 100, SEO 100**. See `lighthouse-final.json` for the full evidence, including environment and timing. This measures the local production build; production hosting and third-party services can change results. The later API-only Host-header fix does not change rendered page assets or these scores.

## Remaining launch configuration

- Client confirmation of the 5/4 street/unit number.
- Configure and verify a real HTTPS quote-delivery webhook. Add reCAPTCHA server verification and deployment-level rate limiting when enabling public delivery. Successful delivery was tested with a mock only.
- Optionally configure one GA4/GTM integration.
- Request a vector logo and replacement high-resolution service photography as documented in image-report.md.
- The local implementation retains live absolute links to existing sub-pages. It has not replaced or deployed over the existing website.
