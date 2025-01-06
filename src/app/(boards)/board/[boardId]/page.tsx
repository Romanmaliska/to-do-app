import { auth } from '@clerk/nextjs/server';

import { getBoards } from '@/app/actions/notesActions';
import NotesBoard from '@/app/components/notesBoard';
import { UserBoard } from '@/app/types/user';

type Props = { params: Promise<{ boardId: string }> };

export default async function BoardPage({ params }: Props) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  const userBoards: UserBoard[] | null = await getBoards(userId);

  const { boardId } = await params;
  const columns =
    userBoards?.find((board) => board.boardId === boardId)?.columns || null;

  return <NotesBoard userId={userId} columns={columns} />;
}
