import Container from '@/app/_components/container';
import { HeroPost } from '@/app/_components/hero-post';
import { Intro } from '@/app/_components/intro';
import { MoreStories } from '@/app/_components/more-stories';
import { SectionSeparator } from '@/app/_components/section-separator';
import { fetchAllPosts } from '@/lib/api';
import createApolloClient from '@/lib/apollo-client';

export default async () => {
  const client = createApolloClient();
  const allPosts = await fetchAllPosts(
    client,
    process.env.NEXT_HASHNODE_HOSTNAME
  );

  const heroPost = allPosts[0];
  const morePosts = allPosts.length > 1 ? allPosts?.slice(1) : [];
  const isMorePostsPresent = morePosts.length > 0;

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroPost?.title}
          slug={heroPost?.slug}
          coverImage={heroPost?.coverImage?.url}
          date={heroPost?.publishedAt}
          excerpt={heroPost?.subtitle}
        />
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
