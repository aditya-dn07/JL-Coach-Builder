# Sanity CMS integration

The website has an embedded Sanity Studio at /studio, fixed page/section editors, server-side published-content reads and source-backed defaults. No dataset has been provisioned or written by this implementation.

## Configuration

Copy .env.example to an ignored .env.local or set deployment environment variables. Set CONTENT_SOURCE=sanity to enable CMS reads. Without configured identifiers, or when a CMS field is empty/unavailable, the current local content remains visible.

The default content dataset is **production**. Configure only NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET for Studio, CLI, content reads and images. Public datasets need no read token. Public identifiers are not credentials. The minimal example contains six core names plus the three Resend names.

Studio shows eleven global singletons, page folders with section items, Blog Posts/Categories/Authors/Tags and Form Submissions at the end. Existing schema registrations retain their original order. New singleton templates are excluded from the normal create menu; duplicate/delete actions are removed for fixed singleton documents. Initial editor values come from src/cms/sanity/defaults.json; these templates do not write anything until an authorised editor explicitly saves/publishes.

Editors for service/about final source sections omitted by the live template are not exposed. FAQs are edited in their source section, then aggregated; testimonials are shared. Existing slugs/layouts remain fixed. New generic content routes are not automatically added.

## Images

Upload images through the image fields. Every image supports hotspot and Alt text. Meaningful images need alt; decorative images can be marked decorative. Existing local images remain the fallback. The server resolves asset references with @sanity/image-url and the front end uses next/image. No existing assets were uploaded automatically.

## Blog

/blog/ lists published articles and /blog/[slug]/ shows a post. Create a category and author, then a Blog Post with title, slug, publication date, excerpt, featured image/alt and Portable Text body. Future-dated posts/drafts stay private. Blog Page contains SEO, banner, filter/featured selections, list/detail labels, optional sidebar, internal CTA and footer CTA. There were no legacy posts, so no blog import script or import run is needed.

Publish changes are visible after the 60-second cache window. For immediate refresh, configure a signed Sanity webhook to POST /api/revalidate using SANITY_REVALIDATE_SECRET. Its projection should include _type, _id, slug and beforeSlug when a post slug changes. No webhook was configured or invoked here. Arbitrary paths and submission document events are rejected.

## Quote delivery and submission storage

The same QuoteForm remains inline on /contact/ and in the global popup. Fields, validation, honeypot, native-post redirects and JSON success/conversion behavior are preserved.

If QUOTE_WEBHOOK_URL is configured, its existing HTTPS delivery flow/auth/body remain in use. Resend is used only when no webhook is configured and RESEND_API_KEY, RESEND_FROM_EMAIL and RESEND_TO_EMAIL are all set. The sender must have a verified domain; recipient values come from env and reply-to is the validated submitter. No message was sent during implementation.

Validated submissions are saved using Next.js after, outside the response path. Storage failure never changes email or response behavior. This is best-effort saving, not a durable queue. Configure SANITY_WRITE_TOKEN server-side with permission for the submissions dataset; without a token/project, saving silently skips. No read token is required for public content.

Set SANITY_SUBMISSIONS_DATASET and NEXT_PUBLIC_SANITY_SUBMISSIONS_DATASET to the same restricted dataset name, different from the content dataset. The writer skips if either name is missing, they disagree, or they resolve to the content dataset. There is no public-content fallback for submissions. Studio provides its separate workspace through Form Submissions. Dataset privacy/roles still require account-side configuration; a different name alone does not prove privacy.

Studio hierarchy: Form Submissions → Quote request → Year (count) → Month (count) → records, newest first. Form folder is always shown; year/month folders appear only with records. Only status is editable; test records can still be deleted through document actions.

**Privacy:** submissions contain personal data. Limit dataset access to authorised staff. readOnly controls Studio UI only, not API access. Agree retention/deletion and privacy policy before accepting real enquiries. Never expose a write token in NEXT_PUBLIC variables.

## Verification authorised for this implementation

Only npx tsc --noEmit --incremental false --pretty false was run. Build, lint, tests, live submissions, email sends, dataset mutations, imports and deployment were not run. See Changes/Aditya_17-11-26.md under Sanity Implementation for the file-level record and client checks.

## Completion verification

