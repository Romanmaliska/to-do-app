import { useParams } from 'next/navigation';
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
  const { boardId } = useParams<{ boardId: string }>();

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsNoteUpdated(false);

    const relatedTarget = (event.relatedTarget as HTMLElement)?.id;

    if (relatedTarget === 'saveButton') {
      const noteText = (event.target as HTMLButtonElement).form?.noteText.value;
      if (!noteText || note.noteText === noteText) return;

      const newNote = { ...note, noteText };
      const newColumns = columns.map((col) => {
        if (col.columnId === columnId) {
          return {
            ...col,
            notes: col.notes.map((n) =>
              n.noteId === note.noteId ? newNote : n,
            ),
          };
        }
        return col;
      });

      startTransition(async () => {
        setOptimisticColumns(newColumns);
        await updateNote(userId, boardId, newColumns);
      });
    }

    if (relatedTarget === 'deleteButton') {
      const newColumns = columns.map((col) => ({
        ...col,
        notes: col.notes.filter((n) => n.noteId !== note.noteId),
      }));

      startTransition(async () => {
        setOptimisticColumns(newColumns);
        await deleteNote(userId, boardId, newColumns);
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
