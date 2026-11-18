// Repair only invalid fields, so one bad edit cannot discard valid sibling changes.
export function validateContent<T>(
  schema: { safeParse(value: unknown): { success: boolean; data?: T; error?: { issues: readonly { path: readonly PropertyKey[] }[] } } },
  candidate: unknown, fallback: T,
): T {
  let current = structuredClone(candidate);
  for (let attempt = 0; attempt < 5; attempt++) {
    const parsed = schema.safeParse(current);
    if (parsed.success) return parsed.data as T;
    for (const issue of parsed.error?.issues ?? []) {
      if (!issue.path.length) return fallback;
      const path = issue.path as (string | number)[];
      let candidateParent: unknown = current, fallbackParent: unknown = fallback;
      let removed = false;
      for (const key of path) {
        if (Array.isArray(candidateParent) && typeof key === 'number' && (!Array.isArray(fallbackParent) || fallbackParent[key] === undefined)) {
          candidateParent.splice(key, 1); removed = true; break;
        }
        candidateParent = candidateParent && typeof candidateParent === 'object' ? (candidateParent as Record<PropertyKey, unknown>)[key] : undefined;
        fallbackParent = fallbackParent && typeof fallbackParent === 'object' ? (fallbackParent as Record<PropertyKey, unknown>)[key] : undefined;
      }
      if (removed) continue;
      let target = current as Record<string | number, unknown>;
      let source = fallback as unknown as Record<string | number, unknown> | undefined;
      for (const key of path.slice(0, -1)) {
        if (!target || typeof target !== 'object') return fallback;
        target = target[key] as Record<string | number, unknown>;
        source = source?.[key] as Record<string | number, unknown> | undefined;
      }
      if (target && typeof target === 'object') {
        const key = path[path.length - 1];
        if (source?.[key] === undefined) delete target[key];
        else target[key] = structuredClone(source[key]);
      }
    }
  }
  return fallback;
}
