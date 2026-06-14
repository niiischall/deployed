import { REVALIDATE_SECONDS, getAllPosts } from '@/lib/api';

const siteUrl = 'https://blog.nischalnikit.xyz';

export const revalidate = 60;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET() {
  const posts = await getAllPosts();
  const now = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const title = escapeXml(post.title);
      const description = escapeXml(
        post.excerpt || post.subtitle || `Read ${post.title} on deployed by nischal.`
      );
      const url = `${siteUrl}/posts/${post.slug}`;
      const author = escapeXml(post.author.name || 'Nischal Nikit');
      const pubDate = new Date(post.publishedAt).toUTCString();

      return [
        '<item>',
        `<title>${title}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<description>${description}</description>`,
        `<author>${author}</author>`,
        `<pubDate>${pubDate}</pubDate>`,
        '</item>',
      ].join('');
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>deployed by nischal</title>
    <link>${siteUrl}</link>
    <description>A collection of writeups by nischal nikit</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': `s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate`,
    },
  });
}
