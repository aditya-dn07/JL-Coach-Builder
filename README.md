# JL Coachbuilders

A Next.js website for JL Coachbuilders in Christchurch, with 27 content pages, one curated homepage, a project gallery, and a validated quote form.

## Stack

- Next.js 15 App Router, React 19, and TypeScript
- Tailwind CSS 3 for layout, spacing, typography, and responsive controls
- Feature CSS for the homepage composition, editorial layouts, image treatments, and animations
- Motion, Lucide React, and Bootstrap Icons
- Zod for content and quote validation
- Local JSON content, with optional Sanity or Payload adapters
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

```text
src/
  app/
    (home)/
      page.tsx                  Homepage composition and metadata; URL: /
    (content)/
      [slug]/page.tsx            Services, about, contact, gallery, and legal routes
    api/quote/route.ts          Server-side quote validation and delivery
    layout.tsx                  Global fonts, styles, header, footer, and effects
    error.tsx                   Route error boundary
    global-error.tsx            Root error boundary
    not-found.tsx               404 page
    robots.ts
    sitemap.ts
  components/
    home/
      hero.tsx
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
      site-footer.tsx
      footer/
        footer-contact.tsx      Contact list and supplied Google Maps embed
        footer-links.tsx
      motion-effects.tsx
      interaction-effects.tsx
    content/
      interior-hero.tsx
      page-contents.tsx
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
    shared/
      photo.tsx
      library-icon.tsx
      two-tone-heading.tsx
      quote-link.tsx
      google-review-link.tsx    Google badge shared by trust, reviews, and footer
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
  data/                         Image manifest, gallery, and legacy content data
  cms/                          Remote content adapters and authoring schemas
  lib/                          Fonts, metadata, JSON-LD, and quote validation
  styles/
    globals.css                 Tailwind directives, reset, and base tokens
    theme.css                   Dark theme
    refinements.css             Shared editorial spacing and action treatments
public/
  fonts/                        Self-hosted font files and licenses
  images/                       Original assets and optimized variants
  icons/                        Favicons and app icons
scripts/                        Asset generation and route verification
tests/                         Content, CMS, SEO, and quote API regression tests
docs/                          CMS setup, source inventory, and verification notes
```

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

## Homepage composition

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
| Header/footer links | `src/config/navigation.ts` |
| Phone, email, address, social links | `src/config/site.json` |
| Footer map and Google review link | `src/config/site.ts` |
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

Set `QUOTE_WEBHOOK_URL` to a trusted HTTPS endpoint accepting the validated quote JSON. Optionally set `QUOTE_WEBHOOK_SECRET` for a bearer token. The route rejects cross-origin requests, oversized or malformed bodies, and honeypot submissions, and applies a delivery timeout.

With no webhook configured, the form reports that delivery is unavailable and provides phone/email alternatives. Tests mock delivery and do not send customer enquiries. A deployment needs a real delivery configuration and a real end-to-end enquiry check.

## Optional CMS

`CONTENT_SOURCE` defaults to `local`. Set it to `sanity` or `payload` and configure the matching variables from `.env.example` to use a remote content provider. Adapters validate responses against the same page schema. See [CMS integration](docs/cms-integration.md).

Pages are generated at build time. Content or slug changes require a rebuild. Keep CMS credentials in server-side environment variables.

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

Docker itself has not been validated in this environment. The standard Node production build is checked locally. Remote CMS builds need the corresponding build-time environment and credentials; do not place secrets in Docker build arguments.

Asset commands:

```sh
npm run images
npm run assets
```

These regenerate optimized photography and brand/icon assets respectively. Review regenerated assets before committing them. No hosting service, live domain, or public deployment is changed by the local development commands.
