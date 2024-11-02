import { FaRegTrashAlt } from 'react-icons/fa';
import { Button } from './ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

export default function NotesColumn({
  column,
  notes,
  deleteColumn,
  updateColumnTitle,
  addNewNoteIntoColumn,
}: any) {
  const [columnTitle, setColumnTitle] = useState('');
  const [isTitleUpdated, setIsTitleUpdate] = useState(false);
  const [noteText, setNoteText] = useState('');

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
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                onBlur={() => {
                  updateColumnTitle(column.columnId, columnTitle);
                  setIsTitleUpdate(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
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
      <div className='flex flex-grow'></div>
      {notes.map(({ noteId }: any) => {
        return <div key={noteId}>note</div>;
      })}
      <Button onClick={() => addNewNoteIntoColumn(column.columnId)}>
        Add Note
      </Button>
    </div>
  );
}
