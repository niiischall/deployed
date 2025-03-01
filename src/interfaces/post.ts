import { type Author } from './author';

export type Post = {
  slug: string;
  title: string;
  publishedAt: string;
  coverImage: {
    url: string;
  };
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
};
