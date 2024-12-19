import { useState } from 'react';

import { handleAddColumn, handleAddNote } from '../lib/hooks';
import { UserColumn } from '../types/note';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[];
  columnId: string;
  setOptimisticColumns: (columns: UserColumn[]) => void;
};

export default function NewNoteButton({
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
      <Input autoFocus type='text' minLength={1} name='noteText'></Input>
      <Button>Add Note</Button>
      <Button
        onClick={(e) => {
          e.preventDefault(), setIsAddNoteClicked(false);
        }}
      >
        x
      </Button>
    </form>
  ) : (
    <Button variant='outline' onClick={() => setIsAddNoteClicked(true)}>
      Add a note
    </Button>
  );
}
