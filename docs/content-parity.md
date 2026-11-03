# Homepage content parity

Compared https://jlcoachbuilders.co.nz/ with the existing implementation on 30 October 2026. Fresh full HTML saved as `source-homepage-update.html`; its SHA-256 matches the earlier source snapshot, so the original extracted paragraph, FAQ and review inventory remains current.

| Live section | What I built before this update | Mismatch | Fix |
|---|---|---|---|
| Hero | Existing split hero, workshop photo, chips and factual badges | Different eyebrow punctuation; invented supporting sentence; quote form title/fields differ | Preserve split composition and photograph; apply supplied eyebrow, H1 and chips, approved typography; use solid badges; form becomes Get A Free Quote / Name, Phone, Email, Message / Send |
| What We Do | One paragraph reused in a later differentiator section | Four paragraphs and four ticks missing; no dedicated second section | Restore all five supplied paragraphs and ticks; add the explicitly requested editorial heading, portrait, Since 2016 badge and static fact row |
| Services We Offer | Five bento tiles with shortened vehicle titles | Wrong presentation and headings; text too small | Use complete live service titles/descriptions in alternating editorial rows with Read More destination retained, requested View services label and outlined row numbers; restore supplied insurance banner |
| Caravan and Motorhome Repairs in Christchurch | Missing dedicated intro | Intro absent | Restore supplied repairs paragraph in left column |
| What Makes JL Coachbuilders Different? | Three invented subheadings and three selected source paragraphs | Intro and other source paragraphs missing | Restore all six supplied paragraphs in the right column; remove invented headings |
| Coachbuilding FAQs | Four real questions and answers below reviews | Wrong order; invented headings | Move above reviews; retain verbatim source answers and semantic accordion |
| Over 100 5 star reviews! | Six real testimonials beneath invented headline | Heading and order differ | Use the supplied heading; retain every original author, location and testimonial, including source typos; no fabricated individual star ratings |
| Why Choose Us | Missing | Four live headings/descriptions absent | Restore Insurance Repairs, Wide Range of Models, Trusted by Canterbury and Caravan & Motorhome Maintenance with verbatim descriptions; use a ruled editorial layout |
| High Quality Caravan Parts & Accessories in Christchurch | Invented final contact headline | Source parts CTA absent | Restore exact parts heading and Get a Quote link with the second and final racing-stripe motif |
| Map + Footer | Map embedded in a small dark footer; shortened intro | Missing original footer introduction; very small text | Separate full-width map from one light footer; restore original introduction, contact, quick links and credit; enlarge supplied logo |
| No process timeline / animated statistics / before-after slider | Invented four-step process and animated charcoal stats band; no slider exists | Added editorial content and unsupported motion | Remove process, unused process data/schema and counter animation. Keep only the four permitted factual values in the requested static row. No slider to remove |
| Navigation and quote controls | Existing sticky controls and live destination URLs | Text often 8–13px | Keep controls, raise navigation/control text to at least 16px; preserve all 20 live vehicle URLs |

## Source precedence and scope

The user's exact supplied text takes precedence over live capitalization, curly apostrophes and the em dash in the accident-repair paragraph. The explicitly requested What We Do heading, View services link, Call button and factual labels are approved editorial exceptions. Functional navigation, accessibility labels, image descriptions and validation/delivery feedback remain necessary interface text; they are not business claims. Numbered service rows are navigation markers, not statistics.

The live form has Name, Phone and Email fields; Message is explicitly requested here. Vehicle type is removed from the visible form and becomes optional in the delivery schema for compatibility with existing webhook payloads. No live form submission or delivery configuration is inferred.

Working address remains 5/4 Spencerville Road, Kainga, Christchurch 8083, consistently across visible contact, map and JSON-LD. The source's conflicting structured-data unit (2/4) still needs client confirmation. Exact Google review count and individual ratings remain unknown; no values are fabricated.
