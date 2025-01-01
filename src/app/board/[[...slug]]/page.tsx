import { after } from 'node:test';

import { auth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';

import {
  createNewUser,
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

  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  await createNewUser(userId);

  const columns: UserColumn[] | null = await getSortedColumns(userId);

  return <NotesBoard userId={userId} columns={columns} />;
}
