import { groq } from 'next-sanity';

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    coverImageUrl,
    markdown,
    author->{
      _id,
      name,
      picture
    },
    tags[]->{
      _id,
      title
    }
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    coverImage,
    coverImageUrl,
    markdown,
    author->{
      _id,
      name,
      picture
    },
    tags[]->{
      _id,
      title
    }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current
  }
`;
