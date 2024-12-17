import { FaRegTrashAlt } from 'react-icons/fa';
import { Button } from './ui/button';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import Note from './note';
import { UserColumn, UserNote } from '@/app/types/note';

type Props = {
  column: UserColumn;
  notes: UserNote[];
  handleDeleteColumn: (columnId: string) => void;
  updateColumnTitle: () => void;
  handleAddNote: (columnId: string) => void;
  handleDeleteNote: (columnId: string, noteId: string) => void;
  updateNoteText: any;
};

export default function NotesColumn({
  column,
  notes,
  handleDeleteColumn,
  updateColumnTitle,
  handleAddNote,
  handleDeleteNote,
  updateNoteText,
}: Props) {
  const [columnTitle, setColumnTitle] = useState('');
  const [isTitleUpdated, setIsTitleUpdate] = useState(false);
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
    disabled: isTitleUpdated,
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
            {isTitleUpdated ? (
              <input
                type='text'
                minLength={1}
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                onBlur={() => {
                  updateColumnTitle(column.columnId, columnTitle);
                  setIsTitleUpdate(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && columnTitle) {
                    setIsTitleUpdate(false);
                    updateColumnTitle(column.columnId, columnTitle);
                  }
                }}
                autoFocus
              />
            ) : (
              <h3 onClick={() => setIsTitleUpdate(true)}>
                {column.columnTitle}
              </h3>
            )}
          </div>
          <form action={handleDeleteColumn.bind(null, column.columnId)}>
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
              note={note}
              columnId={column.columnId}
              handleDeleteNote={handleDeleteNote}
              updateNoteText={updateNoteText}
            />
          );
        })}
      </SortableContext>

      <form action={handleAddNote.bind(null, column.columnId)}>
        <Button variant='outline'>Add Note</Button>
      </form>
    </div>
  );
}
