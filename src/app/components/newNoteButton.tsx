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
    <div>
      <form action={handleAddNoteText}>
        <Input autoFocus type='text' name='noteText'></Input>
      </form>
    </div>
  ) : (
    <Button variant='outline' onClick={() => setIsAddNoteClicked(true)}>
      Add new column
    </Button>
  );
}
