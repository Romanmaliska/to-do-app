import { BsPlus } from 'react-icons/bs';

import { Button } from '@/app/components/ui/button';
import { UserColumn } from '@/app/types/user';

type Props = {
  draggedColumn: UserColumn;
};

export default function NotesColumnSkeleton({ draggedColumn }: Props) {
  return (
    <div className='flex flex-col w-52 h-fit rounded-xl bg-grey p-2'>
      <h1 className='min-w-32 rounded-md h-9 p-2 pl-4 mb-2'>
        {draggedColumn.columnTitle}
      </h1>
      {draggedColumn.notes.map((note) => (
        <p
          className='h-9 m-1 px-4 py-2 bg-white border-0 rounded-md'
          key={note.noteId}
        >
          {note.noteText}
        </p>
      ))}
      <Button
        className='flex items-center justify-start gap-1 mt-1 h-9 pl-3 bg-grey p-2'
        variant='ghost'
      >
        <BsPlus size={18} /> Add a note
      </Button>
    </div>
  );
}
