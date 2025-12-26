'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

import type { UserColumn, UserNote } from '@/app/types/user';

import UpdateNoteButton from './updateNoteButton';

export default function Note({
  note,
  columns,
  columnId,
  userId,
  setOptimisticColumns,
}: {
  note: UserNote;
  columns: UserColumn[];
  columnId: string;
  userId: string;
  setOptimisticColumns: (columns: UserColumn[]) => void;
}) {
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
    data: { type: 'note', note, columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        className='h-9 m-1 px-4 py-2 bg-darkGrey bg-opacity-50 rounded-lg'
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  return (
    <div
      className='m-1 px-4 py-2 bg-white rounded-lg border hover:border-blue hover:border focus-visible:ring-blue'
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {isNoteUpdated ? (
        <UpdateNoteButton
          setOptimisticColumns={setOptimisticColumns}
          setIsNoteUpdated={setIsNoteUpdated}
          columns={columns}
          columnId={columnId}
          note={note}
          userId={userId}
        />
      ) : (
        <p onClick={() => setIsNoteUpdated(!isNoteUpdated)}>{note.noteText}</p>
      )}
    </div>
  );
}
