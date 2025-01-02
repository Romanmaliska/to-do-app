import { FocusEvent, useTransition } from 'react';

import { deleteNote, updateNote } from '../actions/notesActions';
import { UserColumn, UserNote } from '../types/user';
import { Button } from './ui/button';
import { Input } from './ui/input';

type Props = {
  columns: UserColumn[];
  columnId: string;
  note: UserNote;
  userId: string;
  setOptimisticColumns: (columns: UserColumn[]) => void;
  setIsNoteUpdated: (isAddNoteClicked: boolean) => void;
};

export default function UpdateNoteButton({
  setOptimisticColumns,
  setIsNoteUpdated,
  columns,
  columnId,
  note,
  userId,
}: Props) {
  const [_, startTransition] = useTransition();

  const handleUpdateNoteText = async (noteText: string) => {
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

    await updateNote(userId, newColumns);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsNoteUpdated(false);

    const relatedTarget = (event.relatedTarget as HTMLElement)?.id;

    if (relatedTarget === 'saveButton') {
      const noteText = (event.target as HTMLButtonElement).form?.noteText.value;
      startTransition(async () => {
        await handleUpdateNoteText(noteText);
      });
    }

    if (relatedTarget === 'deleteButton') {
      const newColumns = columns.map((col) => ({
        ...col,
        notes: col.notes.filter((n) => n.noteId !== note.noteId),
      }));

      startTransition(async () => {
        setOptimisticColumns(newColumns);
        await deleteNote(userId, newColumns);
      });
    }
  };

  return (
    <form>
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
        <Button className='bg-blue hover:bg-lighterBlue' id='saveButton'>
          Save
        </Button>
        <Button variant='destructive' id='deleteButton'>
          Delete
        </Button>
      </div>
    </form>
  );
}
