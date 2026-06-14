import Header from '@/app/_components/header';
import Container from '@/app/_components/container';

export default function TermsPage() {
  return (
    <main>
      <Container>
        <Header />
        <article className='mx-auto max-w-2xl space-y-4 pb-12'>
          <h1 className='text-4xl font-bold leading-tight tracking-tight md:text-5xl'>
            Terms of Use
          </h1>
          <p>
            All articles on this blog are shared for educational and informational purposes. Please
            credit this site when quoting or sharing excerpts.
          </p>
          <p>
            You are responsible for how you use any code snippets or technical guidance from these
            posts in your own projects.
          </p>
          <p>
            These terms may be updated as the site evolves. Continued use of the site implies
            acceptance of the latest version.
          </p>
        </article>
      </Container>
    </main>
  );
}
