'use server';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { PopoverClose } from '@radix-ui/react-popover';
import { BsPlus } from 'react-icons/bs';

import { Label } from '@/app/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

import { createNewBoard } from '../actions/notesActions';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className='flex justify-between align-middle gap-4 w-full p-2 text-white'>
      <h1 className='font-extrabold'>Another Todo App</h1>
      <SignedIn>
        <div className='flex gap-8 align-middle'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className='flex gap-2 align-middle bg-lightBlue text-white hover:bg-blue hover:text-white'
                variant={'outline'}
              >
                <BsPlus size={18} />
                Add new board
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='bg-white text-black w-80'
              align='end'
              sideOffset={+8}
            >
              <div className='grid gap-4'>
                <div className='space-y-2'>
                  <h4 className='font-medium leading-none'>Create new board</h4>
                </div>
                <form
                  className='grid gap-4'
                  action={createNewBoard.bind(null, userId as string)}
                >
                  <div className='flex flex-col gap-4'>
                    <Label htmlFor='boardName'>Board name</Label>
                    <Input
                      id='boardName'
                      className='col-span-2 h-8'
                      placeholder='Board name'
                      type='text'
                      name='boardName'
                      minLength={1}
                    />
                  </div>
                  <PopoverClose asChild>
                    <Button
                      className='bg-darkBlue text-white hover:bg-blue hover:text-white'
                      type='submit'
                      variant={'outline'}
                    >
                      Create board
                    </Button>
                  </PopoverClose>
                </form>
              </div>
            </PopoverContent>
          </Popover>

          <UserButton />
        </div>
      </SignedIn>
    </nav>
  );
}
