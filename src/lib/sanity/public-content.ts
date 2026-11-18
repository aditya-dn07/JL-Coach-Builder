import 'server-only';
import { cache } from 'react';
import * as local from '../../content/local';
import { mergeContent } from '../../content/merge';
import { validateContent } from '../../content/validate';
import { PageSchema, SiteSettingsSchema, QuoteFormContentSchema, ImageSchema, type ContentPage } from '../../content/schema';
import { SiteSchema } from '../../data/site.schema';
import type { ContentSnapshot } from '../../content/snapshot';
import defaults from '../../cms/sanity/defaults.json';
import webManifest from '../../content/web-manifest.json';
import { fetchPublished } from './client';
import { singletonQuery } from './queries';
import { resolveImages } from './images';
import layouts from '../../cms/sanity/layout-map.json';
import { homeUiOwners } from '../../content/section-identity';
import { toSanityDocumentId, fromSanityDocumentId } from '../../cms/sanity/document-ids.mjs';
type Document = Record<string, unknown> & { _id: string };
const parseOr = validateContent;
export const getPublicContent = cache(async (): Promise<ContentSnapshot> => {
  const remote = await fetchPublished<Document[]>(singletonQuery, { ids: Object.keys(defaults.seeds).map(toSanityDocumentId) });
  const documents = new Map((remote ?? []).map(doc => [fromSanityDocumentId(doc._id), doc]));
  const get = <T>(id: string, fallback: T): T => resolveImages(mergeContent(fallback, documents.get(id))) as T;
  const business = get('global.business', defaults.seeds['global.business']);
  const branding = get('global.branding', { ...defaults.seeds['global.branding'], webManifest });
  const header = get('global.header', defaults.seeds['global.header']);
  const footer = get('global.footer', defaults.seeds['global.footer']);
  const seo = get('global.seo', defaults.seeds['global.seo']);
  const cta = get('global.cta', defaults.seeds['global.cta']);
  const ui = get('global.interface', defaults.seeds['global.interface']);
  const catalog = get('global.vehicleCatalog', defaults.seeds['global.vehicleCatalog']);
  const form = get('global.quoteForm', defaults.seeds['global.quoteForm']);
  const testimonials = get('global.testimonials', defaults.seeds['global.testimonials']);
  const candidate = mergeContent(local.siteSettings, {
    ...branding, business, url: seo.url, seo: { title: seo.title, description: seo.description },
    navigation: header.navigation,
    images: { ...branding.images, og: seo.ogImage, business: seo.businessImage, closing: cta.image },
    ui: { ...ui.ui, ...header.ui, ...footer.ui, ...cta.ui, viewportThemeColor: branding.viewportThemeColor },
    vehicleTypes: catalog.vehicleTypes,
  });
  const siteSettings = parseOr(SiteSettingsSchema, candidate, local.siteSettings);
  const quoteForm = parseOr(QuoteFormContentSchema, form, local.quoteForm);
  const legacySite = parseOr(SiteSchema, mergeContent(local.legacySite, {
    url: siteSettings.url, seo: siteSettings.seo, business: siteSettings.business,
    nav: catalog.nav, services: catalog.services, copy: footer.copy,
  }), local.legacySite);
  const imageManifest = { ...local.imageManifest };
  // Sanity limits attributes per document; shared library images live in small singletons.
  const libraryImages: Record<string, unknown> = {};
  for (const entry of defaults.globals.filter(item => item.type === 'globalImageLibrary')) {
    const seed = (defaults.seeds as unknown as Record<string, { images: { id: string; image: unknown }[] }>)[entry.id];
    const library = get(entry.id, seed);
    for (const item of library.images) libraryImages[item.id] = item.image;
  }
  for (const [key, image] of Object.entries({ ...libraryImages, ...branding.manifest, logo: branding.logo })) {
    const parsed = parseOr(ImageSchema, image, imageManifest[key]);
    imageManifest[key] = parsed.src.startsWith('https://cdn.sanity.io/')
      ? parsed : { ...imageManifest[key], ...(image as object), ...parsed };
  }
  const pages = local.pages.map(page => {
    const entry = defaults.registry.find(item => item.slug === page.slug)!;
    const prefix = entry.id;
    const base = get(prefix + '.settings', page);
    const banner = get(prefix + '.banner', { heroImage: page.heroImage, homeUi: page.homeUi, eyebrow: page.eyebrow, title: page.title, description: page.description, descriptionLinks: page.descriptionLinks, benefitImages: page.benefitImages, actions: { quoteLabel: page.closingCta?.quoteLabel ?? siteSettings.ui.quote, quoteHref: siteSettings.ui.quoteTarget, callLabel: page.closingCta?.callLabel ?? page.homeUi?.callPrefix ?? 'Call', callHref: '' }, updatedAt: page.updatedAt });
    const closing = get(prefix + '.closing', { closingCta: page.closingCta ? { ...page.closingCta, quoteHref: siteSettings.ui.quoteTarget, callHref: '', contactCallLabel: siteSettings.ui.closingCall, contactEmailLabel: siteSettings.ui.closingEmail, emailHref: '' } : undefined, closingImage: page.closingImage });
    const seo = get(prefix + '.seo', page.seo);
    let faqs = page.faqs;
    const sectionFallbacks: ContentPage['sections'] = [];
    const sections = page.sections.map(section => {
      const id = prefix + '.' + section.id;
      const seed = (defaults.seeds as Record<string, unknown>)[id];
      const baseline = mergeContent(section, seed);
      const ownedUi = Object.fromEntries(Object.entries(homeUiOwners).filter(([, owner]) => owner === section.id).map(([key]) => [key, banner.homeUi?.[key] ?? page.homeUi?.[key] ?? '']));
      const fallback = { ...baseline, ui: ownedUi, actions: {
        quoteLabel: siteSettings.ui.quote, quoteHref: siteSettings.ui.quoteTarget,
        callLabel: ui.copy.callWorkshop, callHref: '', viewAllLabel: page.kind === 'home' && section.id === 'section-8' ? page.homeUi?.viewFaqs : ui.copy.viewReviews, viewAllHref: page.kind === 'home' && section.id === 'section-8' ? '/faqs/' : '/reviews/',
      }, faqs: undefined as typeof faqs | undefined };
      const fixedLayout = (layouts as Record<string, object>)[id] ?? {};
      sectionFallbacks.push({ ...fallback, ...fixedLayout });
      const result = get(id, fallback);
      if (page.kind === 'home' && section.id === 'section-6' && result.descriptionRichText?.length && result.blocks[0]) result.blocks[0] = { ...result.blocks[0], richText: result.descriptionRichText };
      if (result.faqs?.length) faqs = result.faqs;
      const required = page.kind === 'home' ? section.id === 'section-2' ? 11 : section.id === 'section-4' ? 2 : 1 : 0;
      if (required && result.blocks.length < required) result.blocks = section.blocks.map((block, index) => result.blocks[index] ?? block);
      const layout = (layouts as Record<string, unknown>)[id] ?? {};
      return { ...result, ...layout as object };
    });
    const introDoc = get(prefix + '.introduction', { paragraphs: page.intro.slice(1).map((text, index) => ({ type: 'paragraph' as const, text, links: page.introLinks?.find(item => item.index === index + 1)?.links })) });
    const related = sections.find(section => section.relatedServices?.length)?.relatedServices ?? base.relatedServices;
    const homeClosing = page.kind === 'home' ? sections.find(section => section.id === 'section-9')?.closingImage ?? closing.closingImage : closing.closingImage;
    const grid = get(prefix + '.customer-reviews', { reviewIds: testimonials.reviews.map(item => item.id), ariaLabel: ui.copy.customerReviews });
    const value = parseOr(PageSchema, { ...base, ...banner, ...closing,
      bannerActions: banner.actions, updatedAt: banner.updatedAt ?? base.updatedAt,
      closingImage: homeClosing, introduction: introDoc.paragraphs,
      reviewIds: grid.reviewIds, reviewAriaLabel: grid.ariaLabel,
      relatedServices: related, seo, sections, faqs, id: page.id, slug: page.slug, kind: page.kind }, { ...page, sections: sectionFallbacks });
    for (const section of value.sections) {
      if (!section.reviewIds?.length) continue;
      section.reviews = section.reviewIds.flatMap(id => {
        const review = testimonials.reviews.find(item => item.id === id);
        return review ? [{ text: review.text, author: review.author }] : [];
      });
    }
    return value;
  });
  const faqPage = pages.find(page => page.kind === 'faqs');
  if (faqPage) {
    const seen = new Set<string>();
    faqPage.faqTopics = pages.filter(page => page.kind !== 'faqs').flatMap(page => {
      const unique = page.faqs.filter(faq => {
        const key = faq.question.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });
      if (!unique.length) return [];
      const section = page.sections.find(section => section.layout === 'faq');
      const id = 'page.faqs.topic-' + page.id;
      const topic = get(id, {
        sourcePageId: page.id, eyebrow: section?.eyebrow ?? page.eyebrow,
        title: section?.title ?? page.title, description: section?.description ?? page.description,
        descriptionLinks: section?.descriptionLinks ?? page.descriptionLinks, faqs: unique,
      });
      const fallback = { id, sourcePageId: page.id, eyebrow: section?.eyebrow ?? page.eyebrow, title: section?.title ?? page.title, description: section?.description ?? page.description, descriptionLinks: section?.descriptionLinks ?? page.descriptionLinks, faqs: unique };
      return [parseOr(PageSchema.shape.faqTopics.unwrap().element, { ...topic, id, sourcePageId: page.id }, fallback)];
    });
    faqPage.faqs = faqPage.faqTopics.flatMap(topic => topic.faqs);
  }
  const gallery = get('page.' + local.pages.find(page => page.kind === 'gallery')!.id + '.photos', { photos: local.galleryImages }).photos;
  const galleryImages = gallery.map((photo, index) => parseOr(ImageSchema, photo, local.galleryImages[index] ?? local.galleryImages[0]));
  const status = get('page.quote-result.settings', form.status);
  const snapshot: ContentSnapshot = { testimonials: testimonials.reviews, pages, siteSettings, quoteForm, legacySite, galleryImages, imageManifest,
    editorial: { webManifest: branding.webManifest, interface: ui, status, statusSeo: get('page.quote-result.seo', { title: status.seoTitle, description: status.seoDescription, noindex: true }), sitemap: get('global.sitemap', defaults.seeds['global.sitemap']) } };
  if (process.env.CONTENT_SOURCE === 'payload') {
    try {
      const { readCmsPages, readCmsSettings } = await import('../../cms/adapters');
      const [remotePages, settings] = await Promise.all([readCmsPages('payload'), readCmsSettings('payload')]);
      snapshot.pages = remotePages;
      snapshot.siteSettings = settings.site;
      snapshot.quoteForm = settings.quoteForm;
    } catch { /* Source-backed defaults remain available if the provider cannot be reached. */ }
  }
  return snapshot;
});
