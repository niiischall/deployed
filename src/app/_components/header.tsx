import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from './theme-switcher';

const Header = () => {
  return (
    <div className='relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-5'>
      <div className='mx-auto mb-20 mt-8 flex max-w-5xl items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div>
            <Image
              src={'/assets/intro/title.png'}
              alt={`Cover Image`}
              className={'shadow-sm hover:shadow-lg transition-shadow duration-200'}
              style={{ borderRadius: '50%' }}
              width={40}
              height={40}
            />
          </div>
          <h2 className='flex items-center text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter'>
            <Link href='/' className='hover:underline'>
              deployed
            </Link>
            .
          </h2>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Header;
