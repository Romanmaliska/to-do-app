'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/app/components/ui/card';
import { handleDeleteNote } from '@/app/lib/hooks';
import type { UserColumn, UserNote } from '@/app/types/note';

import { Input } from './ui/input';

export default function Note({
  note,
  columns,
  columnId,
  setOptimisticColumns,
}: {
  note: UserNote;
  columns: UserColumn[];
  columnId: string;
  setOptimisticColumns: (columns: UserColumn[]) => void;
}) {
  const [noteText, setNoteText] = useState('');
  const [isNoteUpdated, setIsNoteUpdated] = useState(false);

  const updateNoteText = (noteId: string, newText: string) => {
    // const newNotes = notesState.map((note: any) => {
    //   if (note.noteId !== noteId) return note;
    //   return { ...note, noteText: newText };
    // });
    // setNotes(newNotes);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.noteId,
    disabled: isNoteUpdated,
    data: { type: 'note', note },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div className='m-2 md:m-4' ref={setNodeRef} style={style}>
        is draging
      </div>
    );
  }

  return (
    <div
      className='py-1'
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {isNoteUpdated ? (
        <Input
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onBlur={() => {
            updateNoteText(note.noteId, noteText);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateNoteText(note.noteId, noteText);
            }
          }}
          autoFocus
        />
      ) : (
        <p onClick={() => {}}>{note.noteText}</p>
      )}

      {/* <form
          action={handleDeleteNote.bind(
            null,
            setOptimisticColumns,
            columnId,
            columns,
            note.noteId,
          )}
        >
          <Button variant='destructive' size='sm'>
            Delete
          </Button>
        </form> */}
    </div>
  );
}
