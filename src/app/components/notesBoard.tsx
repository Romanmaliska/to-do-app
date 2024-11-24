'use client';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
} from '@dnd-kit/core';
import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import { generateId } from '@/app/lib/utils';
import NotesColumn from './notesColumn';
import { Button } from './ui/button';

import type { UserNoteWithStringifiedId } from '@/app/types/note';
import Note from './note';

export default function NotesBoard({
  notesWithStringId,
}: {
  notesWithStringId: UserNoteWithStringifiedId[];
}) {
  const [notes, setNotes] = useState<any>([]);

  const [columns, setColumns] = useState<
    { columnTitle: string; columnId: string }[]
  >([]);
  const columnsIds = useMemo(
    () => columns.map((col) => col.columnId),
    [columns],
  );

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);

  const addNewColumn = () => {
    const newColumn = {
      columnTitle: `New column ${columns.length + 1}`,
      columnId: generateId(),
    };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (columnId: string) => {
    const newColumns = columns.filter((column) => column.columnId !== columnId);
    const newNotes = notes.filter((note) => note.columnId !== columnId);

    setColumns(newColumns);
    setNotes(newNotes);
  };

  const updateColumnTitle = (columnId: string, newTitle: string) => {
    const newColumns = columns.map((col) => {
      if (col.columnId !== columnId) return col;
      return { ...col, columnTitle: newTitle };
    });

    setColumns(newColumns);
  };

  const addNewNoteIntoColumn = (columnId: string) => {
    setNotes([
      ...notes,
      { columnId, noteId: generateId(), noteText: 'New Note' },
    ]);
  };

  const updateNoteText = (noteId: string, newText: string) => {
    const newNotes = notes.map((note: any) => {
      if (note.noteId !== noteId) return note;
      return { ...note, noteText: newText };
    });

    setNotes(newNotes);
  };

  const deleteNoteFromColumn = (noteId: string) => {
    const newNotes = notes.filter((note: any) => note.noteId !== noteId);
    setNotes(newNotes);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data?.current?.type === 'column') {
      setDraggedColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data?.current?.type === 'note') {
      setDraggedNote(event.active.data?.current?.note);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveNote = active.data?.current?.type === 'note';
    const isOverNote = over.data?.current?.type === 'note';

    if (!isActiveNote) return;

    // dropped note on note
    if (isOverNote) {
      const activeIndex = notes.findIndex((note) => note.noteId === activeId);
      const overIndex = notes.findIndex((note) => note.noteId === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      const newNotes = notes
        .with(activeIndex, notes[overIndex])
        .with(overIndex, notes[activeIndex]);

      setNotes(newNotes);
      return;
    }

    // dropped note on column
    const isOverColumn = over.data?.current?.type === 'column';

    if (isOverColumn) {
      const newNotes = notes.map((note) => {
        if (note.noteId === activeId) return { ...note, columnId: overId };

        return note;
      });

      setNotes(newNotes);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedNote(null);
    setDraggedColumn(null);

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
        onDragOver={handleDragOver}
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
              updateNoteText={updateNoteText}
              deleteNoteFromColumn={deleteNoteFromColumn}
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
                updateColumnTitle={updateColumnTitle}
                addNewNoteIntoColumn={addNewNoteIntoColumn}
                updateNoteText={updateNoteText}
                deleteNoteFromColumn={deleteNoteFromColumn}
              />
            )}
            {draggedNote && (
              <Note
                note={draggedNote}
                updateNoteText={updateNoteText}
                deleteNoteFromColumn={deleteNoteFromColumn}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}
