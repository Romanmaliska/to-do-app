"use client";

import { deleteNote } from "@/app/actions/mongoDBactions";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { UserNoteWithStringifiedId } from "@/types/note";

export default function Note({ note }: { note: UserNoteWithStringifiedId }) {
  const { tittle, text, _id: id } = note;

  const handleDelete = async (id: string) => {
    await deleteNote(id);
  };

  return (
    <Card>
      <CardHeader>{tittle}</CardHeader>
      <CardContent>
        <CardDescription>{text}</CardDescription>
      </CardContent>
      <CardFooter className="flex gap-4 place-content-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
