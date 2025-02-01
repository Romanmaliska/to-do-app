import { auth } from '@clerk/nextjs/server';
import { FaRegUser, FaStar } from 'react-icons/fa';

import BoardTile from '@/app/(boards)/_components/boardTile';
import {
  createNewUser,
  getBoards,
  testDatabaseConnection,
} from '@/app/actions/actions';
import AddBoardButton from '@/app/components/ui/addBoardButton';
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

        <AddBoardButton userId={userId} />
      </div>
    </div>
  );
}
