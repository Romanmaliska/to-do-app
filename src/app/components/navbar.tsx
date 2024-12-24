import Link from 'next/link';

import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className='flex place-content-between content-center gap-4 p-2 text-white'>
      <Link href='/'>
        <h1 className='font-extrabold'>Another Todo App</h1>
      </Link>
      <div className='flex gap-4'>
        <Link href='/sign-in'>
          <Button>Sign in</Button>
        </Link>
      </div>
    </nav>
  );
}
