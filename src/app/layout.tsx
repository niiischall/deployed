import type { Metadata } from 'next';
import { Ovo } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Footer from './_components/footer';
import { ThemeScript } from './_components/theme-switcher';
import { PostHogProvider } from './providers';
import './globals.css';
import './highlight.css';

const ovo = Ovo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ovo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.nischalnikit.xyz'),
  title: {
    default: 'deployed by nischal',
    template: '%s | deployed by nischal',
  },
  description: `A collection of writeups by nischal nikit`,
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${ovo.variable} scroll-smooth motion-reduce:scroll-auto`}
    >
      <head>
        <meta name='theme-color' content='#EEEAE3'></meta>
        <meta property='og:image' content='<generated>' />
        <meta property='og:image:alt' content='deployed by nischal' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta name='twitter:image' content='<generated>' />
        <meta name='twitter:image:type' content='<generated>' />
        <meta name='twitter:image:width' content='<generated>' />
        <meta name='twitter:image:height' content='<generated>' />
      </head>
      <body className={'bg-light dark:bg-slate-900 dark:text-slate-200'}>
        <PostHogProvider>
          <ThemeScript />
          <div className='flex min-h-screen flex-col'>
            <main className='flex-1'>{children}</main>
            <Footer />
          </div>
        </PostHogProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
