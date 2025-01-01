import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';

import { UserColumn, UserNote } from '@/app/types/note';

import AddNoteButton from './addNoteButton';
import Note from './note';
import NotesColumnHeader from './notesColumnHeader';

type Props = {
  columns: UserColumn[];
  column: UserColumn;
  notes: UserNote[];
  userId: string;
  setOptimisticColumns: (columns: UserColumn[]) => void;
};

export default function NotesColumn({
  columns,
  column,
  notes,
  userId,
  setOptimisticColumns,
}: Props) {
  const notesIds = useMemo(
    () => notes.map((note: any) => note.noteId),
    [notes],
  );

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.columnId,
    // disabled: isColumnTitleUpdated,
    data: { type: 'column', column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        className='flex flex-col w-52 rounded-xl bg-grey p-2'
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  return (
    <div
      className='flex flex-col w-52 h-fit rounded-xl bg-grey p-2'
      style={style}
      ref={setNodeRef}
    >
      {columns && (
        <>
          <div {...attributes} {...listeners}>
            <NotesColumnHeader
              setOptimisticColumns={setOptimisticColumns}
              columns={columns}
              column={column}
              userId={userId}
            />
          </div>
          <SortableContext items={notesIds}>
            {notes.map((note: UserNote) => {
              return (
                <Note
                  key={note.noteId}
                  columns={columns}
                  note={note}
                  columnId={column.columnId}
                  userId={userId}
                  setOptimisticColumns={setOptimisticColumns}
                />
              );
            })}
          </SortableContext>

          <AddNoteButton
            setOptimisticColumns={setOptimisticColumns}
            columns={columns}
            columnId={column.columnId}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}
