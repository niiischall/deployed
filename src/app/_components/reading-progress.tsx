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

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

const METER_SIZE = 104;
const METER_STROKE = 6;
const METER_RADIUS = (METER_SIZE - METER_STROKE) / 2;
const METER_CIRCUMFERENCE = 2 * Math.PI * METER_RADIUS;
const METER_INNER_BORDER_RADIUS = METER_RADIUS - METER_STROKE / 2;

type MeterTheme = {
  ring: string;
  label: string;
  bar: string;
};

const METER_THEMES: ReadonlyArray<{ min: number; theme: MeterTheme }> = [
  {
    min: 100,
    theme: {
      ring: 'text-emerald-500 dark:text-emerald-400',
      label: 'text-emerald-600 dark:text-emerald-300',
      bar: 'bg-emerald-500 dark:bg-emerald-400',
    },
  },
  {
    min: 75,
    theme: {
      ring: 'text-amber-500 dark:text-amber-400',
      label: 'text-amber-600 dark:text-amber-300',
      bar: 'bg-amber-500 dark:bg-amber-400',
    },
  },
  {
    min: 50,
    theme: {
      ring: 'text-violet-500 dark:text-violet-400',
      label: 'text-violet-600 dark:text-violet-300',
      bar: 'bg-violet-500 dark:bg-violet-400',
    },
  },
  {
    min: 25,
    theme: {
      ring: 'text-sky-500 dark:text-sky-400',
      label: 'text-sky-600 dark:text-sky-300',
      bar: 'bg-sky-500 dark:bg-sky-400',
    },
  },
  {
    min: 0,
    theme: {
      ring: 'text-slate-400 dark:text-slate-500',
      label: 'text-slate-600 dark:text-slate-300',
      bar: 'bg-slate-400 dark:bg-slate-500',
    },
  },
];

const getMeterTheme = (progress: number): MeterTheme =>
  (
    METER_THEMES.find((entry) => progress >= entry.min) ??
    METER_THEMES[METER_THEMES.length - 1]
  ).theme;

export function ReadingProgress({
  contentSelector,
  tracking,
}: ReadingProgressProps) {
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
      const ratio = clamp(
        (viewportBottom - contentTop) / totalScrollableContent,
        0,
        1,
      );
      const depthPercent = Math.round(ratio * 100);

      if (tracking) {
        for (const milestone of SCROLL_MILESTONES) {
          if (
            depthPercent >= milestone &&
            !firedMilestonesRef.current.has(milestone)
          ) {
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

  const meterTheme = getMeterTheme(progress);
  const dashOffset = METER_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <>
      <div
        aria-hidden='true'
        className='pointer-events-none fixed left-0 top-0 z-50 h-1 w-full bg-slate-200/60 md:hidden dark:bg-slate-800/70'
      >
        <div
          className={`h-full transition-[width] duration-100 transition-colors duration-300 ${meterTheme.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className='pointer-events-none fixed inset-x-0 top-32 z-50 hidden px-5 md:block'>
      <div className='mx-auto flex max-w-5xl justify-end'>
        <div
          role='progressbar'
          aria-label='Reading progress'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className='pointer-events-auto relative flex items-center justify-center rounded-full border border-slate-400/70 transition-colors dark:border-slate-600'
        >
          <svg
            width={METER_SIZE}
            height={METER_SIZE}
            viewBox={`0 0 ${METER_SIZE} ${METER_SIZE}`}
            className={`-rotate-90 transition-colors duration-300 ${meterTheme.ring}`}
          >
            <circle
              cx={METER_SIZE / 2}
              cy={METER_SIZE / 2}
              r={METER_RADIUS}
              fill='none'
              strokeWidth={METER_STROKE}
              className='stroke-slate-200 dark:stroke-slate-700'
            />
            <circle
              cx={METER_SIZE / 2}
              cy={METER_SIZE / 2}
              r={METER_INNER_BORDER_RADIUS}
              fill='none'
              strokeWidth={1}
              className='stroke-slate-400/70 dark:stroke-slate-600'
            />
            <circle
              cx={METER_SIZE / 2}
              cy={METER_SIZE / 2}
              r={METER_RADIUS}
              fill='none'
              strokeWidth={METER_STROKE}
              strokeLinecap='round'
              stroke='currentColor'
              strokeDasharray={METER_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className='transition-[stroke-dashoffset] duration-150 ease-out'
            />
          </svg>
          <span
            className={`absolute flex flex-col items-center leading-tight transition-colors duration-300 ${meterTheme.label}`}
          >
            <span className='text-lg font-semibold tabular-nums'>
              {progress}%
            </span>
            <span className='text-[10px] font-medium uppercase tracking-wide'>
              completed
            </span>
          </span>
        </div>
      </div>
      </div>
    </>
  );
}
