# JL Coachbuilders

A 27-page Next.js 15 App Router website for the Christchurch specialist vehicle workshop, using the supplied Word content, existing logo and real old-website photographs. TypeScript, Tailwind CSS, next/font, next/image, lucide-react and CSS motion.

## Run

Use Node.js 22+.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production:

```sh
npm run test
npm run lint
npm run typecheck
npm run build
npm run start
```

If port 3000 is already in use, run `npm run start -- --port 3010`. Development output goes to `.next`; production output goes to `.next-production`.

## Structure

```text
src/config/site.json              Single source for brand, URL, contacts and social links
src/config/site.ts                Derived phone and map links
src/app/                          Pages, Metadata API, 404/error boundaries, sitemap and robots
src/components/website/           Server-rendered sections/footer and interactive navigation
src/components/errors/            Shared retry screen
src/components/quote-*            Validated enquiry form and accessible dialog
src/content/pages.json            Content migrated from the supplied Word document
src/content/schema.ts             Shared Zod content contract
src/content/repository.ts         Local / Sanity / Payload content loading
src/content/quote-form.json        Form copy and status messages
src/content/catalog.ts            Vehicle navigation and image references
src/cms/                          Sanity/Payload schemas and validated server-side readers
src/data/                         Original content inventory and optimized image manifest
public/fonts/                     Self-hosted Outfit and Inter, with licenses
public/images/                    Original photos, responsive variants and branded OG artwork
public/icons/                     Complete PNG icon sizes
scripts/                          Image/brand asset generation and route validation
tests/                            Content, routes and quote API regression tests
docs/                             Page inventory, CMS instructions and verification evidence
```

Pages include Home, 20 vehicle-service pages, Insurance, About, Contact, Gallery, Privacy Policy and Terms. The original service slugs are retained. Unused comparison components, styles and Framer Motion have been removed.

## Design and accessibility

The workshop identity uses charcoal, warm off-white, red and a restrained earth accent. The design combines split photography, an asymmetric service index, full-width workshop imagery, editorial text, numbered repair details and accessible FAQs. CSS variables define the palette; Tailwind tokens reference them. Outfit is the display face and Inter the body face, both self-hosted through next/font/local with display swap.

Scroll reveals, hover details and reading progress respect reduced-motion preferences. Navigation and the quote dialog support keyboard dismissal and focus return. The skip link targets the main landmark. The unnecessary route-wide loading screen was removed after measuring a layout shift; content pages are pre-rendered and navigate without an artificial loading state.

## SEO and assets

All 27 content pages have a unique title/description, canonical, full Open Graph and Twitter tags, and page-appropriate JSON-LD. Metadata API configuration includes the title template and metadataBase. The 1200×630 branded OG image is `public/images/brand/og.jpg`.

The favicon set includes ICO, SVG, 16/32/48/192/512px PNGs, an Apple touch icon, web manifest and theme color. Regenerate with `npm run assets`. Regenerate responsive photographs with `npm run images`. No mandatory visual assets are missing. Higher-resolution photographs of campervans, motorhome interiors, fifth wheels and buses would improve large-display detail.

## Forms and CMS

Copy `.env.example` to `.env.local`. Set `QUOTE_WEBHOOK_URL` to a trusted HTTPS delivery endpoint and optionally `QUOTE_WEBHOOK_SECRET`. The form uses client/server validation, a honeypot, same-origin checks, size limits and a delivery timeout. Without a webhook it shows a clear failure and phone/email alternatives. Tests use mocked delivery; no customer enquiry is transmitted.

Local content works without any account. To use a CMS, register/import the provided schema and content, configure either Sanity or Payload environment variables, and rebuild. See `docs/cms-integration.md`. CMS credentials are server-side. Add/remove page slugs through a new build so unknown routes retain correct HTTP 404 responses.

## Deploy

A Node.js host can run `npm ci`, `npm run build`, then `npm run start` behind its HTTPS proxy. Set the runtime `PORT` using `npm run start -- --port <port>` if required by the host. Configure environment variables in the host's environment, update `src/config/site.json` for the intended domain, and rebuild. Public assets, `.next-production`, package files and installed runtime dependencies must remain available.

A multi-stage Dockerfile is also provided:

```sh
docker build -t jl-coachbuilders .
docker run --rm -p 3000:3000 --env-file .env.local jl-coachbuilders
```

Docker builds default to local page content and create a standalone Node bundle. For a remote CMS, use a build environment with the selected CMS configuration and private build-time secret support; do not put tokens into Docker build arguments or the image. Docker was unavailable in the development environment, so the container path has not been executed. The ordinary Node production build is verified.

Before going live, configure enquiry delivery, select the intended CMS provider if needed, confirm domain settings, and test a real enquiry on the deployment. No live website has been published or replaced. No git commands were used.

## Verification

`npm run check:routes` checks all 27 routes, unique metadata, OG/Twitter tags, canonical URLs, JSON-LD, internal links, 404/noindex and icon assets. It targets localhost:3000; set `CHECK_ORIGIN` for another origin. See `docs/production-readiness.md` for browser checks and measured Lighthouse results.
