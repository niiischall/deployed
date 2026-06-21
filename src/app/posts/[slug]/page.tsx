import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPostBySlug, getAllPostSlugs, getAllPosts } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import { getLifetimePostViews } from '@/lib/posthog';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import DateFormatter from '@/app/_components/date-formatter';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';
import { ReadingProgress } from '@/app/_components/reading-progress';
import { PostShare } from '@/app/_components/post-share';
import { PostToc } from '@/app/_components/post-toc';
import { calculateReadingTime } from '@/lib/utils';

export const revalidate = 60;

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
  const lifetimeViews = await getLifetimePostViews(postUrl);
  const allPosts = await getAllPosts();
  const currentPostIndex = allPosts.findIndex((entry) => entry.slug === post.slug);
  const previousPost = currentPostIndex >= 0 ? allPosts[currentPostIndex + 1] : null;
  const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null;
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
      <ReadingProgress
        contentSelector='#post-content'
        tracking={{ postSlug: post.slug, postTitle: post.title }}
      />
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
            showDate={false}
          />
          <div className='max-w-2xl mx-auto'>
            <div className='mb-3 text-lg'>
              <div className='flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4'>
                <p className='inline-flex items-center gap-2'>
                  <DateFormatter dateString={post.publishedAt} />
                </p>
                <p className='inline-flex items-center gap-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    className='h-5 w-5'
                    aria-hidden='true'
                  >
                    <circle cx='12' cy='12' r='8.5' />
                    <path d='M12 7.5v5l3.5 2' />
                  </svg>
                  <span>{readingTime}</span>
                </p>
                {lifetimeViews !== null ? (
                  <p className='inline-flex items-center gap-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.8'
                      className='h-5 w-5'
                      aria-hidden='true'
                    >
                      <path d='M1.5 12s3.8-7 10.5-7 10.5 7 10.5 7-3.8 7-10.5 7S1.5 12 1.5 12Z' />
                      <circle cx='12' cy='12' r='3.25' />
                    </svg>
                    <span>{lifetimeViews.toLocaleString()} views</span>
                  </p>
                ) : null}
              </div>
            </div>
            {post.tags?.length ? (
              <div className='mb-6 flex flex-wrap gap-2'>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 dark:border-slate-500 dark:text-slate-200'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {tocItems.length > 0 ? (
            <div className='max-w-2xl mx-auto mb-8'>
              <div className='max-w-xl rounded-lg border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80'>
                <p className='mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300'>
                  On this page
                </p>
                <nav aria-label='Table of contents'>
                  <PostToc items={tocItems} postSlug={post.slug} postTitle={post.title} />
                </nav>
              </div>
            </div>
          ) : null}
          <div className='mt-10'>
            <PostBody content={contentWithHeadingIds} />
          </div>
          <PostShare
            title={post.title}
            postUrl={postUrl}
            postSlug={post.slug}
            coverImage={post.coverImage.url}
          />
          {previousPost || nextPost ? (
            <section className='mx-auto mt-12 max-w-2xl border-t border-slate-300/70 pt-8 dark:border-slate-700/80'>
              <h2 className='mb-4 text-3xl leading-snug'>Keep reading</h2>
              <nav aria-label='Post navigation' className='grid gap-4 md:grid-cols-2'>
                <div>
                  {previousPost ? (
                    <Link
                      href={`/posts/${previousPost.slug}`}
                      className='group block rounded-md border border-transparent p-3 transition-colors hover:border-slate-300 hover:bg-white/70 dark:hover:border-slate-700 dark:hover:bg-slate-800/40'
                    >
                      {previousPost.coverImage.url ? (
                        <div className='mb-3 overflow-hidden rounded-md'>
                          <Image
                            src={previousPost.coverImage.url}
                            alt={`Cover image for ${previousPost.title}`}
                            width={640}
                            height={360}
                            className='h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]'
                          />
                        </div>
                      ) : null}
                      <p className='text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300'>
                        Previous Post
                      </p>
                      <p className='mt-1 text-lg text-slate-800 group-hover:text-sky-700 dark:text-slate-200 dark:group-hover:text-sky-400'>
                        ← {previousPost.title}
                      </p>
                    </Link>
                  ) : null}
                </div>
                <div className='md:text-right'>
                  {nextPost ? (
                    <Link
                      href={`/posts/${nextPost.slug}`}
                      className='group block rounded-md border border-transparent p-3 transition-colors hover:border-slate-300 hover:bg-white/70 dark:hover:border-slate-700 dark:hover:bg-slate-800/40'
                    >
                      {nextPost.coverImage.url ? (
                        <div className='mb-3 overflow-hidden rounded-md'>
                          <Image
                            src={nextPost.coverImage.url}
                            alt={`Cover image for ${nextPost.title}`}
                            width={640}
                            height={360}
                            className='h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]'
                          />
                        </div>
                      ) : null}
                      <p className='text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300'>
                        Next Post
                      </p>
                      <p className='mt-1 text-lg text-slate-800 group-hover:text-sky-700 dark:text-slate-200 dark:group-hover:text-sky-400'>
                        {nextPost.title} →
                      </p>
                    </Link>
                  ) : null}
                </div>
              </nav>
            </section>
          ) : null}
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

  const brandedTitle = `${post.title} | deployed by nischal`;
  const description =
    post.excerpt || post.subtitle || `Read ${post.title} on deployed by nischal.`;
  const canonicalUrl = `https://blog.nischalnikit.xyz/posts/${post.slug}`;
  const imageUrl = post.coverImage.url || 'https://blog.nischalnikit.xyz/opengraph-image.png';

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: brandedTitle,
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
      title: brandedTitle,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
