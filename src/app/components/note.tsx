'use client';

import { deleteNote } from '@/app/actions/notesActions';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import UpdateNoteDialog from '@/app/components/updateNoteDialog';

import type { UserNoteWithStringifiedId } from '@/app/types/note';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

export default function Note({
  updateNoteText,
  deleteNoteFromColumn,
  note,
}: {
  updateNoteText: any;
  deleteNoteFromColumn: any;
  note: any;
}) {
  const [noteText, setNoteText] = useState('');
  const [isHoveringOverNote, setIsHoveringOverNote] = useState(false);
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
    setIsHoveringOverNote(false);
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
      onMouseEnter={() => setIsHoveringOverNote(true)}
      onMouseLeave={() => setIsHoveringOverNote(false)}
    >
      <div className='flex flex-col gap-8'>
        <div className='flex gap-4 place-content-end'>
          {isNoteUpdated ? (
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
            <div onClick={() => toggleUpdateNote()}>{note.noteText}</div>
          )}
          {/* {isHoveringOverNote && (
            // <button onClick={() => deleteNoteFromColumn(note.noteId)}>
            //   Delete
            // </button>
          )} */}
        </div>
      </div>
    </div>
  );
}

function DeleteNoteButton({ id }: { id: UserNoteWithStringifiedId['_id'] }) {
  // const deleteNoteWithId = deleteNote.bind(null, id);
  // return (
  //   <form action={deleteNoteWithId}>
  //     <Button variant='destructive' size='sm'>
  //       Delete
  //     </Button>
  //   </form>
  // );
}
