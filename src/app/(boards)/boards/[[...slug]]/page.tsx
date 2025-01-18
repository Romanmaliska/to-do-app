import { auth } from '@clerk/nextjs/server';
import { PopoverClose } from '@radix-ui/react-popover';
import Link from 'next/link';
import { BsPlus } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';

import {
  createNewBoard,
  createNewUser,
  getBoards,
  testDatabaseConnection,
} from '@/app/actions/notesActions';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import type { UserBoard } from '@/app/types/user';

export default async function BoardsPage() {
  const isMongoDBAlive = await testDatabaseConnection();
  if (!isMongoDBAlive) {
    return <div>Database is not connected</div>;
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  await createNewUser(userId);

  const userBoards: UserBoard[] | null = await getBoards(userId);

  return (
    <div className='max-w-[1080px] mx-auto p-8'>
      <h1 className='font-extrabold text-4xl text-white pb-8'>
        Welcome to your boards page
      </h1>

      <div className='flex items-center gap-4 pb-8'>
        <FaRegUser className='text-white' size={16} />
        <h1 className='font-extrabold text-xl text-white'>Stared boards</h1>
      </div>

      <div className='flex items-center gap-4 pb-8'>
        <FaRegUser className='text-white' size={16} />
        <h1 className='font-extrabold text-xl text-white'>Your boards</h1>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {userBoards?.map((board) => {
          return (
            <Link href={`/board/${board.boardId}`} key={board.boardId}>
              <div
                key={board.boardId}
                className='w-[200px] h-[100px] bg-grey rounded-md p-4'
              >
                <h2>{board.boardName}</h2>
              </div>
            </Link>
          );
        })}
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
                  <Label htmlFor='boardName'>Background</Label>
                  <Input
                    id='boardName'
                    className='col-span-2 h-8'
                    placeholder='Board name'
                    type='text'
                    name='boardName'
                    minLength={1}
                  />
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
      </div>
    </div>
  );
}
