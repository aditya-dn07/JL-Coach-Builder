# JL Coachbuilders

A Next.js website for JL Coachbuilders in Christchurch, with 27 content pages, one curated homepage, a project gallery, and a validated quote form.

## Stack

- Next.js 15 App Router, React 19, and TypeScript
- Tailwind CSS 3 for layout, spacing, typography, and responsive controls
- Feature CSS for the homepage composition, editorial layouts, image treatments, and animations
- Motion, Lucide React, and Bootstrap Icons
- Zod for content and quote validation
- Sanity Studio with source-backed JSON fallbacks, plus the existing optional Payload adapter
- Self-hosted Outfit and Inter fonts; optimized images through `next/image`

## Getting started

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). To choose another port:

```sh
npm run dev -- --port 3011
```

For quote delivery or a remote CMS, copy `.env.example` to `.env.local` and configure the required values. Local content runs without external accounts.

## Project structure

The tree below lists application files and key supporting folders. Asset and documentation folders are grouped to keep it readable; generated build output and installed dependencies are omitted.

```text
src/
  app/
    (home)/
      page.tsx                  Homepage composition and metadata; URL: /
    (content)/
      [slug]/page.tsx            Services, about, contact, gallery, and legal routes
    (resources)/
      reviews/page.tsx           Customer reviews; URL: /reviews/
      faqs/page.tsx              All existing FAQ topics; URL: /faqs/
      quote-result/page.tsx      Quote submission status; URL: /quote-result/
    api/quote/route.ts          Server-side quote validation and delivery
    layout.tsx                  Global fonts, styles, header, footer, and effects
    error.tsx                   Route error boundary
    global-error.tsx            Root error boundary
    not-found.tsx               404 page
    robots.ts
    sitemap.ts
  components/
    home/
      banner.tsx                Active homepage banner (copy of the original hero)
      hero.tsx                  Original hero preserved for reference
      trust-section.tsx
      services-section.tsx
      workshop-section.tsx
      problems-section.tsx
      reviews-section.tsx
      closing-section.tsx
      service-marquee.tsx
      home-content.ts           Typed homepage section lookup
      home.css                  Homepage-specific visual compositions
    layout/
      site-header.tsx
      header-navigation.tsx     Responsive navigation and keyboard dismissal
      mobile-action-bar.tsx     Mobile contact actions
      site-footer.tsx
      back-to-top.tsx            Floating scroll-to-top arrow
      footer/
        footer-contact.tsx      Contact list and supplied Google Maps embed
        footer-links.tsx
      motion-effects.tsx
      interaction-effects.tsx
    content/
      interior-hero.tsx
      interior-sections.tsx
      document-sections.tsx
      content-groups.tsx
      animated-benefit-card.tsx
      related-services.tsx
      content.css               Shared interior-page presentation
    contact/
      quote-form.tsx
      quote-modal.tsx
      contact-section.tsx
      closing-contact.tsx
      contact-panel.css
    gallery/
      project-gallery.tsx       Gallery, pagination, and image dialog
    faq/
      faq-page.tsx               FAQ resource page presentation
    reviews/
      reviews-page.tsx           Reviews resource page presentation
    shared/
      photo.tsx
      library-icon.tsx
      two-tone-heading.tsx
      quote-link.tsx
      google-review-link.tsx    Google badge shared by trust, reviews, and footer
      google-review-badge.tsx
      opening-hours.tsx
      resource-page.tsx
      review-card.tsx
      section-divider.tsx
      section-intro.tsx
      trust-strip.tsx
      customer-reviews.tsx
      review-slider.tsx
      sections.css               Shared editorial, form, and section styling
      icons.css                  Icon and FAQ state styling
    seo/
      page-structured-data.tsx
    errors/
      retry-panel.tsx
  config/
    site.json                   Business details, canonical domain, and social links
    site.ts                     Derived phone, directions, map, and review URLs
    navigation.ts               Header and footer navigation
  content/
    pages.json                  Migrated page text, SEO fields, sections, and FAQs
    quote-form.json             Form labels and response messages
    schema.ts                   Validated ContentPage contract
    repository.ts               Local / Sanity / Payload content loading
    catalog.ts                  Vehicle navigation and image references
    banners.ts                  Banner content helpers
    feedback.ts                 DOCX testimonial pairing
  data/
    image-manifest.json         Image references and dimensions
    site-gallery.json           Gallery image data
    legacy-content.json         Legacy source content
    site.data.ts                Validated site data access
    site.schema.ts              Site data schema
  cms/
    adapters.ts                 Remote provider adapters
    model.ts                    Shared CMS model
    payload/collection.ts       Payload collection definition
    sanity/schema.ts            Sanity document schema
  lib/
    brand-fonts.ts              Self-hosted font configuration
    metadata.ts                 Page metadata helpers
    jsonld.ts                   Structured data helpers
    quote.ts                    Quote validation
    quote-conversion.ts         Quote conversion event helpers
    service-ctas.ts             Service call-to-action helpers
    motion.ts                   Interior duration and easing tokens
  middleware.ts                 Request middleware
  styles/
    globals.css                 Tailwind directives, reset, and base tokens
    theme.css                   Dark theme
    refinements.css             Shared editorial spacing and action treatments
public/
  fonts/                        Self-hosted font files and licenses
  images/                       Original assets and optimized variants
  icons/                        Favicons and app icons
  site.webmanifest              Web app manifest
scripts/
  check-routes.mjs               Rendered route verification
  generate-brand-assets.tsx      Brand and icon asset generation
  process-images.mjs            Image optimization
  import-document.mjs           Document content import
  import-site-gallery.mjs        Gallery import
  report-content-gaps.mjs        Content gap reporting
  banner-generation.json        Banner generation metadata
tests/                          Content, CMS, SEO, build, and quote regression tests
docs/                          CMS setup, source inventory, and verification notes
Changes/                        Dated change notes
JL CoachBuilder Content.docx    Source content document
.env.example                    Environment variable template
.gitignore                      Git exclusions
.dockerignore                   Docker build exclusions
.prettierrc.json                 Code formatting configuration
Dockerfile                      Standalone Node deployment image
eslint.config.mjs               ESLint configuration
next-env.d.ts                   Generated Next.js TypeScript declarations
next.config.ts                  Next.js build, image, and header configuration
package.json                    Dependencies and npm scripts
package-lock.json               Locked dependency versions
postcss.config.mjs              PostCSS configuration
tailwind.config.ts              Tailwind tokens, breakpoints, and animations
tsconfig.json                   TypeScript configuration and import aliases
vercel.json                     Vercel deployment configuration
README.md                       Project documentation
```

