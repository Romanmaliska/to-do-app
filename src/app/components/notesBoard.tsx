'use client';

import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
} from '@dnd-kit/core';
import { DndContext, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import dynamic from 'next/dynamic';
import { useMemo, useOptimistic, useState, useTransition } from 'react';

import {
  moveNoteToEmptyColumn,
  updateColumnsPosition,
  updateNotePositionInsideColumn,
  updateNotePositionOutsideColumn,
} from '@/app/actions/notesActions';
import NotesColumn from '@/app/components/notesColumn';
import type { UserColumn, UserNote } from '@/app/types/note';

import AddColumnButton from './addColumnButton';

const Portal = dynamic(() => import('./portal'), { ssr: false });

type Props = {
  columns: UserColumn[] | null;
  userId: string;
};

export default function NotesBoard({ columns, userId }: Props) {
  const [optimisticColumns, setOptimisticColumns] = useOptimistic(columns);

  const [_, startTransition] = useTransition();

  const columnsIds = useMemo(
    () => (columns ? columns.map((col) => col.columnId) : []),
    [columns],
  );

  const [draggedColumn, setDraggedColumn] = useState<UserColumn | null>(null);
  const [draggedNote, setDraggedNote] = useState<UserNote | null>(null);

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
    const { active, over } = event;
    if (!over || active.id === over.id || !columns) return;

    const draggedType: string = active.data?.current?.type;
    const draggedOverType: string = over.data?.current?.type;

    // dropped column on column
    if (draggedType === 'column' && draggedOverType === 'column') {
      const activeIndex = active.data?.current?.column.columnIndex;
      const overIndex = over.data?.current?.column.columnIndex;

      const newColumns = columns
        .with(activeIndex, columns[overIndex])
        .with(overIndex, columns[activeIndex]);

      startTransition(async () => {
        setOptimisticColumns(newColumns);

        await updateColumnsPosition({
          overIndex,
          activeIndex,
          overId: over.id,
          activeId: active.id,
        });
      });
    }

    // dropped note on note in the same column
    if (draggedType === 'note' && draggedOverType === 'note') {
      const activeIndex = active.data?.current?.note.noteIndex;
      const overIndex = over.data?.current?.note.noteIndex;
      const columnId = active.data?.current?.columnId;

      const newColumns = columns.map((col) => {
        if (col.columnId === columnId) {
          return {
            ...col,
            notes: col.notes
              .map((note) => {
                if (note.noteIndex === activeIndex) {
                  return { ...note, noteIndex: overIndex };
                } else if (note.noteIndex === overIndex) {
                  return { ...note, noteIndex: activeIndex };
                }
                return note;
              })
              .toSorted((a, b) => a.noteIndex - b.noteIndex),
          };
        }
        return col;
      });

      startTransition(async () => {
        setOptimisticColumns(newColumns);

        await updateNotePositionInsideColumn({
          columnId,
          newNotes: newColumns.find((col) => col.columnId === columnId)!.notes,
        });
      });
    }

    setDraggedNote(null);
    setDraggedColumn(null);
  };

  const handleNoteDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !columns) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveNote = active.data?.current?.type === 'note';
    const isOverNote = over.data?.current?.type === 'note';
    const isOverColumn = over.data?.current?.type === 'column';
    const isAlreadyNoteInColumn =
      isOverColumn &&
      over?.data?.current?.column.notes?.some(
        (note: UserNote) => note.noteId === activeId,
      );

    if (!isActiveNote || isAlreadyNoteInColumn) return;

    // dropped note on note in different column
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
          {optimisticColumns &&
            optimisticColumns.map((column) => (
              <NotesColumn
                key={column.columnId}
                columns={optimisticColumns}
                column={column}
                notes={column.notes}
                userId={userId}
                setOptimisticColumns={setOptimisticColumns}
              />
            ))}
        </SortableContext>
        <Portal draggedColumn={draggedColumn} draggedNote={draggedNote} />
      </DndContext>

      <AddColumnButton
        setOptimisticColumns={setOptimisticColumns}
        columns={optimisticColumns}
        userId={userId}
      />
    </div>
  );
}
