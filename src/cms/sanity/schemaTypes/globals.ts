import { seededType } from '../infer';
import defaults from '../defaults.json';
export const globalTypes = defaults.globals.map(item => seededType(item.type, item.title));

for (const type of globalTypes) {
  if (!('fields' in type)) continue;
  const fields = type.fields as { name: string; fields?: { name: string; hidden?: boolean }[]; of?: { fields?: { name: string; hidden?: boolean }[] }[]; hidden?: boolean }[];
  if (type.name === 'globalBranding') {
    for (const field of fields.find(field => field.name === 'images')?.fields ?? []) if (['closing','og'].includes(field.name)) field.hidden = true;
    for (const field of fields.find(field => field.name === 'manifest')?.fields ?? []) if (field.name === 'workshop') field.hidden = true;
  }
  if (type.name === 'globalVehicleCatalog') {
    for (const field of fields.find(field => field.name === 'services')?.of?.[0]?.fields ?? []) if (!['id','image'].includes(field.name)) field.hidden = true;
    for (const field of fields.find(field => field.name === 'nav')?.of?.[0]?.fields ?? []) if (field.name === 'href') field.hidden = true;
  }
  if (type.name === 'globalBusiness') { const field = fields.find(field => field.name === 'confirmedResponseTime'); if (field) field.hidden = true; }
  if (type.name === 'globalQuoteForm') { const field = fields.find(field => field.name === 'status'); if (field) field.hidden = true; }
  if (type.name === 'globalHeader') for (const field of fields.find(field => field.name === 'ui')?.fields ?? []) if (field.name === 'headerMobilePlace') field.hidden = true;
  if (type.name === 'globalInterface') { const field = fields.find(field => field.name === 'workshop'); if (field) field.hidden = true; }
  if (type.name === 'globalInterface') for (const field of fields.find(field => field.name === 'ui')?.fields ?? []) if (['responseTimeTodo','reviewSourceMark','reviewRegionUnused'].includes(field.name)) field.hidden = true;
}
