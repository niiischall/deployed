'use client';

import { useEffect, useRef, useState } from 'react';
import posthog from 'posthog-js';

type ReadingProgressProps = {
  contentSelector: string;
  tracking?: {
    postSlug: string;
    postTitle: string;
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

export function ReadingProgress({ contentSelector, tracking }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const firedMilestonesRef = useRef<Set<number>>(new Set());
  const hasCapturedCompletionRef = useRef(false);

  useEffect(() => {
    const content = document.querySelector<HTMLElement>(contentSelector);

    if (!content) {
      return;
    }

    const updateProgress = () => {
      const rect = content.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const viewportBottom = window.scrollY + viewportHeight;
      const contentTop = window.scrollY + rect.top;
      const totalScrollableContent = Math.max(content.scrollHeight, 1);
      const ratio = clamp((viewportBottom - contentTop) / totalScrollableContent, 0, 1);
      const depthPercent = Math.round(ratio * 100);

      if (tracking) {
        for (const milestone of SCROLL_MILESTONES) {
          if (depthPercent >= milestone && !firedMilestonesRef.current.has(milestone)) {
            firedMilestonesRef.current.add(milestone);
            posthog.capture('Post Scroll Depth Reached', {
              post_slug: tracking.postSlug,
              post_title: tracking.postTitle,
              scroll_depth_percent: milestone,
            });
          }
        }

        if (depthPercent >= 100 && !hasCapturedCompletionRef.current) {
          hasCapturedCompletionRef.current = true;
          posthog.capture('Post Reading Completed', {
            post_slug: tracking.postSlug,
            post_title: tracking.postTitle,
          });
        }
      }

      setProgress(Math.round(ratio * 100));
    };
    updateProgress();

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [contentSelector, tracking]);

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed left-0 top-0 z-50 h-1 w-full bg-slate-200/60 dark:bg-slate-800/70'
    >
      <div
        className='h-full bg-lime-400 transition-[width] duration-100 dark:bg-lime-300'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
