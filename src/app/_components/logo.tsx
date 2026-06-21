type LogoProps = {
  className?: string;
};

const Logo = ({ className = 'h-[72px] w-auto md:h-[84px]' }: LogoProps) => {
  return (
    <svg
      viewBox='0 0 400 120'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      className={`text-neutral-900 dark:text-slate-200 ${className}`}
    >
      <text
        x='12'
        y='62'
        fontFamily='monospace'
        fontSize='48'
        fontWeight='700'
        className='fill-current opacity-40'
      >
        {'{'}
      </text>
      <text
        x='40'
        y='65'
        fontFamily='monospace'
        fontSize='52'
        fontWeight='700'
        letterSpacing='-2'
        className='fill-current'
      >
        deployed
      </text>
      <text
        x='42'
        y='95'
        fontFamily='var(--font-ovo), serif'
        fontSize='18'
        letterSpacing='1'
        className='fill-current opacity-50'
      >
        by nischal
      </text>
      <polygon points='295,45 305,25 315,45' className='fill-current' />
      <polygon points='295,55 290,65 300,60' className='fill-current opacity-60' />
      <polygon points='315,55 320,65 310,60' className='fill-current opacity-60' />
      <circle cx='305' cy='40' r='6' className='fill-light dark:fill-slate-900' />
      <circle cx='305' cy='40' r='3' className='fill-current' />
      <polygon points='300,68 305,78 310,68' className='fill-current opacity-40' />
      <rect
        x='265'
        y='45'
        width='8'
        height='32'
        className='fill-current opacity-30'
      />
    </svg>
  );
};

export default Logo;
