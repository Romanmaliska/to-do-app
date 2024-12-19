'use client';

import {
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
} from '@dnd-kit/core';
import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useMemo, useOptimistic, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';

import {
  moveNoteToEmptyColumn,
  updateColumnsPosition,
  updateNotePositionInsideColumn,
  updateNotePositionOutsideColumn,
} from '@/app/actions/notesActions';
import NotesColumn from '@/app/components/notesColumn';
import NotesColumnSkeleton from '@/app/components/notesColumnSkeleton';
import type { UserColumn, UserNote } from '@/app/types/note';

import NewColumnButton from './newColumnButton';
import NoteSkeleton from './noteSkeleton';

export default function NotesBoard({ columns }: { columns: UserColumn[] }) {
  const [optimisticColumns, setOptimisticColumns] = useOptimistic(columns);

  const [_, startTransition] = useTransition();

  const columnsIds = useMemo(
    () => columns.map((col) => col.columnId),
    [columns],
  );

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data?.current?.type === 'column') {
      setDraggedColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data?.current?.type === 'note') {
      setDraggedNote(event.active.data?.current?.note);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    handleColumnDragEnd(event);
    setDraggedNote(null);
    setDraggedColumn(null);
  };

  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = columns.findIndex((col) => col.columnId === active.id);
    const overIndex = columns.findIndex((col) => col.columnId === over.id);

    if (activeIndex === -1 || overIndex === -1) return;

    const newColumns = columns
      .with(activeIndex, columns[overIndex])
      .with(overIndex, columns[activeIndex]);

    startTransition(async () => {
      setOptimisticColumns(newColumns);
      await updateColumnsPosition({
        overIndex: columns[overIndex].columnIndex,
        activeIndex: columns[activeIndex].columnIndex,
        overId: over.id,
        activeId: active.id,
      });
    });
  };

  const handleNoteDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    console.log('active', active);
    console.log('over', over);

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveNote = active.data?.current?.type === 'note';
    const isOverNote = over.data?.current?.type === 'note';
    const isOverColumn = over.data?.current?.type === 'column';

    if (!isActiveNote) return;

    // dropped note on note
    if (isOverNote) {
      const activeColumnIndex = columns.findIndex((col) =>
        col.notes.find((note) => note.noteId === activeId),
      );

      const overColumnIndex = columns.findIndex((col) =>
        col.notes.find((note) => note.noteId === overId),
      );

      if (activeColumnIndex < 0 && overColumnIndex < 0) return;

      const activeNoteIndex = columns[activeColumnIndex].notes.findIndex(
        (note) => note.noteId === activeId,
      );

      const overNoteIndex = columns[overColumnIndex].notes.findIndex(
        (note) => note.noteId === overId,
      );

      const activeNote = columns[activeColumnIndex].notes.find(
        (note) => note.noteId === activeId,
      );

      if (!activeNote) return;

      // dropped note on note in the same column
      if (activeColumnIndex === overColumnIndex) {
        const newColumns = columns.map((col) => ({
          ...col,
          notes: col.notes.map((note) => ({ ...note })),
        }));
        const activeNote = newColumns[activeColumnIndex].notes[activeNoteIndex];
        const overNote = newColumns[overColumnIndex].notes[overNoteIndex];

        if (!activeNote || !overNote) return;

        [activeNote.noteIndex, overNote.noteIndex] = [
          overNote.noteIndex,
          activeNote.noteIndex,
        ];

        startTransition(async () => {
          setOptimisticColumns(
            newColumns.map((col) => ({
              ...col,
              notes: col.notes.toSorted((a, b) => a.noteIndex - b.noteIndex),
            })),
          );

          await updateNotePositionInsideColumn({
            activeColumnId: columns[activeColumnIndex].columnId,
            activeNoteIndex,
            overNoteIndex,
            activeNoteId: activeId,
            overNoteId: overId,
          });
        });

        return;
      }

      // dropped note on note in different columns
      if (activeColumnIndex !== overColumnIndex) {
        // add note to new column and increase noteIndexes
        const newColumns = columns.map((col, index) => {
          if (activeColumnIndex === index) {
            return {
              ...col,
              notes: col.notes.reduce<UserNote[]>((acc, curr, i) => {
                if (i < activeNoteIndex) return [...acc, curr];
                if (i === activeNoteIndex) return acc;
                return [...acc, { ...curr, noteIndex: i - 1 }];
              }, []),
            };
          }

          if (overColumnIndex === index) {
            return {
              ...col,
              notes: col.notes.reduce<UserNote[]>((acc, curr, i) => {
                if (i < overNoteIndex) return [...acc, curr];
                if (i === overNoteIndex)
                  return [
                    ...acc,
                    { ...curr, noteIndex: i },
                    { ...activeNote, noteIndex: i + 1 },
                  ];
                return [...acc, { ...curr, noteIndex: i + 2 }];
              }, []),
            };
          }

          return col;
        });

        startTransition(async () => {
          setOptimisticColumns(
            newColumns.map((col) => ({
              ...col,
              notes: col.notes.toSorted((a, b) => a.noteIndex - b.noteIndex),
            })),
          );

          await updateNotePositionOutsideColumn({
            activeColumnId: columns[activeColumnIndex].columnId,
            overColumnId: columns[overColumnIndex].columnId,
            activeNoteIndex,
            overNoteIndex,
            activeNoteId: activeId,
            activeNoteText: activeNote.noteText,
          });
        });

        return;
      }
    }

    // dropped note on empty column
    if (isOverColumn) {
      const activeColumnIndex = columns.findIndex((col) =>
        col.notes.find((note) => note.noteId === activeId),
      );
      const activeNoteIndex = columns[activeColumnIndex].notes.findIndex(
        (note) => note.noteId === activeId,
      );

      const activeNote = columns[activeColumnIndex].notes.find(
        (note) => note.noteId === activeId,
      );

      if (!activeNote) return;

      const newColumns = columns.map((col, index) => {
        if (overId === col.columnId) {
          return {
            ...col,
            notes: [{ ...activeNote, noteIndex: 0 }],
          };
        }
        if (activeColumnIndex === index) {
          return {
            ...col,
            notes: col.notes.reduce<UserNote[]>((acc, curr, i) => {
              if (i < activeNoteIndex) return [...acc, curr];
              if (i === activeNoteIndex) return acc;
              return [...acc, { ...curr, noteIndex: i - 1 }];
            }, []),
          };
        }

        return col;
      });

      startTransition(async () => {
        setOptimisticColumns(
          newColumns.map((col) => ({
            ...col,
            notes: col.notes.toSorted((a, b) => a.noteIndex - b.noteIndex),
          })),
        );

        await moveNoteToEmptyColumn({
          activeColumnId: columns[activeColumnIndex].columnId,
          activeNoteIndex,
          activeNoteText: activeNote.noteText,
          activeNoteId: activeId,
          overColumnId: overId,
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  );

  return (
    <div className='flex gap-4'>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleNoteDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={columnsIds}>
          {optimisticColumns.map((column) => (
            <NotesColumn
              columns={columns}
              key={column.columnId}
              column={column}
              notes={column.notes}
              setOptimisticColumns={setOptimisticColumns}
            />
          ))}
        </SortableContext>

        {createPortal(
          <DragOverlay>
            {draggedColumn && <NotesColumnSkeleton />}
            {draggedNote && <NoteSkeleton />}
          </DragOverlay>,
          document?.body,
        )}
      </DndContext>
      <NewColumnButton
        setOptimisticColumns={setOptimisticColumns}
        columns={columns}
      />
    </div>
  );
}
