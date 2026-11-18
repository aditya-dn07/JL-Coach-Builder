import 'server-only';
import { createClient, type SanityClient } from '@sanity/client';
import { getSanityIdentifiers } from '../../src/lib/sanity/config';
// Lazy: importing a handler never instantiates a client or performs a write.
export function getWriteClient(): SanityClient | undefined {
  // Legacy token compatibility is server-only; new deployments need only SANITY_WRITE_TOKEN.
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
  const { projectId, dataset: contentDataset } = getSanityIdentifiers();
  const dataset = process.env.SANITY_SUBMISSIONS_DATASET;
  const studioDataset = process.env.NEXT_PUBLIC_SANITY_SUBMISSIONS_DATASET;
  // Never fall back to the content dataset or save into a workspace pointing elsewhere.
  // The owner must additionally restrict this dataset's actual Sanity access permissions.
  if (!token || !projectId || !dataset || !studioDataset || dataset !== studioDataset || dataset === contentDataset) return undefined;
  return createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false, timeout: 3000, maxRetries: 0 });
}
