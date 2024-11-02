'use client';

import {
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
} from '@dnd-kit/core';

import { generateId, notesDivededByState } from '@/app/lib/utils';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import type { UserNoteWithStringifiedId } from '@/app/types/note';
import NotesColumn from './notesColumn';

export default function NotesBoard({
  notesWithStringId,
}: {
  notesWithStringId: UserNoteWithStringifiedId[];
}) {
  const [columns, setColumns] = useState<
    { columnTitle: string; columnId: string }[]
  >([]);

  const columnsIds = useMemo(
    () => columns.map((col) => col.columnId),
    [columns],
  );

  const [notes, setNotes] = useState<any>([]);

  console.log(notes);
  console.log(columns);

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const addNewColumn = () => {
    const newColumn = {
      columnTitle: `New column ${columns.length + 1}`,
      columnId: generateId(),
    };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = columns.filter((column) => column.columnId !== columnId);
    setColumns(newColumns);
  };

  const updateColumnTitle = (columnId: string, newTitle: string) => {
    const newColumns = columns.map((col) => {
      if (col.columnId !== columnId) return col;
      return { ...col, columnTitle: newTitle };
    });

    setColumns(newColumns);
  };

  const addNewNoteIntoColumn = (columnId: string) => {
    setNotes([...notes, { columnId, noteId: generateId() }]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log(event);
    if (event.active.data?.current?.type === 'column') {
      setDraggedColumn(event.active.data.current.column);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = columns.findIndex((col) => col.columnId === active.id);
    const overIndex = columns.findIndex((col) => col.columnId === over.id);

    if (activeIndex === -1 || overIndex === -1) return;

    const newColumns = columns
      .with(activeIndex, columns[overIndex])
      .with(overIndex, columns[activeIndex]);

    setColumns(newColumns);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  );

  return (
    <div className='flex m-auto gap-4'>
      <Button onClick={addNewColumn}>Add new column</Button>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={columnsIds}>
          {columns.map((col) => (
            <NotesColumn
              key={col.columnId}
              column={col}
              notes={notes.filter((note) => note.columnId === col.columnId)}
              deleteColumn={deleteColumn}
              updateColumnTitle={updateColumnTitle}
              addNewNoteIntoColumn={addNewNoteIntoColumn}
            />
          ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {draggedColumn && (
              <NotesColumn
                column={draggedColumn}
                notes={notes}
                deleteColumn={deleteColumn}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}
