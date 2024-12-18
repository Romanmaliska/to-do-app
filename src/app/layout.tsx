import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import clsx from 'clsx';

import Navbar from '@/app/components/navbar';

export const metadata: Metadata = {
  title: 'Another Todo App',
  description: 'A todo app built with Next.js and Tailwind CSS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={clsx(
          inter.className,
          'grid grid-rows-[auto_1fr_auto] max-w-[1080px] mx-auto antialiased',
        )}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
