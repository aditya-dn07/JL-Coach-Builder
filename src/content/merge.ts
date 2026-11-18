// Empty CMS fields retain the source-backed default. Objects/array items merge without mutation.
export function mergeContent<T>(fallback: T, incoming: unknown): T {
  if (incoming === undefined || incoming === null || typeof incoming === 'string' && incoming.trim() === '') return fallback;
  if (fallback !== undefined && fallback !== null) {
    if (Array.isArray(fallback) !== Array.isArray(incoming)) return fallback;
    if (!Array.isArray(fallback) && typeof fallback !== typeof incoming) return fallback;
  }
  if (Array.isArray(incoming)) {
    if (!incoming.length) return fallback;
    const defaults = Array.isArray(fallback) ? fallback : [];
    return incoming.map((item, index) => {
      const id = item && typeof item === 'object' && 'id' in item ? item.id : undefined;
      const base = id ? defaults.find(value => value?.id === id) ?? defaults[index] : defaults[index];
      return mergeContent(base, item);
    }) as T;
  }
  if (typeof incoming === 'object') {
    const base = fallback && typeof fallback === 'object' && !Array.isArray(fallback) ? fallback : {};
    const result: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(incoming)) {
      if ((!key.startsWith('_') || ['_ref', '_type', '_key'].includes(key)) && key !== '@type' && key !== 'constructor' && key !== 'prototype') {
        // Sanity object metadata must not replace JSON-LD's distinct @type field.
        const sourceKey = key.startsWith('_') ? key : Object.keys(base).find(name => name.replace(/[^a-zA-Z0-9_]/g, '_') === key) ?? key;
        result[sourceKey] = mergeContent(result[sourceKey], value);
      }
    }
    return result as T;
  }
  return incoming as T;
}
