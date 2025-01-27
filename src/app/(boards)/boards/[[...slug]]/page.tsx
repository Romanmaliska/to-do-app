import { auth } from '@clerk/nextjs/server';
import { PopoverClose } from '@radix-ui/react-popover';
import { BsPlus } from 'react-icons/bs';
import { FaRegUser, FaStar } from 'react-icons/fa';

import BoardTile from '@/app/(boards)/_components/boardTile';
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
  const starredBoards = userBoards?.filter((board) => board.starred) || [];

  return (
    <div className='p-8'>
      <p className='font-extrabold text-pretty text-4xl text-white pb-8'>
        Welcome to your boards
      </p>
      <div className='flex items-center gap-4 pb-8'>
        <FaStar className='text-white' size={16} />
        <h1 className='font-extrabold text-xl text-white'>Starred boards</h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4'>
        {starredBoards?.map((board) => (
          <BoardTile key={board.boardId} board={board} userId={userId} />
        ))}
      </div>
      <div className='flex items-center gap-4 pb-8'>
        <FaRegUser className='text-white' size={16} />
        <h1 className='font-extrabold text-xl text-white'>Your boards</h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4'>
        {userBoards?.map((board) => {
          return (
            <BoardTile key={board.boardId} board={board} userId={userId} />
          );
        })}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className='flex gap-2 align-middle w-[200px] max-w-[200px] bg-lightBlue text-white hover:bg-blue hover:text-white'
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
      </div>
    </div>
  );
}
