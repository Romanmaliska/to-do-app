'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';

import Droppable from '@/components/ui/droppable';
import Note from '@/components/note';

import type { UserNoteWithStringifiedId } from '@/types/note';
import { notesDivededByState } from '@/lib/utils';
import { updateNoteState } from '@/app/actions/mongoDBactions';

export default function Notes({
  notesWithStringId,
}: {
  notesWithStringId: UserNoteWithStringifiedId[];
}) {
  const { newNotes, inProgressNotes, doneNotes } =
    notesDivededByState(notesWithStringId);

  const handleDragEnd = (event: DragEndEvent) => {
    if (['new', 'progress', 'done'].includes(event.over?.id)) {
      console.log(event);
      console.log('Dropped in inProgress');
      updateNoteState(event.over.id, event.active.id);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Droppable id="new">
        <section className="">
          <h2 className="text-1xl md:text-2xl pb-4 text-center">To Do</h2>
          {newNotes.map((note) => (
            <Note key={note._id} note={note} />
          ))}
        </section>
      </Droppable>

      <Droppable id="progress">
        <section>
          <h2 className="text-1xl md:text-2xl pb-4 text-center">In Progress</h2>
          {inProgressNotes.map((note) => (
            <Note key={note._id} note={note} />
          ))}
        </section>
      </Droppable>

      <Droppable id="done">
        <section>
          <h2 className="text-1xl md:text-2xl pb-4 text-center">Done</h2>
          {doneNotes.map((note) => (
            <Note key={note._id} note={note} />
          ))}
        </section>
      </Droppable>
    </DndContext>
  );
}
