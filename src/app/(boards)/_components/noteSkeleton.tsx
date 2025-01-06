import { UserNote } from '@/app/types/user';

type Props = {
  draggedNote: UserNote;
};

export default function NoteSkeleton({ draggedNote }: Props) {
  return (
    <p className='h-9 m-1 px-4 py-2 bg-white border-0 rounded-md transform -rotate-12'>
      {draggedNote.noteText}
    </p>
  );
}
