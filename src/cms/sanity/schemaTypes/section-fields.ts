import type { SchemaTypeDefinition } from 'sanity';
import defaults from '../defaults.json';
import layouts from '../layout-map.json';
type Field = { name?: string; type?: string; fields?: Field[]; of?: Field[]; [key: string]: unknown };
const rich = (name: string, title: string): Field => ({ name, title, type: 'richInline' });
export function extendSectionFields(types: SchemaTypeDefinition[]) {
  function extend(fields: Field[]) {
    for (const field of fields) {
      if (field.fields && field.type !== 'image') extend(field.fields);
      for (const item of field.of ?? []) if (item.fields && item.type !== 'image') extend(item.fields);
    }
    if (fields.some(field => field.name === 'text' || field.name === 'answer') && !fields.some(field => field.name === 'richText')) fields.push(rich('richText', 'Formatted text (optional)'));
    if (fields.some(field => field.name === 'description') && !fields.some(field => field.name === 'descriptionRichText')) fields.push(rich('descriptionRichText', 'Formatted description (optional)'));
  }
  for (const type of types) {
    if (!('fields' in type) || !type.fields) continue;
    extend(type.fields as Field[]);
    if (type.name === 'pageSettings') for (const field of type.fields) {
      if (['intro', 'introLinks', 'relatedServices', 'updatedAt'].includes(field.name)) field.hidden = true;
    }
    if (type.name === 'sectionSettings') {
      const services = type.fields.find(field => field.name === 'serviceCards') as Field | undefined;
      const item = services?.of?.[0];
      if (item?.fields) item.fields.push(
        { name: 'image', title: 'Image override', type: 'accessibleImage' },
        { name: 'href', title: 'Card destination override', type: 'string' },
        { name: 'links', title: 'Service links override', type: 'array', of: [{ type: 'navigationLink' }] },
        { name: 'descriptionLinks', type: 'array', of: [{ type: 'navigationLink' }] },
      );
      const help = type.fields.find(field => field.name === 'helpCard') as Field | undefined;
      help?.fields?.push({ name: 'descriptionLinks', type: 'array', of: [{ type: 'navigationLink' }] });
    }
    if (type.name === 'pageBanner') {
      const ui = type.fields.find(field => field.name === 'homeUi') as Field | undefined;
      // Home section controls are now edited on their owning section, not the banner.
      const moved = new Set(['trustEyebrow','serviceAll','serviceRepairs','servicePaint','serviceUpgrades','insurance','serviceHelpTitle','workshop','workshopYears','workshopYearsLabel1','workshopYearsLabel2','electrical','plumbing','problems','reviews','reviewIntro','viewReviews','faqs','viewFaqs','faqIntro','ready','call','benefitImages','capabilityLocation','insuranceContext','insuranceLink']);
      for (const field of ui?.fields ?? []) if (moved.has(field.name ?? '')) field.hidden = true;
      const images = type.fields.find(field => field.name === 'benefitImages'); if (images) images.hidden = true;
    }
  }
}

export function scopeSectionControls(types: SchemaTypeDefinition[]) {
  for (const type of types) {
    if (!('fields' in type)) continue;
    const fields = type.fields as Field[] | undefined;
    const ui = fields?.find(field => field.name === 'ui');
    for (const field of ui?.fields ?? []) field.hidden = ({ document }: { document?: { _id?: string } }) => {
      const id = document?._id?.replace(/^drafts\./, '') ?? '';
      const allowed: Record<string, string[]> = {
        'page.home.section-2': ['serviceAll', 'serviceRepairs', 'servicePaint', 'serviceUpgrades'],
        'page.home.section-7': ['reviewIntro'], 'page.home.section-8': ['faqIntro'], 'page.home.section-9': ['call'],
      };
      return !(allowed[id] ?? []).includes(field.name ?? '');
    };
    const actions = fields?.find(field => field.name === 'actions');
    for (const field of actions?.fields ?? []) field.hidden = ({ document }: { document?: { _id?: string } }) => {
      const id = document?._id?.replace(/^drafts\./, '') ?? '';
      const home: Record<string, string[]> = {
        'section-1': ['quote'], 'section-2': ['quote','call'], 'section-3': ['quote'], 'section-4': ['quote','call'],
        'section-5': ['quote'], 'section-6': ['quote'], 'section-7': ['viewAll'], 'section-8': ['viewAll'], 'section-9': ['quote','call'],
      };
      const layout = (layouts as Record<string, { ctaAfter: boolean; layout: string }>)[id];
      const allowed = id.startsWith('page.home.') ? home[id.slice('page.home.'.length)] ?? []
        : [...(layout?.ctaAfter ? ['quote','call'] : []), ...(layout?.layout === 'reviews' ? ['viewAll'] : [])];
      return !allowed.some(prefix => field.name?.startsWith(prefix));
    };
    if (type.name === 'pageBanner') {
      const homeUi = fields?.find(field => field.name === 'homeUi');
      for (const field of homeUi?.fields ?? []) if (['quote','callPrefix'].includes(field.name ?? '')) field.hidden = true;
    }
  }
}

export function hideOverriddenDescriptions(types: SchemaTypeDefinition[]) {
  for (const type of types) {
    if (type.name !== 'sectionSettings' || !('fields' in type)) continue;
    const rich = type.fields?.find(field => field.name === 'descriptionRichText');
    if (rich) rich.hidden = ({ document }) => {
      const id = document?._id?.replace(/^drafts\./, '') ?? '';
      const seed = (defaults.seeds as Record<string, Record<string, unknown>>)[id];
      return Boolean(seed?.form || Array.isArray(seed?.descriptionParagraphs) && seed.descriptionParagraphs.length);
    };
  }
}
