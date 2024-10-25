import { testDatabaseConnection } from '@/app/actions/mongoDBactions';

import NotesBoard from '@/components/notesBoard';

export default async function Home() {
  const isMongoDBAlive = await testDatabaseConnection();

  return (
    <main className="grid grid-cols-3 gap-2 md:gap-4 p-4 md:p-8">
      <NotesBoard />
    </main>
  );
}
