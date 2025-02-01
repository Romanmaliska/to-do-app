import { auth } from '@clerk/nextjs/server';

import NotesBoard from '@/app/(boards)/_components/notesBoard';
import Sidebar from '@/app/(boards)/_components/sidebar';
import { getBoards } from '@/app/actions/actions';
import { UserBoard } from '@/app/types/user';

type Props = { params: Promise<{ boardId: string }> };

export default async function BoardPage({ params }: Props) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const userBoards: UserBoard[] | null = await getBoards(userId);
  const { boardId } = await params;
  const board = userBoards?.find((board) => board.boardId === boardId) || null;

  return (
    <>
      <aside className='px-2'>
        <Sidebar userId={userId} boardId={boardId} userBoards={userBoards} />
      </aside>
      <section>
        <NotesBoard userId={userId} board={board} />
      </section>
    </>
  );
}
