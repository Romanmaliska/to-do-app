'use server';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

import AddNewBoard from '@/app/components/ui/addBoardButton';

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className='flex justify-between align-middle gap-4 w-full p-2 text-white'>
      <Link href={userId ? '/boards' : '/'}>
        <h1 className='font-extrabold'>Another Todo App</h1>
      </Link>
      <SignedIn>
        <div className='flex gap-8'>
          <AddNewBoard userId={userId} isInNavbar />
          <UserButton />
        </div>
      </SignedIn>
    </nav>
  );
}
