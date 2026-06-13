import { type Author } from './author';

export type Post = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  coverImage: {
    url: string;
  };
  author: Author;
  excerpt: string;
  content: {
    markdown: string;
  };
  tags: string[];
  preview?: boolean;
};
