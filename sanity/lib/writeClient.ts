import 'server-only';
import { createClient, type SanityClient } from '@sanity/client';
import { getSanityIdentifiers } from '../../src/lib/sanity/config';
// Lazy: importing a handler never instantiates a client or performs a write.
export function getWriteClient(): SanityClient | undefined {
  // Legacy token compatibility is server-only; new deployments need only SANITY_WRITE_TOKEN.
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  const { projectId, dataset: contentDataset } = getSanityIdentifiers();
  const studioDataset = process.env.NEXT_PUBLIC_SANITY_SUBMISSIONS_DATASET || contentDataset;
  const dataset = process.env.SANITY_SUBMISSIONS_DATASET || studioDataset;
  // A shared public dataset is supported: saveSubmission always uses a private subpath ID.
  // Prevent saving somewhere different from the Studio's configured dataset.
  if (!token || !projectId || dataset !== studioDataset) return undefined;
  return createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false, timeout: 3000, maxRetries: 0 });
}
