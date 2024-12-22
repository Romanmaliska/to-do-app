import { FocusEvent, useTransition } from 'react';
import { set } from 'react-hook-form';

import { updateNote } from '../actions/notesActions';
import { UserColumn, UserNote } from '../types/note';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[];
  columnId: string;
  note: UserNote;
  setOptimisticColumns: (columns: UserColumn[]) => void;
  setIsNoteUpdated: (isAddNoteClicked: boolean) => void;
};

export default function UpdateNoteButton({
  setOptimisticColumns,
  setIsNoteUpdated,
  columns,
  columnId,
  note,
}: Props) {
  const [_, startTransition] = useTransition();

  const handleUpdateNoteText = async (noteText: string) => {
    setIsNoteUpdated(false);

    if (!noteText || note.noteText === noteText) return;

    const column = columns.find((col) => col.columnId === columnId);
    const noteIndex = column?.notes.findIndex((n) => n.noteId === note.noteId);
    const newColumns = columns.reduce((acc, curr) => {
      if (curr.columnId === columnId) {
        acc.push({
          ...curr,
          notes: curr.notes.map((n, i) =>
            i === noteIndex ? { ...n, noteText } : n,
          ),
        });
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as UserColumn[]);

    setOptimisticColumns(newColumns);

    await updateNote(columnId, note.noteId, noteText);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    startTransition(async () => {
      await handleUpdateNoteText(event.target.value);
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const columnTitle = formData.get('noteText') as string;
    await handleUpdateNoteText(columnTitle);
  };

  return (
    <form action={handleSubmit}>
      <Input
        className='mb-2 mt-1 border-0 rounded-md focus-visible:ring-blue'
        onBlur={handleBlur}
        name='noteText'
        type='text'
        autoFocus
        minLength={1}
        required
        defaultValue={note.noteText}
        autoComplete='off'
      ></Input>
      <div className='flex justify-between items-center gap-2'>
        <Button className='bg-blue hover:bg-lighterBlue'>Save</Button>
      </div>
    </form>
  );
}
