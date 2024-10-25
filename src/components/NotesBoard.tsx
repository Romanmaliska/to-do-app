import { getNotes } from '@/app/actions/mongoDBactions';

import Note from '@/components/ui/note';

import type { UserNote } from '@/types/note';

export default async function NotesBoard() {
  const notes: UserNote[] = await getNotes();
  const notesWithStringId = notes.map((note: UserNote) => {
    return { ...note, _id: note._id.toString() };
  });

  return (
    <>
      {notesWithStringId.map((note) => (
        <Note key={note._id} note={note} />
      ))}
    </>
  );
}
