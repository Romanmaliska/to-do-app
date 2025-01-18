import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='flex items-center justify-center content-center pt-8 w-screen'>
      <SignIn forceRedirectUrl={'/boards'} />
    </div>
  );
}