`node_modules/`, `.next/`, `.next-production/`, and `tsconfig.tsbuildinfo` are generated locally and should not be edited manually.

`(home)` and `(content)` are Next.js route groups. Their names organize files without appearing in URLs. The homepage remains `/`; `app/home/page.tsx` would create a separate `/home` URL. Shared document pages remain data driven through `[slug]`, so their original URLs and metadata are preserved.

## Component and styling conventions

- Keep route files focused on content loading, metadata, and composing feature components.
- Put a component in its feature folder. Put it in `shared/` only when more than one feature uses it.
- Use the `@/` alias for imports across features; use relative imports within a feature.
- Prefer Tailwind utilities for new markup. Header, footer, review badge, and trust cards use utilities; header and footer text use the `text-chrome` token (15px), with 12px text for the top information line and footer legal row.
- Keep custom CSS for the retained art direction and interactions that need descendant selectors or coordinated states. Home and interior CSS are imported by their own route groups.
- Global CSS belongs in `styles/`. Feature CSS belongs next to its components. Edit the owning rule instead of adding another override file.
- Declare complete Tailwind class names in source. Do not construct utility names dynamically.
- Keep browser state and event handlers in client components. Content loading, metadata, and structured data stay server rendered.

Tailwind tokens are defined in `tailwind.config.ts`. The `nav` breakpoint (1001px) controls desktop navigation, and `wide` (1401px) enables the larger header composition.

### Change the homepage banner image

Edit the home entry's `heroImage` in `src/content/pages.json`. The homepage renders `HomeBanner`; the original `HomeHero` remains in `hero.tsx` for reference. The banner uses Next.js `Image` with Tailwind positioning:

```tsx
<Image
  src={page.heroImage.src}
  alt={page.heroImage.alt}
  fill
  priority
  sizes="100vw"
  unoptimized
  className="object-cover object-right"
/>
```

Replace `object-center` with `object-bottom` or `object-top` to change alignment. For a precise crop, use `object-[50%_80%]` (horizontal and vertical position), or responsive positioning such as `object-bottom md:object-center`. Keep just one base positioning class. Change `src` to use another image from `public/images/`.

The banner has no extra scale or zoom animation. `object-cover object-right` aligns the image right-center and crops only as needed to fill the existing section. `unoptimized` serves the original uploaded PNG without resizing or recompression.

At widths up to 800px, the copy overlays the same original image. The mobile image frame is 440px tall and shifted up 96px to keep the building sign above the text, fading into the section background. At widths up to 480px, the quote and call buttons stack at full width. The desktop background composition remains unchanged.

