import { Post } from '@/interfaces/post';
import { allPostsQuery, postBySlugQuery, postSlugsQuery } from './sanity/queries';
import { isSanityConfigured, sanityClient } from './sanity/client';
import { SanityPost } from './sanity/types';
import { resolveSanityImageUrl } from './sanity/image';

const mapSanityPostToPost = (post: SanityPost): Post => ({
  id: post._id,
  slug: post.slug?.current || '',
  title: post.title,
  subtitle: post.excerpt || '',
  publishedAt: post.publishedAt || new Date(0).toISOString(),
  coverImage: {
    url: resolveSanityImageUrl(post.coverImage, post.coverImageUrl),
  },
  excerpt: post.excerpt || '',
  author: {
    name: post.author?.name || 'Unknown author',
    picture: '',
  },
  content: {
    markdown: post.markdown || '',
  },
  tags: post.tags?.map((tag) => tag.title) || [],
});

export const getAllPosts = async (): Promise<Post[]> => {
  if (!isSanityConfigured) {
    console.warn(
      'Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.'
    );
    return [];
  }

  try {
    const posts = await sanityClient.fetch<SanityPost[]>(allPostsQuery);
    return posts.map(mapSanityPostToPost).filter((post) => Boolean(post.slug));
  } catch (error) {
    console.error('Failed to fetch posts from Sanity:', error);
    return [];
  }
};

export const fetchPostBySlug = async (
  slug: string
): Promise<Post | null> => {
  if (!isSanityConfigured) {
    return null;
  }

  try {
    const post = await sanityClient.fetch<SanityPost | null>(postBySlugQuery, {
      slug,
    });
    return post ? mapSanityPostToPost(post) : null;
  } catch (error) {
    console.error(`Failed to fetch post "${slug}" from Sanity:`, error);
    return null;
  }
};

export const getAllPostSlugs = async (): Promise<string[]> => {
  if (!isSanityConfigured) {
    return [];
  }

  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(postSlugsQuery);
    return slugs.map((entry) => entry.slug).filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch post slugs from Sanity:', error);
    return [];
  }
};
