# Content and typography update verification

30 October 2026. This supersedes the earlier design checks in verification.md for the current homepage.

- Fresh public homepage HTML matches the original capture byte-for-byte. Full comparison and explicit client wording exceptions: content-parity.md.
- Five tests pass. They check source paragraph parity for all five What We Do paragraphs, five service descriptions, four Why Choose Us descriptions and six testimonials; preserved vehicle URLs; consistent FAQ/address structured data; safe JSON serialization; quote validation and mocked delivery handling. The four-field form is accepted without Vehicle type.
- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed, zero errors.
- `npm run build`: passed. The homepage is prerendered; the existing quote API stays dynamic.
- Browser checks: desktop 1280/1440, tablet 768, mobile 390, plus a narrow 320 check. Source-order section inspection confirms Hero → What We Do → Services → Repairs/Difference → FAQs → Reviews → Why Choose Us → Parts CTA → Map → Footer. One H1.
- Desktop computed typography: 88px hero, 56px section H2, 24px lead, 18px body, 40px service titles, 56px static fact values. Mobile: 56px hero, 36px section H2, 20px lead, 18px body. Eyebrows are the explicit 13px exception; navigation/sticky controls use at least 16px.
- Desktop What We Do uses the 5/12–7/12 split, four ticks in two columns and a plain offset red block. Mobile stacks the content; the fact row stacks at the narrowest widths to avoid overflow.
- Header logo: 300px desktop, 275px after scrolling, up to 235px on phones with a narrower-width safeguard; footer logo up to 360px. All preserve transparency and intrinsic aspect ratio.
- Mobile menu, FAQ expansion, quote anchor, four visible quote fields and hidden mobile contact bar were checked. Browser form submission returns the honest unconfigured-delivery message; no real customer message sent. No browser console errors observed.
- Final production Lighthouse report: lighthouse-content-update.json. Local scores: 100 performance, 100 accessibility, 100 best practices, 100 SEO. This report measures the exact final build after all narrow-width and body-text refinements; scores depend on test environment and hosting.

## Remaining configuration

Confirm the 5/4 street/unit number with the client. Real quote delivery still requires a trusted HTTPS webhook, reCAPTCHA server verification and deployment-level rate limiting. No CMS or production website was edited or deployed.
