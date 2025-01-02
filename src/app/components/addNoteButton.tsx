import { FocusEvent, useState, useTransition } from 'react';
import { BsPlus } from 'react-icons/bs';

import { handleAddNote } from '../lib/handlers';
import { UserColumn } from '../types/user';
import { Button } from './ui/button';
import CloseButton from './ui/closeButton';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[];
  columnId: string;
  setOptimisticColumns: (columns: UserColumn[]) => void;
  userId: string;
};

export default function AddNoteButton({
  setOptimisticColumns,
  columns,
  columnId,
  userId,
}: Props) {
  const [_, startTransition] = useTransition();
  const [isAddNoteClicked, setIsAddNoteClicked] = useState(false);

  const handleAddNoteText = async (noteText: string) => {
    setIsAddNoteClicked(!isAddNoteClicked);

    if (!noteText) return;

    await handleAddNote({
      setOptimisticColumns,
      columns,
      columnId,
      noteText,
      userId,
    });
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    startTransition(async () => {
      await handleAddNoteText(event.target.value);
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const columnTitle = formData.get('noteText') as string;
    await handleAddNoteText(columnTitle);
  };

  return isAddNoteClicked ? (
    <form action={handleSubmit}>
      <Input
        className='mb-2 mt-1 border-0 rounded-md focus-visible:ring-blue'
        onBlur={handleBlur}
        name='noteText'
        type='text'
        autoFocus
        minLength={1}
        required
        autoComplete='off'
      ></Input>
      <div className='flex justify-between items-center gap-2'>
        <Button className='bg-blue hover:bg-lighterBlue'>Add note</Button>
        <CloseButton handleClick={setIsAddNoteClicked} />
      </div>
    </form>
  ) : (
    <Button
      className='flex items-center justify-start gap-1 mt-1 h-9 pl-3 hover:bg-darkGrey'
      variant='ghost'
      onClick={() => setIsAddNoteClicked(!isAddNoteClicked)}
    >
      <BsPlus size={18} /> Add a note
    </Button>
  );
}
