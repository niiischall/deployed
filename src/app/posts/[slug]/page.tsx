import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPostBySlug, getAllPostSlugs } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';
import { calculateReadingTime } from '@/lib/utils';

export const revalidate = 60;

export default async function Post(props: Params) {
  const params = await props.params;
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content.markdown || '');
  const readingTime = calculateReadingTime(content);

  return (
    <main>
      <Container>
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
          <PostBody content={content} />
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
