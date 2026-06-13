export type SanitySlug = {
  current: string;
};

export type SanityImage = {
  asset?: {
    _ref: string;
    _type: 'reference';
  };
};

export type SanityAuthor = {
  _id: string;
  name: string;
  picture?: SanityImage;
};

export type SanityTag = {
  _id: string;
  title: string;
};

export type SanityPost = {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  publishedAt?: string;
  coverImage?: SanityImage;
  coverImageUrl?: string;
  markdown?: string;
  author?: SanityAuthor;
  tags?: SanityTag[];
};
