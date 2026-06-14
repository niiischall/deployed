import Link from 'next/link';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-16 border-t border-slate-300/70 py-6 dark:border-slate-700/80'>
      <div className='container mx-auto flex flex-col gap-4 px-5 text-sm text-slate-700 dark:text-slate-300 md:max-w-5xl'>
        <p className='flex items-center gap-2'>
          <span aria-hidden='true'>©</span>
          <span>{year} deployed by nischal. All rights reserved.</span>
        </p>

        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-wrap items-center gap-5'>
            <Link
              href='https://www.linkedin.com/in/niiischall/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 underline underline-offset-4 hover:text-sky-600'
            >
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='h-4 w-4'
                fill='currentColor'
              >
                <path d='M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.78v2.19h.07c.66-1.25 2.29-2.57 4.71-2.57 5.03 0 5.96 3.31 5.96 7.62V24h-5v-7.75c0-1.85-.03-4.22-2.57-4.22-2.58 0-2.97 2.01-2.97 4.09V24h-5V8z' />
              </svg>
              <span>LinkedIn</span>
            </Link>

            <Link
              href='https://github.com/niiischall'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 underline underline-offset-4 hover:text-sky-600'
            >
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='h-4 w-4'
                fill='currentColor'
              >
                <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58 0-.28-.01-1.03-.02-2.01-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.56.12-3.25 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02 0 2.04.14 3 .41 2.29-1.55 3.3-1.23 3.3-1.23.66 1.69.24 2.94.12 3.25.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.64-5.48 5.95.43.37.82 1.1.82 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.69.82.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' />
              </svg>
              <span>GitHub</span>
            </Link>

            <Link
              href='https://www.nischalnikit.xyz/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 hover:text-sky-600'
            >
              <span aria-hidden='true'>🌐</span>
              <span className='underline underline-offset-4'>Website</span>
            </Link>
          </div>

          <div className='flex flex-col gap-2 md:items-end'>
            <Link
              href='/feed.xml'
              className='inline-flex items-center gap-2 underline underline-offset-4 hover:text-sky-600'
            >
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='h-4 w-4 text-orange-500'
                fill='currentColor'
              >
                <path d='M6.18 17.82a1.64 1.64 0 1 1-3.28 0 1.64 1.64 0 0 1 3.28 0zM2.9 11.2v2.4a7.5 7.5 0 0 1 7.5 7.5h2.4c0-5.47-4.43-9.9-9.9-9.9zm0-4.7v2.4c7.98 0 14.45 6.47 14.45 14.45h2.4C19.75 13.96 12.29 6.5 2.9 6.5z' />
              </svg>
              <span>RSS</span>
            </Link>

            <nav className='flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide'>
              <Link href='/privacy' className='underline underline-offset-4 hover:text-sky-600'>
                Privacy
              </Link>
              <Link href='/terms' className='underline underline-offset-4 hover:text-sky-600'>
                Terms
              </Link>
              <Link href='/contact' className='underline underline-offset-4 hover:text-sky-600'>
                Contact
              </Link>
              <Link
                href='/sitemap.xml'
                className='underline underline-offset-4 hover:text-sky-600'
              >
                Sitemap
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
