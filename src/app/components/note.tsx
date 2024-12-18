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

export default function Note({
  note,
  columns,
  columnId,
  updateNoteText,
  setOptimisticColumns,
}: {
  note: UserNote;
  columns: UserColumn[];
  columnId: string;
  updateNoteText: any;
  setOptimisticColumns: (columns: UserColumn[]) => void;
}) {
  const [noteText, setNoteText] = useState('');
  const [isNoteUpdated, setIsNoteUpdated] = useState(false);

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

  const toggleUpdateNote = () => {
    setIsNoteUpdated((prev) => !prev);
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
      className='m-2 md:m-4'
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className='flex flex-col gap-8'>
        <div className='flex gap-4 place-content-end'>
          <h1>{note.noteId}</h1>
          {/* {isNoteUpdated ? (
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={() => {
                toggleUpdateNote();
                updateNoteText(note.noteId, noteText);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  toggleUpdateNote();
                  updateNoteText(note.noteId, noteText);
                }
              }}
              autoFocus
            />
          ) : (
            <p onClick={() => toggleUpdateNote()}>{note.noteText}</p>
          )} */}
        </div>

        <form
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
        </form>
      </div>
    </div>
  );
}
