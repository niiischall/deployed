'use client';

import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';

type Props = {
  tags: string[];
  activeTag: string | null;
};

const buildTagHref = (tag: string | null) => {
  if (!tag) {
    return '/';
  }

  const params = new URLSearchParams();
  params.set('tag', tag);
  return `/?${params.toString()}`;
};

const getButtonClassName = (isActive: boolean) =>
  `rounded-full border px-3 py-1 text-sm transition-colors ${
    isActive
      ? 'border-black bg-black text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
      : 'border-neutral-300 text-neutral-700 hover:border-neutral-500 hover:text-black dark:border-slate-500 dark:text-slate-200 dark:hover:border-slate-300 dark:hover:text-white'
  }`;

export const TagFilters = ({ tags, activeTag }: Props) => {
  const router = useRouter();

  const scrollToEarlierDeployments = () => {
    const tryScroll = () => {
      const target = document.getElementById('earlier-deployments');

      if (!target) {
        return false;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    };

    if (tryScroll()) {
      return;
    }

    window.requestAnimationFrame(() => {
      if (tryScroll()) {
        return;
      }

      window.setTimeout(() => {
        tryScroll();
      }, 120);
    });
  };

  const handleFilterSelect = (tag: string | null) => {
    posthog.capture('Tag Filter Clicked', {
      selected_tag: tag ?? 'all',
      previous_tag: activeTag ?? 'all',
      selected_all_tags: tag === null,
      was_already_active: activeTag === tag,
    });

    router.push(buildTagHref(tag), { scroll: false });
    scrollToEarlierDeployments();
  };

  if (!tags.length) {
    return null;
  }

  return (
    <section className='mb-10'>
      <h2 className='mb-4 text-xl font-semibold tracking-tight'>Filter by tag</h2>
      <div className='flex flex-wrap gap-2'>
        <button
          type='button'
          onClick={() => handleFilterSelect(null)}
          className={getButtonClassName(!activeTag)}
          aria-pressed={!activeTag}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type='button'
            onClick={() => handleFilterSelect(tag)}
            className={getButtonClassName(activeTag === tag)}
            aria-pressed={activeTag === tag}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
};