See Changes/Aditya_17-11-26.md, under Sanity Completion Verification, for the requirement checklist and the full 313-section source/editor/query/render matrix. src/cms/sanity/section-map.json is the machine-readable mapping, and layout-map.json holds immutable dispatch and CTA placement.

The original inventory remains 30 page URLs / 313 logical sections. /blog adds a fixed list URL plus a dynamic post template, with no legacy posts stored in this repository. Studio and metadata endpoints are counted separately.

Rendered introductions, every FAQ topic and the reviews grid now have fixed editors. Home metrics/cards/intro/checklist/capability/CTA fields live with their owning sections. Legacy duplicate/unused fields are hidden. Main-page formatted text uses richInline; full article blocks use blogBody. Images retain caption/decorative/hotspot metadata; gallery and article figures display captions, and other image descriptions are preserved without changing layout.

The existing /site.webmanifest URL is now a read-only route backed by Branding & Images, with its former contents retained as local defaults. The browser viewport colour is also a branding setting; the initial value is unchanged.

No real service variables were configured in the local shell; only the blank .env.example is present. The default content dataset is production, matching Studio and front-end defaults, but deployed values, access permissions, CORS, sender-domain verification and CMS round trips are unverified. No matching preview was available at the documented localhost:3011 address, so visual/runtime verification was not performed.

Asset generation continues to update the manifest fallback at src/content/web-manifest.json; it no longer creates a conflicting public/site.webmanifest file. The generator was not run in this pass.

## Optional settings outside the minimal example

The owner confirmed Resend is the active delivery provider. Keep RESEND_API_KEY, RESEND_FROM_EMAIL and RESEND_TO_EMAIL. The webhook branch is unchanged: an already-configured QUOTE_WEBHOOK_URL still takes precedence, and QUOTE_WEBHOOK_SECRET supplies its optional bearer authentication. These names are omitted from the Resend example, not removed from code or deployment settings. Do not switch providers or remove existing live settings without reviewing that deployment.

- **Signed publish hook:** optionally add SANITY_REVALIDATE_SECRET to enable /api/revalidate. Signature verification stays intact. Ordinary 60-second revalidation works without this variable.
- **Private content / legacy credentials:** SANITY_API_TOKEN remains an optional server-only authenticated-read token and legacy writer fallback. Public content does not need it; new setups use SANITY_WRITE_TOKEN for submissions. SANITY_PROJECT_ID and SANITY_DATASET remain compatibility aliases only when public identifiers are absent. Do not configure duplicate identifiers for a new setup; Studio requires the public identifiers.
- **Payload:** CONTENT_SOURCE=payload still uses PAYLOAD_API_URL and, if authentication is needed, PAYLOAD_API_KEY. Configure those only for an existing Payload deployment. They are not required for Sanity.
- **Deployment:** Docker still sets BUILD_STANDALONE=1 internally. Vercel provides VERCEL/VERCEL_ENV; leave them platform-managed. SITE_CANONICAL_URL remains an optional indexing-host override, defaulting to src/config/site.json. CONTENT_STRICT and CHECK_ORIGIN remain optional development/tooling switches. No deployment configuration or provider code was removed.

Only .env.example was rewritten; no real environment file, account setting or secret was read out or modified. See the Environment Simplification changelog entry for the current configuration contract; older audit/setup entries remain historical.

### Studio layout and existing website defaults

Studio is available at `/studio/website` when the private submissions workspace is configured (`/studio` for a single workspace). It has its own viewport layout, without website navigation/footer/styles. Public routes retain the same URLs under the internal `(website)` route group.

New fixed-document editors use the existing website defaults through an explicit documentId initial-value template. If a document was previously created with missing fields, choose **Fill missing fields from website defaults** to fill absent top-level values while retaining saved content. This is an editor action that saves a draft; review and publish it yourself. No defaults are automatically written on component mount.

Image fields show the current local website image as a preview when no Sanity asset has been selected. This preview does not upload the file. Use the normal image upload control, set alt text (or decorative), and publish to replace the local fallback.

Studio's homepage folder is labelled **Home** (fixed ID `page.home`). Its public headline remains editable and does not control navigation identity. Singleton editor headings and previews use the stable registry labels, so documents without a public title field do not need an artificial title or content migration.
