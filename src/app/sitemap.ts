import type { MetadataRoute } from 'next';
import { getAllPostSlugs } from '@/lib/api';

const siteUrl = 'https://blog.nischalnikit.xyz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const slugs = await getAllPostSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/posts/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...postRoutes];
}
