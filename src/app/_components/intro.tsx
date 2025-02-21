import Image from 'next/image';

export function Intro() {
  return (
    <section className='flex items-center gap-4 md:gap-8 mt-16 mb-16 md:mb-12'>
      <a href={`https://www.nischalnikit.xyz`} target='blank'>
        <Image
          src={'/assets/intro/title.png'}
          alt={`Cover Image`}
          className={
            'shadow-sm hover:shadow-lg transition-shadow duration-200 w-[40px] h-[40px] md:w-[80px] md:h-[80px]'
          }
          style={{ borderRadius: '50%' }}
          width={80}
          height={80}
        />
      </a>
      <h1 className='text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8'>
        deployed.
      </h1>
    </section>
  );
}
