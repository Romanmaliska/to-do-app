'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import mongoDBclient from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

import type { UserNoteDocument } from '@/types/note';

export async function testDatabaseConnection() {
  let isConnected = false;
  const mongoClient = await mongoDBclient.connect();
  try {
    // Send a ping to confirm a successful connection
    await mongoClient.db('admin').command({ ping: 1 });

    console.log(' You successfully connected to MongoDB!');

    return !isConnected;
  } catch (e) {
    console.error(e);
    return isConnected;
  }
}

export async function getNotes() {
  return await mongoDBclient
    .db('notes')
    .collection<UserNoteDocument>('notes')
    .find()
    .toArray();
}

export async function addNewNote({
  tittle,
  text,
}: Pick<UserNoteDocument, 'tittle' | 'text'>) {
  await mongoDBclient.db('notes').collection('notes').insertOne({
    tittle,
    text,
    createdAt: new Date(),
    updatedAt: new Date(),
    state: 'new',
  });

  revalidatePath('/');
  redirect('/');
}

export async function deleteNote(_id: string) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .deleteOne({ _id: new ObjectId(_id) });

  revalidatePath('/');
}

export async function updateNote(
  { tittle, text }: { tittle: string; text: string },
  _id: string,
) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne({ _id: new ObjectId(_id) }, { $set: { tittle, text } });

  revalidatePath('/');
}

export async function updateNoteState(state: string, _id: string) {
  await mongoDBclient
    .db('notes')
    .collection('notes')
    .updateOne({ _id: new ObjectId(_id) }, { $set: { state } });

  revalidatePath('/');
}
