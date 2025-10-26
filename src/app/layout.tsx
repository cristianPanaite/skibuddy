import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/use-toast';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  title: 'SkiBuddy — Poiana Brașov Ski Instructor Directory',
  description:
    'Discover verified ski instructors in Poiana Brașov and nearby resorts. Book your next lesson fast.',
  metadataBase: new URL('https://skibuddy.vercel.app'),
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-slate-50">
        <body className={cn('min-h-screen font-sans text-slate-900', inter.className)}>
          {plausibleDomain ? (
            <Script
              strategy="afterInteractive"
              data-domain={plausibleDomain}
              src="https://plausible.io/js/script.js"
              id="plausible"
            />
          ) : null}
          <ToastProvider>
            <div className="min-h-screen">{children}</div>
            <Toaster />
          </ToastProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
