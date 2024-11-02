'use client';

import { deleteNote } from '@/app/actions/notesActions';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import UpdateNoteDialog from '@/app/components/updateNoteDialog';

import type { UserNoteWithStringifiedId } from '@/app/types/note';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Note({ note }: { note: UserNoteWithStringifiedId }) {
  const { tittle, text, _id: id, position } = note;

  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({ id: position });

  // const style = {
  //   transform: CSS.Transform.toString(transform),
  //   transition,
  // };

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className='m-2 md:m-4'
    >
      <CardContent className='flex flex-col gap-8'>
        <CardDescription>{text}</CardDescription>
        <div className='flex gap-4 place-content-end'>
          <DeleteNoteButton id={id} />
          <UpdateNoteDialog id={id} />
        </div>
      </CardContent>
    </Card>
  );
}

function DeleteNoteButton({ id }: { id: UserNoteWithStringifiedId['_id'] }) {
  const deleteNoteWithId = deleteNote.bind(null, id);
  return (
    <form action={deleteNoteWithId}>
      <Button variant='destructive' size='sm'>
        Delete
      </Button>
    </form>
  );
}
