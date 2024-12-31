import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className='flex place-content-between content-center gap-4 p-2 text-white'>
      <Link href='/'>
        <h1 className='font-extrabold'>Another Todo App</h1>
      </Link>
      <div className='flex gap-4'>
        <SignedIn>
          <UserButton />
          <Link href='/board'>
            <Button>board</Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  );
}
