'use client';

import { PopoverClose } from '@radix-ui/react-popover';
import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

import { createNewBoard } from '../../actions/actions';

type Props = {
  userId: string | null;
  isInNavbar?: boolean;
};

export default function AddBoardButton({ userId, isInNavbar }: Props) {
  const [inputValue, setInputValue] = useState('');

  if (!userId) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={`flex gap-2 align-middle ${
            isInNavbar
              ? 'bg-darkBlue text-white hover:bg-blue hover:text-white'
              : 'w-[200px] max-w-[200px] bg-lightBlue text-white hover:bg-blue hover:text-white'
          }`}
          variant={'outline'}
        >
          <BsPlus size={18} />
          {isInNavbar ? 'Create Board' : 'Add new board'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='bg-white text-black w-80'
        align='end'
        sideOffset={+16}
      >
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Create new board</h4>
          </div>
          <form
            className='grid gap-4'
            action={createNewBoard.bind(null, userId)}
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
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <PopoverClose asChild>
              <Button
                disabled={inputValue.length === 0}
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
  );
}
