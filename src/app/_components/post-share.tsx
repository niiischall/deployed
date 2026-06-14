'use client';

import Image from 'next/image';
import { CopySimple, LinkedinLogo, WhatsappLogo, XLogo } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';

type PostShareProps = {
  title: string;
  postUrl: string;
  coverImage?: string;
};

const iconButtonClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-300/90 bg-white/70 text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300';

export function PostShare({ title, postUrl, coverImage }: PostShareProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedText = encodeURIComponent(`${title} - ${postUrl}`);

    return {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    };
  }, [postUrl, title]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <section className='mx-auto mt-12 max-w-2xl rounded-lg border border-slate-300/70 bg-slate-50/70 p-4 dark:border-slate-700/80 dark:bg-slate-900/40 sm:p-5'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        {coverImage ? (
          <div className='sm:w-56 sm:shrink-0'>
            <Image
              src={coverImage}
              alt={`Cover image for ${title}`}
              width={560}
              height={315}
              className='h-auto w-full rounded-md object-cover'
            />
          </div>
        ) : null}
        <div className='flex-1'>
          <p className='text-2xl leading-tight text-slate-900 dark:text-slate-100'>
            Enjoyed this post?
          </p>
          <p className='mt-1 text-slate-600 dark:text-slate-300'>
            Share it with someone who&apos;ll find it useful.
          </p>
          <div className='mt-4 flex flex-wrap items-center gap-2'>
            <button
              type='button'
              onClick={handleCopy}
              className='inline-flex h-11 min-w-40 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold uppercase tracking-wide text-slate-50 transition-colors hover:bg-sky-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-sky-300'
            >
              <CopySimple className='h-4 w-4' aria-hidden='true' weight='bold' />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={shareLinks.twitter}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Share on Twitter'
              className={iconButtonClass}
            >
              <XLogo className='h-6 w-6' aria-hidden='true' weight='regular' />
            </a>

            <a
              href={shareLinks.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Share on LinkedIn'
              className={iconButtonClass}
            >
              <LinkedinLogo className='h-6 w-6' aria-hidden='true' weight='regular' />
            </a>

            <a
              href={shareLinks.whatsapp}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Share on WhatsApp'
              className={iconButtonClass}
            >
              <WhatsappLogo className='h-6 w-6' aria-hidden='true' weight='regular' />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
