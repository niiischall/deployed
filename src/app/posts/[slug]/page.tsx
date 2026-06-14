import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { REVALIDATE_SECONDS, fetchPostBySlug, getAllPostSlugs } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';
import { calculateReadingTime } from '@/lib/utils';

export const revalidate = REVALIDATE_SECONDS;

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

const stripHtmlTags = (value: string) => value.replace(/<[^>]*>/g, '').trim();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const addHeadingIdsAndExtractToc = (html: string) => {
  const slugCounts = new Map<string, number>();
  const tocItems: TocItem[] = [];

  const contentWithHeadingIds = html.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1>/gi,
    (_, level, attributes, innerHtml) => {
      const text = stripHtmlTags(innerHtml);

      if (!text) {
        return `<h${level}${attributes}>${innerHtml}</h${level}>`;
      }

      const baseSlug = slugify(text) || 'section';
      const existingCount = slugCounts.get(baseSlug) ?? 0;
      slugCounts.set(baseSlug, existingCount + 1);
      const id = existingCount === 0 ? baseSlug : `${baseSlug}-${existingCount + 1}`;
      const attributesWithoutId = attributes.replace(/\s+id=(["']).*?\1/gi, '');

      tocItems.push({
        id,
        text,
        level: Number(level) as TocItem['level'],
      });

      return `<h${level}${attributesWithoutId} id="${id}">${innerHtml}</h${level}>`;
    }
  );

  return { contentWithHeadingIds, tocItems };
};

export default async function Post(props: Params) {
  const params = await props.params;
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content.markdown || '');
  const { contentWithHeadingIds, tocItems } = addHeadingIdsAndExtractToc(content);
  const readingTime = calculateReadingTime(content);
  const postUrl = `https://blog.nischalnikit.xyz/posts/${post.slug}`;
  const description =
    post.excerpt || post.subtitle || `Read ${post.title} on deployed by nischal.`;
  const imageUrl = post.coverImage.url || 'https://blog.nischalnikit.xyz/opengraph-image.png';
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: [imageUrl],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    author: {
      '@type': 'Person',
      name: post.author.name || 'Nischal Nikit',
    },
    publisher: {
      '@type': 'Person',
      name: 'Nischal Nikit',
    },
    url: postUrl,
  };

  return (
    <main>
      <Container>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
        <Header />
        <article className='mb-32'>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage.url}
            date={post.publishedAt}
          />
          <div className='max-w-2xl mx-auto'>
            <div className='mb-6 text-lg'>
              <p>{readingTime}</p>
            </div>
          </div>
          {tocItems.length > 0 ? (
            <div className='max-w-2xl mx-auto mb-8'>
              <div className='max-w-xl rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80'>
                <p className='mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300'>
                  On this page
                </p>
                <nav aria-label='Table of contents'>
                  <ul className='space-y-2 text-[1.3125rem] leading-7'>
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block text-slate-700 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 ${
                            item.level === 3 ? 'pl-3' : item.level === 4 ? 'pl-6' : ''
                          }`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          ) : null}
          <div className='mt-10'>
            <PostBody content={contentWithHeadingIds} />
          </div>
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | deployed by nischal`;
  const description =
    post.excerpt || post.subtitle || `Read ${post.title} on deployed by nischal.`;
  const canonicalUrl = `https://blog.nischalnikit.xyz/posts/${post.slug}`;
  const imageUrl = post.coverImage.url || 'https://blog.nischalnikit.xyz/opengraph-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      siteName: 'deployed by nischal',
      publishedTime: post.publishedAt || undefined,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
