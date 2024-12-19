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
          'flex flex-col h-screen max-w-[2160px] mx-auto antialiase  bg-blue  text-black',
        )}
      >
        <header className='flex flex-2 p-2 bg-darkBlue'>
          <Navbar />
        </header>
        <main className='flex flex-1 p-2'>{children}</main>
      </body>
    </html>
  );
}
