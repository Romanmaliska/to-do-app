import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

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
    <div>
      <div className='pb-8'>
        <h1 className='font-extrabold text-2xl text-white'>
          Welcome to your boards page
        </h1>
      </div>
      <div className='grid grid-cols-8 gap-4'>
        {userBoards.map((board) => {
          return (
            <Link href={`/board/${board.boardId}`} key={board.boardId}>
              <div
                key={board.boardId}
                className='w-[200px] h-[200px] bg-grey rounded-md p-4'
              >
                <p>{board.boardName}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
