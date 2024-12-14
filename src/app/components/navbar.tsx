import { Button } from '@/app/components/ui/button';

export default function Navbar() {
  return (
    <header className='flex place-content-between content-center gap-4 p-8'>
      <h1>Another Todo App</h1>
      <nav className='flex gap-4'>
        <Button>Sign in</Button>
      </nav>
    </header>
  );
}
