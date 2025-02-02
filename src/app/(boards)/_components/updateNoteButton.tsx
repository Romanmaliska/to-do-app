import { useParams } from 'next/navigation';
import { useTransition } from 'react';

import { updateColumns } from '@/app/actions/actions';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useOutsideClick } from '@/app/hooks/useOutsideClick';
import { UserColumn, UserNote } from '@/app/types/user';

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
  const ref = useOutsideClick(() => setIsNoteUpdated(false));

  const addNote = (formData: FormData) => {
    setIsNoteUpdated(false);

    const noteText = formData.get('noteText') as string;
    if (!noteText || note.noteText === noteText) return;

    const newNote = { ...note, noteText };
    const newColumns = columns.map((col) => {
      if (col.columnId === columnId) {
        return {
          ...col,
          notes: col.notes.map((n) => (n.noteId === note.noteId ? newNote : n)),
        };
      }
      return col;
    });

    startTransition(async () => {
      setOptimisticColumns(newColumns);
      await updateColumns(userId, boardId, newColumns);
    });
  };

  const deleteNote = () => {
    setIsNoteUpdated(false);

    const newColumns = columns.map((col) => ({
      ...col,
      notes: col.notes.filter((n) => n.noteId !== note.noteId),
    }));

    startTransition(async () => {
      setOptimisticColumns(newColumns);
      await updateColumns(userId, boardId, newColumns);
    });
  };

  return (
    <form ref={ref} action={addNote}>
      <Input
        className='mb-2 mt-1 border-0 rounded-md focus-visible:ring-blue'
        name='noteText'
        type='text'
        autoFocus
        minLength={1}
        required
        defaultValue={note.noteText}
        autoComplete='off'
      ></Input>
      <div className='flex justify-between items-center gap-2'>
        <Button
          className='bg-blue hover:bg-lighterBlue'
          type='submit'
          formAction={addNote}
        >
          Save
        </Button>
        <Button variant='destructive' formAction={deleteNote}>
          Delete
        </Button>
      </div>
    </form>
  );
}
