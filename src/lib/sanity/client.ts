import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-01';
const token = process.env.SANITY_API_READ_TOKEN;

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = createClient({
  projectId: projectId || 'missing-project-id',
  dataset: dataset || 'missing-dataset',
  apiVersion,
  // Disable CDN to avoid stale content when ISR revalidation windows expire.
  useCdn: false,
  token,
  perspective: 'published',
});
