import Link from 'next/link';
import Header from '@/app/_components/header';
import Container from '@/app/_components/container';

export default function ContactPage() {
  return (
    <main>
      <Container>
        <Header />
        <article className='mx-auto max-w-2xl space-y-4 pb-12'>
          <h1 className='text-4xl font-bold leading-tight tracking-tight md:text-5xl'>Contact</h1>
          <p>For collaborations, feedback, or questions, reach out on LinkedIn.</p>
          <p>
            <Link
              href='https://www.linkedin.com/in/niiischall/'
              target='_blank'
              rel='noopener noreferrer'
              className='underline underline-offset-4 hover:text-sky-600'
            >
              linkedin.com/in/niiischall
            </Link>
          </p>
        </article>
      </Container>
    </main>
  );
}
