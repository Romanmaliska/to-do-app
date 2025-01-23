'use server';

import { SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Form from 'next/form';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { Button } from './components/ui/button';

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect('/boards');

  return (
    <div className='flex justify-between w-full'>
      <div className='flex flex-col gap-8 items-start w-full md:w-1/2 p-16'>
        <h1 className='font-extrabold text-white text-6xl'>
          Your Brain is Full. Let Us Hold the Rest.
        </h1>
        <p className='font-extrabold text-white text-3xl'>
          Stop pretending you’ll remember. Let our app be your second brain.
        </p>
        <SignedOut>
          <Form
            className='flex justify-between gap-8 w-full'
            action={`/sign-up`}
          >
            <input
              className='w-full rounded-lg p-2'
              type='email'
              placeholder='Email'
              name={`email_address`}
            />
            <div className='p-1 rounded-lg bg-gradient-to-r from-yellow from-10%  via-darkBlue via-40% to-red to-90% text-white'>
              <Button
                className='border-none bg-white hover:bg-grey text-black font-bold'
                type='submit'
              >
                Sign up for free
              </Button>
            </div>
          </Form>
        </SignedOut>
      </div>
      <div className='hidden md:flex items-center place-content-center w-1/2'>
        <Image src='/preview.png' alt='hero' width={800} height={800} />
      </div>
    </div>
  );
}
