// Dots denote private Sanity subpaths; published website documents need root IDs.
export const toSanityDocumentId = logicalId => logicalId.replaceAll('.', '__');
export const fromSanityDocumentId = documentId => documentId.replace(/^drafts\./, '').replaceAll('__', '.');
