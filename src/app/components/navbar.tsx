import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <nav className='flex place-content-between content-center gap-4 p-2 text-white'>
      <h1 className='font-extrabold'>Another Todo App</h1>
      <div className='flex gap-4'>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
