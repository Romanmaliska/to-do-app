'use server';

import { SignedOut } from '@clerk/nextjs';
import Form from 'next/form';

import { Button } from './components/ui/button';

export default async function Home() {
  return (
    <div className='w-1/2 p-16'>
      <div className='flex flex-col gap-8 items-start'>
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
      <div className='w-1/2'></div>
    </div>
  );
}
