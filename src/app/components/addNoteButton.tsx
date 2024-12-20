import { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

import { handleAddNote } from '../lib/hooks';
import { UserColumn } from '../types/note';
import { Button } from './ui/button';
import CloseButton from './ui/closeButton';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[];
  columnId: string;
  setOptimisticColumns: (columns: UserColumn[]) => void;
};

export default function AddNoteButton({
  setOptimisticColumns,
  columns,
  columnId,
}: Props) {
  const [isAddNoteClicked, setIsAddNoteClicked] = useState(false);

  const handleAddNoteText = (formData: FormData) => {
    const noteText = formData.get('noteText') as string;
    handleAddNote(setOptimisticColumns, columns, columnId, noteText);
    setIsAddNoteClicked(false);
  };

  return isAddNoteClicked ? (
    <form action={handleAddNoteText}>
      <Input
        className='mb-2 border-0 rounded-md focus-visible:ring-blue'
        name='noteText'
        type='text'
        autoFocus
        minLength={1}
        required
      ></Input>
      <div className='flex justify-between items-center gap-2'>
        <Button className='bg-blue hover:bg-lighterBlue'>Add note</Button>
        <CloseButton handleClick={setIsAddNoteClicked} />
      </div>
    </form>
  ) : (
    <Button
      className='flex items-center justify-start gap-1 h-9 pl-3 hover:bg-darkGrey'
      variant='ghost'
      onClick={() => setIsAddNoteClicked(!isAddNoteClicked)}
    >
      <BsPlus size={18} /> Add a note
    </Button>
  );
}
