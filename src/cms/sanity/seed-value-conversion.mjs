export function keyed(value, fieldName = '') {
  if (Array.isArray(value)) return value.map((item, index) => item && typeof item === 'object'
    ? { ...keyed(item), _key: 'item-' + index, _type: ['links','descriptionLinks','answerLinks','relatedServices'].includes(fieldName) ? 'navigationLink' : 'alt' in item && ('src' in item || 'optimizedSrc' in item) ? 'accessibleImage' : fieldName + 'Item' } : item);
  if (value && typeof value === 'object') {
    const record = value;
    const result = Object.fromEntries(Object.entries(record).map(([key, item]) => [key.startsWith('_') ? key : key.replace(/[^a-zA-Z0-9_]/g, '_'), keyed(item, key.replace(/[^a-zA-Z0-9_]/g, '_'))]));
    if ('alt' in record && ('src' in record || 'optimizedSrc' in record)) {
      result._type = 'image'; result.decorative = !record.alt;
    }
    return result;
  }
  return value;
}
