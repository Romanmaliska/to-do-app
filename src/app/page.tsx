import { testDatabaseConnection, getNotes } from '@/app/actions/notesActions';

import NotesBoard from '@/app/components/notesBoard';

import type { UserColumnDocument, UserColumn } from '@/app/types/note';

export default async function Home() {
  const isMongoDBAlive = await testDatabaseConnection();
  if (!isMongoDBAlive) {
    return <div>Database is not connected</div>;
  }

  const columnDocument: UserColumnDocument[] = await getNotes();
  const columns: UserColumn[] = columnDocument
    .map(({ _id, ...data }) => {
      return {
        ...data,
        columnId: _id.toString(),
      };
    })
    .toSorted((a, b) => a.columnIndex - b.columnIndex);

  return (
    <main className='w-full overflow-x-auto overflow-y-hidden px-8'>
      <NotesBoard columns={columns} />
    </main>
  );
}