The hero and scrolling services strip use Tailwind for layout, colors, spacing, responsive behavior, and hover states. Their animation definitions live in `tailwind.config.ts`; the previous hero and marquee CSS rules have been removed.

## Homepage composition

The homepage reviews CTA opens `/reviews/`, which presents the existing customer testimonials and a link to the complete Google collection. The Google rating badge is commented out only in the homepage reviews introduction; it remains available in the footer, trust section, and reviews page. The homepage FAQ CTA opens `/faqs/`, which groups existing questions by topic and removes duplicate questions. All FAQ accordions on that page start closed. Both resource routes are included in the sitemap and footer links.

The homepage has one fixed composition with no layout selector. Rounded Studio supplies the hero, Trusted Local Specialists, Workshop Capability, and Ready to Book sections. Our Services uses the Panoramic Classic cards. Shared sections follow in this order:

1. Hero
2. Trusted Local Specialists
3. Our Services
4. Workshop Capability
5. Common Problems We Fix
6. Why Choose Us
7. Insurance Repairs
8. Customer Reviews
9. FAQs
10. Ready to Book

Edit the composition in `src/app/(home)/page.tsx` and individual sections in `src/components/home/`. The classic services grid has its own 12px card and 6px control radius tokens, while the surrounding page retains the rounded presentation.

## Common changes

| Change | Location |
| --- | --- |
| Homepage section | `src/components/home/*-section.tsx` |
| Homepage text and FAQs | `src/content/pages.json` (home entry) |
| Service or legal page text | `src/content/pages.json` (matching slug) |
| Logo | `src/data/image-manifest.json` and `public/images/` |
| Header/footer links | `src/config/site.json` (`navigation`) |
| Phone, email, address, social links | `src/config/site.json` |
| Footer map and Google review link | `src/config/site.json` (`ui`, `images`) |
| Gallery photographs | `src/data/site-gallery.json` |
| Quote labels and messages | `src/content/quote-form.json` |

## Validation

```sh
npm run typecheck
npm test
npm run build
```

The build runs Next.js compilation, lint, type checks, and page generation. For an explicit repository-wide lint run, use `npm run lint`.

After a successful build, start production locally:

```sh
npm run start -- --port 3011
```

In a second terminal, verify the rendered routes. PowerShell:

```powershell
$env:CHECK_ORIGIN = 'http://localhost:3011'
npm run check:routes
```

The route checker verifies content routes, internal links, metadata, canonical URLs, JSON-LD, 404/noindex behavior, and icon assets. Browser checks should also cover the homepage section order, mobile navigation, quote dialog focus and dismissal, gallery controls, and the footer map and review link.

Development and Vercel output is `.next/`; local production and Docker output is `.next-production/`. The Vercel build/runtime environment (`VERCEL=1`) selects `.next/`, matching `vercel.json` and Vercel's Next.js adapter. Local production builds remain separate from development artifacts. Both directories are generated and ignored. Build once before running `typecheck` in a fresh checkout if generated route types are needed.

## Quote delivery

Resend is the confirmed active provider: configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `RESEND_TO_EMAIL`. Its sender must be verified. The existing webhook alternative remains supported with `QUOTE_WEBHOOK_URL` and optional bearer `QUOTE_WEBHOOK_SECRET`; a configured webhook retains precedence. The route’s validation, honeypot, payload and success/redirect behavior are unchanged.

With neither a webhook nor complete Resend configuration, the form reports that delivery is unavailable and provides phone/email alternatives. Tests mock delivery and do not send customer enquiries. A deployment needs a real delivery configuration and a real end-to-end enquiry check.

## Sanity CMS

Open /studio after configuring the public Sanity project/dataset identifiers. The default dataset is **production**. Set CONTENT_SOURCE=sanity to load published content; empty or unavailable fields retain current local defaults. No dataset writes or imports are performed automatically.

Studio has global singletons, Page → Section editors, Blog Posts and Form Submissions. Schema entry: src/cms/sanity/schemaTypes/index.ts; structure: src/cms/sanity/structure.ts. Server fetches revalidate every 60 seconds. A signed /api/revalidate webhook supports immediate publication refresh.

New source areas:

~~~text
sanity.config.ts                        Studio workspaces and singleton actions
sanity.cli.ts                           Studio CLI identifiers
sanity/
  lib/writeClient.ts                    Lazy server-only submission writer
  structure/formSubmissionsStructure.ts Form → Year → Month record lists
