import { testDatabaseConnection } from '@/app/actions/mongoDBactions';

import NotesBoard from '@/components/NotesBoard';

export default async function Home() {
  const isMongoDBAlive = await testDatabaseConnection();

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-8">
      <NotesBoard />
    </main>
  );
}
