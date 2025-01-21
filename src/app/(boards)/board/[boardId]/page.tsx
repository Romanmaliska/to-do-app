import NotesBoard from '@/app/(boards)/_components/notesBoard';
import { getBoards } from '@/app/actions/notesActions';
import { UserBoard } from '@/app/types/user';

type Props = { params: Promise<{ boardId: string }> };

export default async function BoardPage({ params }: Props) {}
