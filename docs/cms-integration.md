# CMS integration

The live frontend currently uses local content. Sanity and Payload are alternative providers; select one when you are ready. No CMS service is provisioned by this project.

## Shared contract

Each page has `id`, `slug`, `label`, `title`, `eyebrow`, `description`, `intro`, `kind`, `image`, `seo`, `sections` and `faqs`. The homepage uses an empty slug. Every other slug must be unique and match the current URL. `src/content/schema.ts` validates published API responses. Local page records are in `src/content/pages.json`; add the gallery record from `src/content/repository.ts` when importing.

Sections contain ordered heading/paragraph blocks. FAQs are structured question/answer pairs so UI and JSON-LD stay consistent. Images use semantic asset IDs mapped to the existing local optimized files. The Word extraction is retained in `docs/content-source.json`; `node scripts/import-document.mjs` regenerates the local records. Edit JSON directly for ordinary editorial changes; rerunning the importer overwrites those edits.

## Sanity

1. Register `sanitySchemaTypes` from `src/cms/sanity/schema.ts` in your Studio's `schema.types`.
2. Import page records as `_type: page` documents, with stable `_id` values. Add unique `_key` values to all array objects during the import. Keep `slug` as a plain string as defined by this schema, including the empty homepage slug.
3. Set `CONTENT_SOURCE=sanity`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, and optionally `SANITY_API_TOKEN` for a private dataset.
4. Publish all documents and rebuild. The reader excludes drafts and validates content. Missing or malformed content fails visibly instead of silently showing stale local copy.

## Payload

1. Copy `payloadPagesCollection` from `src/cms/payload/collection.ts` into your Payload project. Type its final registration against the `CollectionConfig` supplied by your installed Payload version and set read/write access rules for your deployment.
2. Import page JSON and gallery data through Payload's Local API or admin UI. Publish every page (`_status: published`). The `intro` JSON field holds an array of strings; use a custom array editor if desired.
3. Set `CONTENT_SOURCE=payload`, `PAYLOAD_API_URL=https://your-cms.example/api`, and optionally `PAYLOAD_API_KEY` for a read-only API-enabled users collection.
4. Rebuild. Published-page queries load up to 100 pages, check pagination and validate the shared contract.

The schema definitions intentionally have no CMS package dependency in this frontend. They are authoring templates for the separate CMS installation, not a running Studio or admin dashboard. Test them against the CMS version selected when integrating.

## Refresh and global content

Remote requests use Next.js's 60-second fetch cache. Add authenticated CMS publish webhooks and route revalidation if you need immediate updates. All page slugs are prebuilt. Publish a new build after adding or removing a page; unknown slugs intentionally return HTTP 404.

Brand, URL, contact facts and social links live in `src/config/site.json`. Navigation, testimonials and the image catalog use `src/data/legacy-content.json` and `src/content/catalog.ts`. They remain local under either provider. Move these into a CMS singleton/global and add a settings repository when global editing is required. The current schemas cover the full page-content contract; they do not claim a connected global-content editor.

## Before production

Configure the quote webhook, actual CMS credentials if using a remote provider, and the intended domain. Verify CMS permissions, imported slugs, published content, contact details and form delivery on that environment. No credentials or enquiry contents belong in the page JSON.
