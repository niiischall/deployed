'use client';

import { useEffect, useState } from 'react';

type ReadingProgressProps = {
  contentSelector: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ReadingProgress({ contentSelector }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const content = document.querySelector<HTMLElement>(contentSelector);

    if (!content) {
      return;
    }

    const updateProgress = () => {
      const rect = content.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const markerPosition = viewportHeight * 0.3;
      const distanceIntoContent = markerPosition - rect.top;
      const totalScrollableContent = Math.max(content.scrollHeight, 1);
      const ratio = clamp(distanceIntoContent / totalScrollableContent, 0, 1);
      setProgress(Math.round(ratio * 100));
    };
    updateProgress();

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [contentSelector]);

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
