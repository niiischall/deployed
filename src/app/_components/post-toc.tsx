'use client';

import posthog from 'posthog-js';

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

type PostTocProps = {
  items: TocItem[];
  postSlug: string;
  postTitle: string;
};

export function PostToc({ items, postSlug, postTitle }: PostTocProps) {
  const handleTocClick = (item: TocItem) => {
    posthog.capture('Post TOC Clicked', {
      post_slug: postSlug,
      post_title: postTitle,
      section_id: item.id,
      section_title: item.text,
      section_level: item.level,
    });
  };

  return (
    <ul className='space-y-2 text-[1.3125rem] leading-7'>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={() => handleTocClick(item)}
            className={`block text-slate-700 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 ${
              item.level === 3 ? 'pl-3' : item.level === 4 ? 'pl-6' : ''
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