src/
  app/studio/[[...tool]]/                Embedded Studio
  app/(website)/(resources)/blogs/      Blog list and dynamic post pages
  app/api/revalidate/route.ts            Signed publish webhook
  cms/sanity/
    defaults.json                       Local templates and fixed document IDs
    infer.ts                            Typed field/default construction
    schemaTypes/                        Existing types followed by new schemas
  content/local.ts                      Original validated fallback content
  content/merge.ts                      Partial-field fallback merge
  content/snapshot.ts                   Public DTO type
  content/view.ts                       Pure derived links/catalog view
  components/providers/site-content.tsx Server snapshot → client context
  components/blog/                      Cards, sidebar and Portable Text
  lib/sanity/                           Published queries, images and blog reads
  lib/forms/                            Form registry, dates, storage and Resend
~~~

The quote webhook remains the primary delivery path when configured. With no webhook, Resend uses RESEND_API_KEY, RESEND_FROM_EMAIL and RESEND_TO_EMAIL. Submission saving runs after the response and skips without a token. Use server-only SANITY_WRITE_TOKEN. Matching SANITY_SUBMISSIONS_DATASET/NEXT_PUBLIC_SANITY_SUBMISSIONS_DATASET overrides can select a separate dataset or the shared production content dataset; omitted overrides use the content dataset. Mismatched workspace names skip saving. New submissions always use private formSubmissions.<UUID> IDs, excluded from anonymous public reads even in a public dataset.

See [CMS setup](docs/cms-integration.md) and [implementation changelog](Changes/Aditya_17-11-26.md) for environment names, Studio filling, privacy and client verification. There were no existing blog posts to import. The existing CONTENT_SOURCE=payload option remains available.

## Production deployment

For Vercel, import this repository with the **Next.js** framework preset and the default `npm run build` command. The tracked `vercel.json` sets the output directory to `.next`; leave system environment variables enabled so `VERCEL=1` is available. If an older deployment failed with `NEXT_NO_ROUTES_MANIFEST`, redeploy the commit containing this configuration fix. No dependency changes or install-script approvals are required for that directory mismatch.

For a Node.js host:

```sh
npm ci
npm run build
npm run start
```

Set environment variables on the host and configure the intended public domain in `src/config/site.json`. Supply `--port` when the host requires a specific port.

The Dockerfile enables Next.js standalone output and runs as the `node` user:

```sh
docker build -t jl-coachbuilders .
docker run --rm -p 3000:3000 --env-file .env.local jl-coachbuilders
```

Docker itself has not been validated in this environment. Production verification for the CMS changes remains subject to the current command restrictions. Remote CMS builds need the corresponding build-time environment and credentials; do not place secrets in Docker build arguments.

Asset commands:

```sh
npm run images
npm run assets
```

These regenerate optimized photography and brand/icon assets respectively. Review regenerated assets before committing them. No hosting service, live domain, or public deployment is changed by the local development commands.

Environment setup uses the six core Sanity/source variables and three Resend variables in `.env.example`, plus the explicit indexing tier described below. Public content reads need no token. Optional signed-webhook, legacy/private-content, Payload and deployment settings are documented separately in [CMS setup](docs/cms-integration.md#optional-settings-outside-the-minimal-example). Timed revalidation does not need a webhook secret.

## SEO routes and launch indexing

The 27 approved route-specific SEO targets live in `src/content/seo-targets.json`. They override metadata only; CMS headings and visible content remain independent. Public page links use relative trailing-slash destinations. The existing Blog listing is `/blogs/`; `/blog` and `/blog/` return a single permanent 308 redirect. CMS singleton IDs such as `page.blog.*` stay unchanged.

Keep `SITE_ENVIRONMENT=staging` (or omit it) on the current staging deployment and previews. At the final-domain launch, set `SITE_ENVIRONMENT=production` in Vercel's Production environment and redeploy with Vercel system environment variables enabled. Indexing requires **both** `VERCEL_ENV=production` and `SITE_ENVIRONMENT=production`; no request hostname can enable it. Do not set the production tier on the staging deployment merely because Vercel calls its branch Production. Local production verification uses these two variables only in the command process. Existing deployment values have not been changed.

Canonicals, OG URLs and sitemap URLs intentionally use `https://jlcoachbuilders.co.nz/`, while navigation stays on the current host. API, Studio and resource URLs retain their existing conventions. The 11 old-site pages missing from this application remain absent; see the [18 November verification report](Changes/Aditya_18-11-2026.md).


Website content/images were migrated to the Sanity **production** dataset on 18-11-26. Deploy the latest Studio/query code, then edit and **Publish** in Studio; public pages refresh through the existing 60-second revalidation. The repeatable, explicitly opt-in importer is `node scripts/import-sanity-content.mjs --apply` (omit `--apply` for a read-only inventory). See [CMS migration details](docs/cms-integration.md).
