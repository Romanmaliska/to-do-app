import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { FaRegUser } from 'react-icons/fa';

import {
  createNewUser,
  getBoards,
  testDatabaseConnection,
} from '@/app/actions/notesActions';
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

  if (!userBoards) return <div>Boards not found</div>;

  return (
    <div className='max-w-[1080px] mx-auto p-8'>
      <div className='flex gap-4 pb-8'>
        <FaRegUser className='font-extrabold text-white text-2xl' />
        <h1 className='font-extrabold text-2xl text-white'>
          Welcome to your boards page
        </h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {userBoards.map((board) => {
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
      </div>
    </div>
  );
}
