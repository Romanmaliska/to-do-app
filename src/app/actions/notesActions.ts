'use server';

import { UniqueIdentifier } from '@dnd-kit/core';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

import mongoDBclient from '@/app/lib/mongodb';
import type {
  User,
  UserColumn,
  UserDocument,
  UserNote,
} from '@/app/types/note';
import { TestContext } from 'node:test';

export async function testDatabaseConnection() {
  let isConnected = false;
  const mongoClient = await mongoDBclient.connect();
  try {
    // Send a ping to confirm a successful connection
    await mongoClient.db('users').command({ ping: 1 });

    console.log(' You successfully connected to MongoDB!');

    return !isConnected;
  } catch (e) {
    console.log(e);
    return isConnected;
  }
}

export async function createNewUser(userId: string) {
  const newUser = {
    userId,
    columns: [],
  };

  try {
    const collection = mongoDBclient.db('users').collection('users');
    const existingUser = await collection.findOne({ userId });

    if (!existingUser) {
      await collection.insertOne(newUser);
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getSortedColumns(userId: string) {
  const columnDocument: UserDocument | null = await mongoDBclient
    .db('users')
    .collection<UserDocument>('users')
    .findOne({ userId });

  if (!columnDocument?.columns?.length) return null;

  const sortedColumns: UserColumn[] = columnDocument.columns
    .map(({ notes, ...data }) => {
      return {
        ...data,
        notes: notes?.length
          ? notes.toSorted((a, b) => a.noteIndex - b.noteIndex)
          : [],
      };
    })
    .toSorted((a, b) => a.columnIndex - b.columnIndex);

  return sortedColumns;
}

export async function addNewColumn(userId: string, newColumn: UserColumn) {
  await mongoDBclient
    .db('users')
    .collection<Document>('users')
    .updateOne({ userId }, { $push: { columns: newColumn } });

  revalidatePath('/board');
}

export async function deleteColumn(userId: string, newColumns: UserColumn[]) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateColumnTitle({
  userId,
  newColumns,
}: {
  userId: string;
  newColumns: UserColumn[];
}) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateColumnsPosition(
  userId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function addNewNote(userId: string, newColumns: UserColumn[]) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function deleteNote(userId: string, newColumns: UserColumn[]) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateNotePositionInsideColumn(
  userId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateNotePositionOutsideColumn(
  userId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection<Document>('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function moveNoteToEmptyColumn(
  userId: string,
  newColumns: UserColumn[],
) {
  try {
    await mongoDBclient
      .db('users')
      .collection('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}

export async function updateNote(userId: string, newColumns: UserColumn[]) {
  try {
    await mongoDBclient
      .db('users')
      .collection('users')
      .updateOne({ userId }, { $set: { columns: newColumns } });

    revalidatePath('/board');
  } catch (e) {
    console.log(e);
  }
}
