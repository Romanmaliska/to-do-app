import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { UserColumn, UserNote } from '@/app/types/note';

import { updateColumnTitle } from '../actions/notesActions';
import { handleAddNote, handleDeleteColumn } from '../lib/hooks';
import Note from './note';
import { Button } from './ui/button';
import { Input } from './ui/input';
import NewNoteButton from './newNoteButton';

type Props = {
  columns: UserColumn[];
  column: UserColumn;
  notes: UserNote[];
  setOptimisticColumns: (columns: UserColumn[]) => void;
};

export default function NotesColumn({
  columns,
  column,
  notes,
  setOptimisticColumns,
}: Props) {
  const [isColumnTitleUpdated, setIsColumnTitleUpdated] = useState(false);

  const handleUpdateColumnTitle = (formData: FormData) => {
    const columnTitle = formData.get('columnTitle') as string;
    const newColumns = columns.map((col) => {
      if (col.columnId !== column.columnId) return col;
      return { ...col, columnTitle };
    });
    setIsColumnTitleUpdated(!isColumnTitleUpdated);
    setOptimisticColumns(newColumns);
    updateColumnTitle(column.columnId, columnTitle);
  };

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
    disabled: isColumnTitleUpdated,
    data: { type: 'column', column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        className='flex flex-col w-60 h-96 rounded-md bg-gold'
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  return (
    <div
      className='flex flex-col w-52 min-h-80 rounded-md border border-gray-300'
      ref={setNodeRef}
      style={style}
    >
      <div className='h-14 cursor-grab rounded-md rounded-b-none p-3 border-spacing-4'>
        <div className='flex gap-4' {...attributes} {...listeners}>
          <div>
            {isColumnTitleUpdated ? (
              <form action={handleUpdateColumnTitle}>
                <Input type='text' minLength={1} name='columnTitle' autoFocus />
              </form>
            ) : (
              <h5
                onClick={() => setIsColumnTitleUpdated(!isColumnTitleUpdated)}
              >
                {column.columnTitle}
              </h5>
            )}
          </div>
          <form
            action={handleDeleteColumn.bind(
              null,
              setOptimisticColumns,
              column.columnId,
              columns,
            )}
          >
            <Button variant='outline' size='sm'>
              <FaRegTrashAlt />
            </Button>
          </form>
        </div>
      </div>

      <SortableContext items={notesIds}>
        {notes.map((note: UserNote) => {
          return (
            <Note
              key={note.noteId}
              columns={columns}
              note={note}
              columnId={column.columnId}
              setOptimisticColumns={setOptimisticColumns}
            />
          );
        })}
      </SortableContext>
      <NewNoteButton
        setOptimisticColumns={setOptimisticColumns}
        columns={columns}
        columnId={column.columnId}
      />
    </div>
  );
}
