import { testDatabaseConnection } from '@/app/actions/notesActions';
import { getNotes } from '@/app/actions/notesActions';

import type { UserNoteDocument } from '@/app/types/note';

import NotesBoard from '@/app/components/notesBoard';

export default async function Home() {
  const isMongoDBAlive = await testDatabaseConnection();
  if (!isMongoDBAlive) {
    return <div>Database is not connected</div>;
  }

  const notes: UserNoteDocument[] = await getNotes();

  const notesWithStringId = notes.map((note) => {
    return { ...note, _id: note._id.toString() };
  });

  return (
    <main className='flex m-auto min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10'>
      <NotesBoard notesWithStringId={notesWithStringId} />
    </main>
  );
}
