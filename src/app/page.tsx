import {
  getSortedColumns,
  testDatabaseConnection,
} from '@/app/actions/notesActions';
import NotesBoard from '@/app/components/notesBoard';
import type { UserColumn } from '@/app/types/note';

export default async function Home() {
  const isMongoDBAlive = await testDatabaseConnection();
  if (!isMongoDBAlive) {
    return <div>Database is not connected</div>;
  }

  const columns: UserColumn[] = await getSortedColumns();
  console.log(columns);

  return (
    <main className='w-full overflow-x-auto overflow-y-hidden px-8'>
      <NotesBoard columns={columns} />
    </main>
  );
}
