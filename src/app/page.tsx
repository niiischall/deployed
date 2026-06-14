import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import { Pagination } from '@/app/_components/pagination';
import { HeroPost } from '@/app/_components/hero-post';
import { MoreStories } from '@/app/_components/more-stories';
import { SectionSeparator } from '@/app/_components/section-separator';
import { TagFilters } from '@/app/_components/tag-filters';
import { getAllPosts } from '@/lib/api';

export const revalidate = 60;

const POSTS_PER_PAGE = 5;

type SearchParams = Record<string, string | string[] | undefined>;

const parsePageValue = (value: string | string[] | undefined): number => {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const parsedPage = Number.parseInt(firstValue || '1', 10);

  return Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
};

const parseTagValue = (value: string | string[] | undefined): string | null => {
  const firstValue = Array.isArray(value) ? value[0] : value;
  return firstValue?.trim() ? firstValue.trim() : null;
};

export default async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const resolvedSearchParams = (await searchParams) || {};
  const requestedPage = parsePageValue(resolvedSearchParams?.page);
  const requestedTag = parseTagValue(resolvedSearchParams?.tag);
  const allPosts = await getAllPosts();
  const heroPost = allPosts[0];
  const earlierDeployments = allPosts.length > 1 ? allPosts.slice(1) : [];
  const allTags = Array.from(
    new Set(earlierDeployments.flatMap((post) => post.tags).filter(Boolean))
  ).sort((firstTag, secondTag) => firstTag.localeCompare(secondTag));

  const filteredEarlierDeployments = requestedTag
    ? earlierDeployments.filter((post) => post.tags.includes(requestedTag))
    : earlierDeployments;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEarlierDeployments.length / POSTS_PER_PAGE)
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const postsForCurrentPage = filteredEarlierDeployments.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  const shouldRenderEarlierDeploymentsSection = earlierDeployments.length > 0;

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
        {shouldRenderEarlierDeploymentsSection ? (
          <>
            <SectionSeparator />
            <MoreStories
              posts={postsForCurrentPage}
              filters={<TagFilters tags={allTags} activeTag={requestedTag} />}
            />
          </>
        ) : null}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          activeTag={requestedTag}
        />
      </Container>
    </main>
  );
};
