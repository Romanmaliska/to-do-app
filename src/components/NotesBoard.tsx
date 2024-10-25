import { getNotes } from '@/app/actions/mongoDBactions';

import type { UserNoteDocument } from '@/types/note';
import Notes from './notes';

export default async function NotesBoard() {
  const notes: UserNoteDocument[] = await getNotes();
  
  const notesWithStringId = notes.map((note) => {
    return { ...note, _id: note._id.toString() };
  });

  return <Notes notesWithStringId={notesWithStringId} />;
}
