# CMS integration

The live frontend currently uses local content. Sanity and Payload are alternative providers; select one when you are ready. No CMS service is provisioned by this project.

## Shared contract

Each page has `id`, `slug`, `label`, `title`, `eyebrow`, `description`, `intro`, `kind`, `image`, `seo`, `sections`, `faqs` and an interior `closingCta`. Optional `heroImage`, `closingImage` and `homeUi` fields support page presentation. The homepage uses an empty slug. Every other slug must be unique and match its URL. Local page records, including Gallery, Reviews and FAQs, are in `src/content/pages.json`.

Sections use `id`, optional `eyebrow`, `title`, `description`, ordered heading/paragraph `blocks`, and optional `image` and `cta`. Interior hierarchy is subheading → heading → description; numbered legal sections omit the subheading. FAQs are question/answer pairs. Every content image uses `{ src, alt, width, height }`, including page heroes, gallery records and the image manifest. The Word extraction remains in `docs/content-source.json`. Edit JSON directly for ordinary changes; `node scripts/import-document.mjs` overwrites them.

## Sanity

1. Register `sanitySchemaTypes` from `src/cms/sanity/schema.ts` in your Studio's `schema.types`.
2. Import page records as `_type: page` documents, the site settings as `_type: siteSettings`, and form labels as `_type: quoteFormContent`. Add unique `_key` values to array objects. Sanity key/value arrays and named-image arrays are normalized to the Zod record fields by the adapter.
3. Set `CONTENT_SOURCE=sanity`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, and optionally `SANITY_API_TOKEN` for a private dataset.
4. Publish all documents and rebuild. The reader excludes drafts and validates content. Missing or malformed content fails visibly instead of silently showing stale local copy.

## Payload

1. Copy `payloadPagesCollection`, `payloadSiteSettingsGlobal` and `payloadQuoteFormGlobal` from `src/cms/payload/collection.ts` into your Payload project. Type their final registration against your installed Payload version and set access rules.
2. Import page JSON and gallery data through Payload's Local API or admin UI. Publish every page (`_status: published`). The `intro` JSON field holds an array of strings; use a custom array editor if desired.
3. Set `CONTENT_SOURCE=payload`, `PAYLOAD_API_URL=https://your-cms.example/api`, and optionally `PAYLOAD_API_KEY` for a read-only API-enabled users collection.
4. Rebuild. Published-page queries load up to 100 pages, check pagination and validate the shared contract.

The schema definitions intentionally have no CMS package dependency in this frontend. They are authoring templates for the separate CMS installation, not a running Studio or admin dashboard. Test them against the CMS version selected when integrating.

## Refresh and global content

Remote requests use Next.js's 60-second fetch cache. Add authenticated CMS publish webhooks and route revalidation if you need immediate updates. All page slugs are prebuilt. Publish a new build after adding or removing a page; unknown slugs intentionally return HTTP 404.

Local site settings and navigation live in `src/config/site.json`; functional quote labels live in `src/content/quote-form.json`. `SiteSettingsSchema` and `QuoteFormContentSchema` in `src/content/schema.ts` validate both local and normalized CMS responses. The page, section, CTA, SEO and image fields have matching names in Zod, Sanity and Payload. `getCmsSettings()` can fetch and validate remote globals, but the current header, footer and quote form still read the local synchronous settings path; changing `CONTENT_SOURCE` does not change them. Adapter tests use mocked responses only. No real CMS account is connected.

If a Sanity image CDN URL replaces local `src` values, add that CDN host to `images.remotePatterns` in `next.config.ts` before using it with `next/image`. Preserve `alt`, `width` and `height` in the normalized image record.

## Before production

Configure the quote webhook, actual CMS credentials if using a remote provider, and the intended domain. Verify CMS permissions, imported slugs, published content, contact details and form delivery on that environment. No credentials or enquiry contents belong in the page JSON.
