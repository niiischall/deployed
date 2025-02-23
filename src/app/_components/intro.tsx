'use client';
import Image from 'next/image';
import posthog from 'posthog-js';

export function Intro() {
  const handleClick = () => {
    posthog.capture('Portfolio Link Clicked', {});
  };

  return (
    <section className='flex items-center gap-4 mt-16 mb-16 md:mb-12'>
      <a
        href={`https://www.nischalnikit.xyz`}
        target='blank'
        onClick={handleClick}
      >
        <Image
          src={'/assets/intro/title.png'}
          alt={`Cover Image`}
          className={
            'shadow-sm hover:shadow-lg transition-shadow duration-200 w-[40px] h-[40px]'
          }
          style={{ borderRadius: '50%' }}
          width={80}
          height={80}
        />
      </a>
      <h1 className='text-5xl font-bold tracking-tighter leading-tight md:pr-8'>
        deployed.
      </h1>
    </section>
  );
}
