import CoverImage from '@/app/_components/cover-image';
import { type Author } from '@/interfaces/author';
import Link from 'next/link';
import DateFormatter from './date-formatter';

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <section>
      <div className='mb-8 md:mb-16'>
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <div className='mb-20'>
        <div>
          <h3 className='mb-4 text-3xl leading-tight'>
            <Link href={`/posts/${slug}`} className='hover:underline'>
              {title}
            </Link>
          </h3>
          <div className='mb-4 md:mb-0 text-lg'>
            <DateFormatter dateString={date} />
          </div>
        </div>
        <div>
          <p className='text-lg leading-relaxed'>{excerpt}</p>
        </div>
      </div>
    </section>
  );
}
