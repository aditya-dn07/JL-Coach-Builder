// Identifiers are public; no read/write credentials belong in this shared module.
export function getSanityIdentifiers() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  };
}
