import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
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
    <ClerkProvider>
      <html lang='en'>
        <body className={clsx(inter.className, 'flex flex-col antialiased')}>
          <header className='flex flex-2 p-2 bg-darkBlue'>
            <Navbar />
          </header>
          <main className='flex p-2'>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
