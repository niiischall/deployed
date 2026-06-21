'use client';
import posthog from 'posthog-js';
import Logo from './logo';

export function Intro() {
  const handleClick = () => {
    posthog.capture('Portfolio Link Clicked', {});
  };

  return (
    <section className='flex items-center gap-4 mt-16 mb-16 md:mb-12'>
      <h1 className='leading-tight'>
        <a
          href={`https://www.nischalnikit.xyz`}
          target='blank'
          onClick={handleClick}
          aria-label='deployed by nischal'
          className='inline-block'
        >
          <Logo className='h-20 w-auto md:h-28' />
        </a>
      </h1>
    </section>
  );
}
