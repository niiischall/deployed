import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPostBySlug, getAllPosts } from '@/lib/api';
import markdownToHtml from '@/lib/markdownToHtml';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { PostBody } from '@/app/_components/post-body';
import { PostHeader } from '@/app/_components/post-header';
import createApolloClient from '@/lib/apollo-client';
import { calculateReadingTime } from '@/lib/utils';

export default async function Post(props: Params) {
  const params = await props.params;
  const client = createApolloClient();

  const post = await fetchPostBySlug({
    client,
    hostname: process.env.NEXT_HASHNODE_HOSTNAME,
    slug: params.slug,
  });

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post?.content?.markdown || '');
  const readingTime = calculateReadingTime(content);

  return (
    <main>
      <Container>
        <Header />
        <article className='mb-32'>
          <PostHeader
            title={post?.title}
            coverImage={post?.coverImage?.url}
            date={post?.publishedAt}
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
  const client = createApolloClient();
  const post = await fetchPostBySlug({
    client,
    hostname: process.env.NEXT_HASHNODE_HOSTNAME,
    slug: params.slug,
  });

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | deployed by nischal`;

  return {
    title,
    openGraph: {
      title,
      images: [
        {
          url: post.coverImage.url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      images: [post.coverImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
