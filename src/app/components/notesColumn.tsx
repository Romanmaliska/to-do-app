import { FaRegTrashAlt } from 'react-icons/fa';
import { Button } from './ui/button';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import Note from './note';

export default function NotesColumn({
  column,
  notes,
  deleteColumn,
  updateColumnTitle,
  addNewNoteIntoColumn,
  deleteNoteFromColumn,
  updateNoteText,
}: any) {
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
        className='flex flex-col w-60 h-96 max-h-[500px] rounded-md bg-gold'
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  return (
    <div
      className='flex flex-col w-60 h-96 max-h-[500px] rounded-md bg-silver'
      ref={setNodeRef}
      style={style}
    >
      <div className='h-14 cursor-grab rounded-md rounded-b-none p-3 border-spacing-4'>
        <div className='flex gap-4' {...attributes} {...listeners}>
          <div>0</div>
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
          <Button
            variant='outline'
            size='sm'
            onClick={() => deleteColumn(column.columnId)}
          >
            <FaRegTrashAlt />
          </Button>
        </div>
      </div>
      <div className='flex flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto'></div>
      <SortableContext items={notesIds}>
        {notes.map((note: any) => {
          return (
            <Note
              key={note.noteId}
              note={note}
              deleteNoteFromColumn={deleteNoteFromColumn}
              updateNoteText={updateNoteText}
            >
              note
            </Note>
          );
        })}
      </SortableContext>
      <Button onClick={() => addNewNoteIntoColumn(column.columnId)}>
        Add Note
      </Button>
    </div>
  );
}
