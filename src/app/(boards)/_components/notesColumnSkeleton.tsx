import { BsPlus } from 'react-icons/bs';

import { Button } from '@/app/components/ui/button';
import { UserColumn } from '@/app/types/user';

type Props = {
  draggedColumn: UserColumn;
};

export default function NotesColumnSkeleton({ draggedColumn }: Props) {
  return (
    <div className='flex flex-col w-52 h-16 rounded-xl bg-grey p-2'>
      <h2>{draggedColumn.columnTitle}</h2>
      {draggedColumn.notes.map((note) => (
        <p
          key={note.noteId}
          className='h-9 m-1 px-4 py-2 bg-white border-0 rounded-md transform -rotate-12'
        >
          {note.noteText}
        </p>
      ))}
      <Button
        className='flex items-center justify-start gap-1 mt-1 h-9 pl-3 hover:bg-darkGrey'
        variant='ghost'
      >
        <BsPlus size={18} /> Add a note
      </Button>
    </div>
  );
}
