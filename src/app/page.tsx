import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { HeroPost } from '@/app/_components/hero-post';
import { MoreStories } from '@/app/_components/more-stories';
import { SectionSeparator } from '@/app/_components/section-separator';
import { getAllPosts, REVALIDATE_SECONDS } from '@/lib/api';

export const revalidate = REVALIDATE_SECONDS;

export default async () => {
  const allPosts = await getAllPosts();

  const heroPost = allPosts[0];
  const morePosts = allPosts.length > 1 ? allPosts?.slice(1) : [];
  const isMorePostsPresent = morePosts.length > 0;

  return (
    <main>
      <Container>
        <Header />
        {heroPost ? (
          <HeroPost
            title={heroPost.title}
            slug={heroPost.slug}
            coverImage={heroPost.coverImage.url}
            date={heroPost.publishedAt}
            excerpt={heroPost.subtitle}
          />
        ) : (
          <p className='mb-16 text-lg'>No posts published yet.</p>
        )}
        {isMorePostsPresent ? (
          <>
            <SectionSeparator />
            <MoreStories posts={morePosts} />
          </>
        ) : null}
      </Container>
    </main>
  );
};
