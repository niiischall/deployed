import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <div className='flex mb-20 mt-8 gap-4'>
      <div className=''>
        <Image
          src={'/assets/intro/title.png'}
          alt={`Cover Image`}
          className={'shadow-sm hover:shadow-lg transition-shadow duration-200'}
          style={{ borderRadius: '50%' }}
          width={40}
          height={40}
        />
      </div>
      <h2 className='text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tightflex items-center'>
        <Link href='/' className='hover:underline'>
          deployed
        </Link>
        .
      </h2>
    </div>
  );
};

export default Header;
