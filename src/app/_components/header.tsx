import Link from 'next/link';
import { ThemeSwitcher } from './theme-switcher';
import Logo from './logo';

const Header = () => {
  return (
    <div className='relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-5'>
      <div className='mx-auto mb-20 mt-8 flex max-w-5xl items-center justify-between gap-4'>
        <Link href='/' aria-label='deployed by nischal - home' className='inline-block'>
          <Logo />
        </Link>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Header;
