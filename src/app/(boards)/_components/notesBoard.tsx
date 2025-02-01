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
import { useParams } from 'next/navigation';
import { useMemo, useOptimistic, useState, useTransition } from 'react';

import NotesColumn from '@/app/(boards)/_components/notesColumn';
import { updateColumns } from '@/app/actions/actions';
import type { UserBoard, UserColumn, UserNote } from '@/app/types/user';

import AddColumnButton from './addColumnButton';

const Portal = dynamic(() => import('./portal'), { ssr: false });

type Props = {
  board: UserBoard | null;
  userId: string;
};

export default function NotesBoard({ board, userId }: Props) {
  const { columns = null, boardName } = board || {};
  const [optimisticColumns, setOptimisticColumns] = useOptimistic(columns);
  const { boardId } = useParams<{ boardId: string }>();
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
      const activeId = active.data?.current?.column.columnId;
      const overId = over.data?.current?.column.columnId;

      if (!activeId || !overId) return;

      const activeIndex = columns.findIndex((col) => col.columnId === activeId);
      const overIndex = columns.findIndex((col) => col.columnId === overId);

      const newColumns = columns
        .with(activeIndex, columns[overIndex])
        .with(overIndex, columns[activeIndex]);

      startTransition(async () => {
        setOptimisticColumns(newColumns);
        await updateColumns(userId, boardId, newColumns);
      });
    }

    // dropped note on note in the same column
    if (draggedType === 'note' && draggedOverType === 'note') {
      const activeNote = active.data?.current?.note;
      const overNote = over.data?.current?.note;
      const columnId = active.data?.current?.columnId;
      const overColumnId = over.data?.current?.columnId;

      if (activeNote.noteId === overNote.noteId || columnId !== overColumnId)
        return;

      const newColumns = columns.map((col) => {
        if (col.columnId === columnId) {
          return {
            ...col,
            notes: col.notes.map((note) => {
              if (note.noteId === activeNote.noteId) return overNote;
              if (note.noteId === overNote.noteId) return activeNote;
              return note;
            }),
          };
        }

        return col;
      });

      startTransition(async () => {
        setOptimisticColumns(newColumns);
        await updateColumns(userId, boardId, newColumns);
      });
    }

    setDraggedNote(null);
    setDraggedColumn(null);
  };

  const handleNoteDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (
      !over ||
      !columns ||
      active.data?.current?.columnId === over.data?.current?.columnId
    )
      return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const isActiveNote = active.data?.current?.type === 'note';
    const isOverNote = over.data?.current?.type === 'note';
    const isOverColumn = over.data?.current?.type === 'column';
    const activeColumnIndex = columns.findIndex(
      (col) => active.data?.current?.columnId === col.columnId,
    );

    const overColumnIndex = columns.findIndex(
      (col) =>
        overId === col.columnId ||
        over.data?.current?.columnId === col.columnId,
    );

    const activeNote = columns[activeColumnIndex].notes.find(
      (note) => note.noteId === activeId,
    );

    if (
      !isActiveNote ||
      !activeNote ||
      activeColumnIndex < 0 ||
      overColumnIndex < 0 ||
      activeColumnIndex === overColumnIndex
    )
      return;

    let newColumns = columns;

    // dropped note on note in different column
    if (isOverNote) {
      const overNoteIndex = columns[overColumnIndex].notes.findIndex(
        (note) => note.noteId === overId,
      );
      newColumns = columns.map((col, index) => {
        if (activeColumnIndex === index) {
          return {
            ...col,
            notes: col.notes.filter((note) => note.noteId !== activeId),
          };
        }

        if (overColumnIndex === index) {
          return {
            ...col,
            notes: col.notes.toSpliced(overNoteIndex + 1, 0, activeNote),
          };
        }

        return col;
      });
    }

    // dropped note on column
    if (isOverColumn) {
      newColumns = columns.map((col, index) => {
        if (overId === col.columnId) {
          return {
            ...col,
            notes: [activeNote, ...col.notes],
          };
        }
        if (activeColumnIndex === index) {
          return {
            ...col,
            notes: col.notes.filter((note) => note.noteId !== activeId),
          };
        }
        return col;
      });
    }

    startTransition(async () => {
      setOptimisticColumns(newColumns);
      await updateColumns(userId, boardId, newColumns);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  );

  return (
    <>
      <h2 className='text-white font-extrabold text-xl pb-6'>
        {boardName || ''}
      </h2>
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
    </>
  );
}
