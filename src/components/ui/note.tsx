'use client';

import { deleteNote } from '@/app/actions/mongoDBactions';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UpdateNoteDialog from '@/components/updateNoteDialog';

import type { UserNoteWithStringifiedId } from '@/types/note';

export default function Note({ note }: { note: UserNoteWithStringifiedId }) {
  const { tittle, text, _id: id } = note;

  return (
    <Card>
      <CardHeader>{tittle}</CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <CardDescription>{text}</CardDescription>
        <div className="flex gap-4 place-content-end ">
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
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}
