import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='flex items-center justify-center content-center pt-8 w-screen'>
      <SignUp forceRedirectUrl={'/boards'} />;
    </div>
  );
}
