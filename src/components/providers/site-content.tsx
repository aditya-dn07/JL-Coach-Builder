'use client';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ContentSnapshot } from '../../content/snapshot';
import { recoveryCopy } from '../../content/recovery';
import { createContentView } from '../../content/view';
const SiteContentContext = createContext<ContentSnapshot | null>(null);
export function SiteContentProvider({ value, children }: { value: ContentSnapshot; children: ReactNode }) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}
export function useSiteContent() {
  const snapshot = useContext(SiteContentContext);
  if (!snapshot) throw new Error('Site content provider is required.');
  return useMemo(() => createContentView(snapshot), [snapshot]);
}

export const useRecoveryCopy = () => useContext(SiteContentContext)?.editorial.interface.recovery ?? recoveryCopy;
